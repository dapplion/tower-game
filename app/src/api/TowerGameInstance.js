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
  const towerGameInstance = new web3.eth.Contract(towerGame.abi, address);
  let initialized;
  let playPriceWei;
  let width;

  /**
   * Fetch init settings
   */
  async function initSettings() {
    playPriceWei = await towerGameInstance.methods.playPrice().call();
    width = await towerGameInstance.methods.width().call();
  }

  /**
   * Fetch the positions and compute the cummulative
   */
  async function getState() {
    if (!initialized) await initSettings();
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
  async function play(dx, account) {
    if (Math.abs(dx) > 1) throw Error("dx must be > -1 and < 1");
    const dxScaled = dx * width;
    return await towerGameInstance.methods.play(dxScaled).send({
      from: account,
      value: playPriceWei,
      gas: 100000
    });
  }

  /**
   *
   * @param {Function} cb (error, event) => {}
   */
  function subscribeToResults(cb) {
    towerGameInstance.events.PlayResult({ fromBlock: 0 }, cb);
  }

  return {
    getState,
    initSettings,
    play,
    subscribeToResults
  };
}

export default TowerGameInstance;
