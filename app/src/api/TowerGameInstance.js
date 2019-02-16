import towerGame from "../contracts/TowerGame.json";
import web3 from "./web3";

// Utils
// const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
const cumsum = arr => {
  const new_array = [];
  arr.reduce((a, b, i) => (new_array[i] = a + b), 0);
  return new_array;
};

// To create an instance, towerGame.abi + towerGame.networks[networkId].address
function TowerGameInstance(address) {
  if (!address)
    throw Error("Initializing tower game instance without an address");
  else console.log(`Initializing a tower game instance with ${address}`);
  const towerGameInstance = new web3.eth.Contract(towerGame.abi, address);
  let initialized;
  let playPriceWei;
  let width;

  /**
   * Fetch init settings
   */
  async function getInitSettings() {
    const [_playPriceWei, _width] = await Promise.all([
      towerGameInstance.methods.playPrice().call(),
      towerGameInstance.methods.width().call()
    ]);
    playPriceWei = _playPriceWei;
    width = _width;
    return { playPriceWei: _playPriceWei, width: _width };
  }

  /**
   * Fetch the positions and compute the cummulative
   */
  async function getState() {
    if (!initialized) await getInitSettings();
    const relativePositions = await towerGameInstance.methods
      .getCoinPositionsArray()
      .call();
    const absolutePositions = cumsum(relativePositions.map(s => parseInt(s)));
    return absolutePositions.map(x => x / width);
  }

  /**
   *
   * @param {Float} dx relative dx unscaled: -1 < dx < 1
   * @param {String} account ethereum account
   */
  function play(dx, account) {
    if (Math.abs(dx) > 1) throw Error("dx must be > -1 and < 1");
    const dxScaled = dx * width;
    return towerGameInstance.methods.play(dxScaled).send({
      from: account,
      value: playPriceWei,
      gas: 100000
    });
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
   * @param {Function} cb (error, event) => {}
   */
  function subscribeToResults(cb) {
    towerGameInstance.events.PlayResult({}, (error, event) => {
      if (error) console.error("Error getting PlayResult event", error);
      else
        cb({
          fallingCoins: event.returnValues.fallingCoins,
          coinCount: event.returnValues.coinCount,
          dx: parseInt(event.returnValues.dx) / width,
          player: event.returnValues.player,
          blockNumber: event.blockNumber,
          timestamp: Math.floor(Date.now() / 1000),
          date: new Date().toGMTString(),
          hash: event.transactionHash
        });
    });
  }

  async function getPastResults() {
    const events = await towerGameInstance.getPastEvents("PlayResult", {
      fromBlock: 0
    });
    const eventsIndexed = {};
    await Promise.all(
      events.map(async event => {
        const block = await web3.eth.getBlock(event.blockNumber);
        eventsIndexed[event.transactionHash] = {
          fallingCoins: event.returnValues.fallingCoins,
          coinCount: event.returnValues.coinCount,
          dx: parseInt(event.returnValues.dx) / width,
          player: event.returnValues.player,
          blockNumber: event.blockNumber,
          timestamp: block.timestamp,
          date: new Date(block.timestamp * 1000).toGMTString(),
          hash: event.transactionHash
        };
      })
    );
    return eventsIndexed;
  }

  return {
    getState,
    getInitSettings,
    play,
    subscribeToResults,
    getPastResults
  };
}

export default TowerGameInstance;
