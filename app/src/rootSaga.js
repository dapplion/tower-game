import { call, fork, put, select, take, takeEvery } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import web3 from "./api/web3";
import towerGame from "./contracts/TowerGame.json";
import networks from "./api/networks.json";
import TowerGameInstance from "./api/TowerGameInstance";
import { updateFeedbackError, updateFeedbackInfo } from "./actions";

function* updateState() {
  try {
    const towerGameInstance = yield select(state => state.towerGameInstance);
    if (!towerGameInstance) throw Error("towerGameInstance is not defined");
    const previousGameState = yield select(state => state.gameState);
    const gameState = yield call(towerGameInstance.getState);
    // Prevent useless updates
    if (!areFloatArraysEqual(gameState, previousGameState)) {
      yield put({ type: "UPDATE_GAME_STATE", gameState });
    } else {
      console.log("Updating state but state is the same ", {
        previousGameState,
        gameState
      });
    }
  } catch (e) {
    console.error(`Error on updateState: ${e.stack}`);
  }
}

function* subscribeToStateChanges() {
  try {
    const towerGameInstance = yield select(state => state.towerGameInstance);
    if (!towerGameInstance) throw Error("towerGameInstance is not defined");
    const subscriptionChannel = eventChannel(emit => {
      towerGameInstance.subscribeToResults(emit);
      return function unsubscribe() {};
    });
    while (true) {
      try {
        const event = yield take(subscriptionChannel);
        console.log("Received state changed event", event);
        yield put({
          type: "UPDATE_RESULTS",
          data: { [event.hash]: event }
        });
        yield fork(updateState);
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
        updateFeedbackError(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        )
      );
    }

    /**
     * Fetch network information
     */
    yield put(updateFeedbackInfo("Loading network info..."));
    const networkId = yield call(web3.eth.net.getId);
    // networkMetadata = { name, desc }
    const networkMetadata = networks[networkId] || {};
    const networkGameAddress = (towerGame.networks[networkId] || {}).address;
    yield put({
      type: "UPDATE_NETWORK",
      network: { networkId, networkGameAddress, ...networkMetadata }
    });
    // Stop initialization, network ID not supported
    if (networkGameAddress) {
      yield put(updateFeedbackInfo(`Loaded network! ID ${networkId}`));
    } else {
      yield put(updateFeedbackError(`Network ID ${networkId} not supported`));
      return console.error(`Network ID ${networkId} not supported`);
    }

    /**
     * Initialize game instance
     */
    // To create an instance, towerGame.abi + towerGame.networks[networkId].address
    const towerGameInstance = new TowerGameInstance(networkGameAddress);
    yield put({ type: "UPDATE_INSTANCE", towerGameInstance });
    // Get game settings
    const gameSettings = yield call(towerGameInstance.getInitSettings);
    yield put({ type: "UPDATE_GAME_SETTINGS", data: gameSettings });
    // Update game state
    yield put(updateFeedbackInfo("Updating game state..."));
    yield call(updateState);
    yield put(updateFeedbackInfo("Updated game state!"));
    // Fetch old events
    const eventsIndexed = yield call(towerGameInstance.getPastResults);
    console.log(Object.values(eventsIndexed));
    yield put({ type: "UPDATE_RESULTS", data: eventsIndexed });
    // Subscribe to new events
    yield fork(subscribeToStateChanges);
  } catch (e) {
    console.error(`Error on initialize: ${e.stack}`);
  }
}

function* executePlay() {
  try {
    // Get contract instance
    const towerGameInstance = yield select(state => state.towerGameInstance);
    if (!towerGameInstance) throw Error("towerGameInstance is not defined");
    // Enable accounts
    if (window.ethereum && window.ethereum.enable) {
      yield call(window.ethereum.enable);
    }
    const accounts = yield call(web3.eth.getAccounts);
    const account = accounts[0];
    // Get dx value
    const dx = yield select(state => state.dx);
    const width = yield select(state => (state.gameSettings || {}).width);

    const txChannel = eventChannel(emit => {
      towerGameInstance
        .play(dx, account)
        .on("transactionHash", hash => {
          // Store initial state in the store to show in the UI
          emit({ hash, player: account, dx });
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          emit({ confirmationNumber, ...parseReceipt(receipt, width) });
        })
        .on("receipt", receipt => {
          emit(parseReceipt(receipt, width));
        })
        .on("error", error => {
          emit({ error });
        });
      return function unsubscribe() {};
    });

    let hash;
    while (true) {
      try {
        const data = yield take(txChannel);
        if (data.hash) hash = data.hash;
        yield put({ type: "UPDATE_RESULTS", data: { [hash]: data } });
        console.log(`tx update ${hash}`, data);
      } catch (err) {
        console.error("subscriptionChannel error:", err);
      }
    }
  } catch (e) {
    console.error(`Error on executePlay: ${e.stack}`);
  }
}

/**
 * Utilities
 */

/**
 * Compares if two arrays of floats are equal
 * @param {Array} arr1
 * @param {Array} arr2
 */
function areFloatArraysEqual(arr1, arr2) {
  if (!arr1) arr1 = [];
  if (!arr2) arr2 = [];
  const tf = x => (x ? x.toFixed(10) : x);
  for (let i = arr1.length - 1; i >= 0; i--) {
    if (tf(arr1[i]) !== tf(arr2[i])) {
      return false;
    }
  }
  return true;
}

function parseReceipt(receipt, width) {
  // PlayResult event may not be available
  const event = (receipt.events || {}).PlayResult;
  return {
    ...(event ? parsePlayResultEvent(event, width) : {}),
    timestamp: Math.floor(Date.now() / 1000),
    gasUsed: receipt.gasUsed
  };
}

function parsePlayResultEvent(event, width) {
  return {
    fallingCoins: event.returnValues.fallingCoins,
    coinCount: event.returnValues.coinCount,
    dx: parseInt(event.returnValues.dx) / width,
    player: event.returnValues.player,
    blockNumber: event.blockNumber,
    hash: event.transactionHash
  };
}

function* rootSaga() {
  yield takeEvery("EXECUTE_PLAY", executePlay);
  yield fork(initialize);
}

export default rootSaga;
