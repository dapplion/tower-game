import { call, fork, put, select, take, takeEvery } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import web3 from "./web3";
import towerGame from "./contracts/TowerGame.json";
import networks from "./networks.json";
import * as s from "./selectors";
import * as a from "./actions";
import Big from "big.js";

function* updateState() {
  try {
    /**
     * Fetch parameters
     */
    const contractAddress = yield select(s.getContractAddress);
    const towerGameContract = getTowerGameInstanceHelper(contractAddress);
    const width = yield select(s.getWidth);

    /**
     * Get state and update if necessary (Prevent useless updates)
     */
    const gameState = yield call(getGameStateHelper, towerGameContract, width);
    console.log({ gameState });
    yield put(a.updateGameState(gameState));
  } catch (e) {
    console.error(`Error on updateState: ${e.stack}`);
  }
}

function* subscribeToStateChanges() {
  try {
    /**
     * Fetch parameters
     */
    const contractAddress = yield select(s.getContractAddress);
    const towerGameContract = getTowerGameInstanceHelper(contractAddress);
    const width = yield select(s.getWidth);

    /**
     * Create subscription channel
     */
    const subscriptionChannel = eventChannel(emit => {
      subscribeToResultsHelper(towerGameContract, width, emit);
      return function unsubscribe() {};
    });
    while (true) {
      try {
        const event = yield take(subscriptionChannel);
        console.log("Received state changed event", event);
        yield put(a.updateResult(event.hash, event));
        yield fork(updateState);
        yield fork(getUserBalance);
        /**
         * Verify if this is a winning event for the user
         */
        const account = yield call(getUserAccountWithoutEnable);
        if (
          account &&
          event.player &&
          account.toLowerCase() === event.player.toLowerCase() &&
          event.fallingCoins > 0
        ) {
          const playPrice = yield select(s.getPlayPrice);
          const winAmount = Big(playPrice || 0)
            .div(Big(1e18))
            .times(event.fallingCoins)
            .toString();
          yield put(a.showWinModal(`You won ${winAmount} ETH`));
        }
      } catch (err) {
        console.error("subscriptionChannel error:", err);
      }
    }
  } catch (e) {
    console.error(`Error on subscribeToStateChanges: ${e.stack}`);
  }
}

function* initialize() {
  try {
    /**
     * Print feedback if metamask is not installed
     */
    if (!web3) {
      return yield put(
        a.updateFeedbackError(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        )
      );
    }

    /**
     * Fetch network information
     */
    yield put(a.updateFeedbackInfo("Loading network info..."));
    const networkId = yield call(web3.eth.net.getId);
    // networkMetadata = { name, desc }
    const networkMetadata = networks[networkId] || {};
    const contractAddress = (towerGame.networks[networkId] || {}).address;
    yield put(
      a.updateNetwork({ networkId, contractAddress, ...networkMetadata })
    );
    // Stop initialization, network ID not supported
    if (contractAddress) {
      yield put(a.updateFeedbackInfo(`Loaded network! ID ${networkId}`));
    } else {
      yield put(a.updateFeedbackError(`Network ID ${networkId} not supported`));
      return console.error(`Network ID ${networkId} not supported`);
    }
    // Fetch user balance if possible
    yield fork(getUserBalance);

    /**
     * Initialize game instance
     */

    const towerGameContract = getTowerGameInstanceHelper(contractAddress);
    // Get game settings
    const gameSettings = yield call(getGameSettingsHelper, towerGameContract);
    yield put(a.updateGameSettings(gameSettings));
    // Update game state
    yield put(a.updateFeedbackInfo("Updating game state..."));
    yield call(updateState);
    yield put(a.updateFeedbackInfo("Updated game state!"));
    // Fetch old events
    const indexedEvents = yield call(
      getPastResultsHelper,
      towerGameContract,
      gameSettings.width
    );
    yield put(a.updateResults(indexedEvents));
    // Subscribe to new events
    yield fork(subscribeToStateChanges);
  } catch (e) {
    console.error(`Error on initialize: ${e.stack}`);
  }
}

function* executePlay() {
  let id = randomHexString();
  try {
    /**
     * Fetch necessary parameters
     */
    const contractAddress = yield select(s.getContractAddress);
    const towerGameContract = getTowerGameInstanceHelper(contractAddress);

    const dx = yield select(s.getDx);
    const width = yield select(s.getWidth);
    const playPrice = yield select(s.getPlayPrice);
    const account = yield call(getUserAccount);
    // Fetch the user balance after a possible authorization
    yield fork(getUserBalance);
    const options = { from: account, value: playPrice };
    const dxScaled = dx === 1 ? dx * width - 1 : dx * width;

    /**
     * Create play instance and compute gas
     */

    const play = towerGameContract.methods.play(dxScaled);
    const gasEstimate = yield call(estimatePlayGasHelper, play, options);
    // Provide some overhead gas.
    // - If the gasUsed is exact, web3 or the node thinks it run out of gas
    // - If some other tx is run before this one, it may alter the amount of gas needed
    const gas = Math.floor(1.1 * gasEstimate);

    /**
     * Handle the transaction execution
     */
    const txChannel = eventChannel(emit => {
      play
        .send({ ...options, gas })
        // "transactionHash" returns String: is fired right after the transaction
        // is sent and a transaction hash is available.
        .on("transactionHash", hash => {
          id = hash;
          console.log(`tx id ${id} on transactionHash`, { hash });
          // Store initial state in the store to show in the UI
          emit({ hash, player: account, dx });
        })
        // "receipt" returns Object: is fired when the transaction receipt is available.
        // Receipts from contracts will have no logs property, but instead an events
        // property with event names as keys and events as properties.
        .on("receipt", receipt => {
          console.log(`tx id ${id} on receipt`, { receipt });
          emit(parseReceipt(receipt, width));
        })
        // "error" returns Error: is fired if an error occurs during sending.
        // If an out of gas error, the second parameter is the receipt.
        .on("error", (error, receipt) => {
          console.log(`tx id ${id} on receipt`, { error, receipt });
          emit({ error: parseErrorString(error.message) });
        });
      return function unsubscribe() {};
    });

    while (true) {
      try {
        const data = yield take(txChannel);
        yield put(a.updateResult(id, data));
      } catch (e) {
        console.error(`subscriptionChannel error: ${e.stack}`);
        yield put(a.updateResult(id, { error: parseErrorString(e.message) }));
      }
    }
  } catch (e) {
    console.error(`Error on executePlay: ${e.stack}`);
    yield put(a.updateResult(id, { error: parseErrorString(e.message) }));
  }
}

function* getUserBalance() {
  try {
    const account = yield call(getUserAccountWithoutEnable);
    if (account) {
      const balance = yield call(web3.eth.getBalance, account);
      yield put(a.updateBalance(balance));
    }
  } catch (e) {
    console.error(`Error on getUserBalance: ${e.stack}`);
  }
}

/**
 * Helpers
 * =======
 */

async function getUserAccountWithoutEnable() {
  // On modern dApp browsers the account maybe available
  if (window.ethereum) {
    return window.ethereum.selectedAddress;
  }
  // On non-modern dApp browser the accounts will be available for sure
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
}

async function getUserAccount() {
  // Enable accounts on modern dApp browsers
  if (window.ethereum && window.ethereum.enable) {
    await window.ethereum.enable();
  }
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
}

/**
 * Abstracts contract instance creation
 * @return {towerGameInstance} contract
 */
function getTowerGameInstanceHelper(address) {
  verifyArguments({ address }, { address: "string" });
  return new web3.eth.Contract(towerGame.abi, address);
}

/**
 * Fetch contract state
 * @param {towerGameInstance} contract
 *
 */
async function getGameStateHelper(contract, width) {
  verifyArguments({ contract, width }, { contract: "object", width: "string" });
  const relativePositions = await contract.methods
    .getCoinPositionsArray()
    .call();
  return parseGameState(relativePositions, width);
}

/**
 * Fetches the game settings:
 * - int width: 50000,
 * - int playPrice: 10000000000
 * @param {towerGameInstance} contract
 * @return {Object}
 */
async function getGameSettingsHelper(contract) {
  verifyArguments({ contract }, { contract: "object" });
  const [width, playPrice] = await Promise.all([
    contract.methods.width().call(),
    contract.methods.playPrice().call()
  ]);
  return { width, playPrice };
}

/**
 * Fetches past results from PlayResult events
 * @param {towerGameInstance} contract
 * @return {Array}
 */
async function getPastResultsHelper(contract, width) {
  verifyArguments({ contract, width }, { contract: "object", width: "string" });
  const events = await contract.getPastEvents("PlayResult", { fromBlock: 0 });
  const eventsIndexed = {};
  await Promise.all(
    events.map(async event => {
      const block = await web3.eth.getBlock(event.blockNumber);
      eventsIndexed[event.transactionHash] = {
        ...parsePlayResultEvent(event, width),
        timestamp: block.timestamp
      };
    })
  );
  return eventsIndexed;
}

/**
 * Subscribes to PlayResult events
 * {
 *    blockNumber: 10368774,
 *    returnValues: {
 *      coinCount: "2",
 *      dx: "-45000",
 *      fallingCoins: "2",
 *      player: "0x204A1159f..."
 *    }
 *  }
 * @param {towerGameInstance} contract
 * @param {Function} cb (error, event) => {}
 */
function subscribeToResultsHelper(contract, width, cb) {
  verifyArguments(
    { contract, width, cb },
    { contract: "object", width: "string", cb: "function" }
  );
  contract.events.PlayResult({}, (error, event) => {
    if (error) console.error("Error getting PlayResult event", error);
    else
      cb({
        ...parsePlayResultEvent(event, width),
        timestamp: Math.floor(Date.now() / 1000)
      });
  });
}

/**
 * Computes the estimated gas of the play method
 * @param {playMethodInstance} play
 * @param {Object} options {from: playerAddress, value: playPrice in Wei}
 */
async function estimatePlayGasHelper(play, options) {
  verifyArguments({ play, options }, { options: "object" });
  const maxGas = 5000000;
  const computedGas = await play.estimateGas({ ...options, gas: maxGas });
  if (computedGas >= maxGas) throw Error("Method ran out of gas");
  return computedGas;
}

/**
 * Random hex string of ~12 bytes
 */
function randomHexString() {
  return Big(String(Math.random()).slice(2) + Date.now()).toString(16);
}

/**
 * Utilities
 * =========
 */

/**
 * Computes the absolute positions of the game state from the relative positions
 * @param {Array} relativePositions [1000, -1000, 500]
 * @param {Integer} width 1000
 * @return {Array} [1, 0, 0.5]
 */
function parseGameState(dxs, width) {
  verifyArguments({ dxs, width }, { dxs: "array", width: "string" });
  const roundingDigits = 4;
  const widthBigNumber = Big(width);
  // First do a cumulative sum of the relative positions
  const xs = [];
  dxs
    .map(dx => Big(dx))
    .reduce((xPrev, dxi, i) => (xs[i] = xPrev.plus(dxi)), Big(0));
  return xs.map(x =>
    x
      .div(widthBigNumber)
      .round(roundingDigits)
      .toString()
  );
}

function parseReceipt(receipt, width) {
  verifyArguments({ receipt, width }, { receipt: "object", width: "string" });
  // PlayResult event may not be available
  const event = (receipt.events || {}).PlayResult;
  return {
    ...(event ? parsePlayResultEvent(event, width) : {}),
    timestamp: Math.floor(Date.now() / 1000),
    gasUsed: receipt.gasUsed
  };
}

/**
 * Parses a play result event
 * @param {event} event
 *  {
 *    transactionHash: 0x12012380abcbab3b31b42b412,
 *    blockNumber: 10368774,
 *    returnValues: {
 *      coinCount: "2",
 *      dx: "-45000",
 *      fallingCoins: "2",
 *      player: "0x204A1159f..."
 *    }
 *    raw: {
 *      topics: [
 *        '0xfd43ade1c09fa...', // Event id
 *        '0x7f9fade1c0d57...'  // First indexed parameter (abi encoded)
 *      ]
 *    }
 *  }
 */
function parsePlayResultEvent(event, width) {
  verifyArguments({ event, width }, { event: "object", width: "string" });
  return {
    // Return values:
    fallingCoins: event.returnValues.fallingCoins,
    coinCount: event.returnValues.coinCount,
    dx: parseDx(event.returnValues.dx, width),
    player: parsePlayer(event),
    // Transaction hash (if available):
    ...(event.transactionHash ? { hash: event.transactionHash } : {}),
    // BlockNumber (if available):
    ...(event.blockNumber ? { blockNumber: event.blockNumber } : {})
  };
}

/**
 * Return dx formated:
 * - +0.30
 * - -0.75
 * - +0.00
 * @param {String} dx
 * @param {String} width
 */
function parseDx(dx, width) {
  if (!width) return null;
  const dxString = width
    ? Big(dx)
        .div(Big(width))
        .round(2)
        .toString()
    : null;
  const dxDecimal = parseFloat(dxString).toFixed(2);
  return dxDecimal > 0 ? "+" + String(dxDecimal) : String(dxDecimal);
}

/**
 * For some wierd reason the indexed logged value "player" is not correctly parsed
 * and returns always the same address
 * @param {Object} event
 */
function parsePlayer(event) {
  verifyArguments({ event }, { event: "object" });
  const secondTopic = event.raw.topics[1];
  return secondTopic
    ? "0x" + secondTopic.slice(2 + 2 * (32 - 20))
    : event.returnValues.player;
}

function parseErrorString(s) {
  let stringToReturn;
  try {
    /**
     * - Split by newline and keep the first line only
     * - Try to parse JSON and assume it's an error object
     */
    /* eslint-disable no-useless-escape */

    if (!s) stringToReturn = s;
    else if (typeof s === "string") {
      stringToReturn = s = s.split(/\r?\n/)[0] || "";
      const possibleJsons = s.match(/\{.*\:.*\}/g);
      if (Array.isArray(possibleJsons)) {
        for (const possibleJson of possibleJsons) {
          try {
            const json = JSON.parse(possibleJson);
            if (json.message) {
              stringToReturn = json.message;
              break;
            }
          } catch (e) {
            //
          }
        }
        stringToReturn = s;
      }
    }
  } catch (e) {
    stringToReturn = s;
  } finally {
    return String(stringToReturn);
  }
}

/**
 * Verify arguments
 * @param {Object} kwargs
 * @param {Object} typeMapping
 */
function verifyArguments(kwargs, typeMapping) {
  for (const key of Object.keys(kwargs)) {
    if (typeof kwargs[key] === "undefined")
      throw Error(`Argument "${key}" must be defined`);
    if (typeMapping && typeMapping[key]) {
      if (typeMapping[key] === "array") {
        if (!Array.isArray(kwargs[key]))
          throw Error(`Argument "${key}" must be an Array`);
      } else if (typeof kwargs[key] !== typeMapping[key])
        throw Error(
          `Argument "${key}" must be of type ${
            typeMapping[key]
          }, instead it is ${typeof kwargs[key]}`
        );
    }
  }
}

function* rootSaga() {
  yield takeEvery("EXECUTE_PLAY", executePlay);
  yield fork(initialize);
}

export default rootSaga;
