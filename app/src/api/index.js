import web3 from "./web3";
import towerGame from "../contracts/TowerGame.json";
import networks from "./networks.json";
import { put } from "../connectToStore";
import TowerGameInstance from "./TowerGameInstance";

let towerGameInstance;
let previousGameState = [];

async function updateState() {
  if (!towerGameInstance) throw Error("towerGameInstance is not defined");
  const gameState = await towerGameInstance.getState();
  // Prevent useless updates
  if (areFloatArraysEqual(gameState, previousGameState))
    put({ type: "UPDATE_GAME_STATE", gameState });
  previousGameState = gameState;
}

async function subscribeToStateChanges() {
  towerGameInstance.subscribeToResults(event => {
    put({ type: "UPDATE_RESULTS", data: { [event.transactionHash]: event } });
    updateState();
  });
}

async function getPastResults() {
  const eventsIndexed = await towerGameInstance.getPastResults();
  put({ type: "UPDATE_RESULTS", data: eventsIndexed });
}

async function play(dx) {
  if (!towerGameInstance) throw Error("towerGameInstance is not defined");
  if (window.ethereum && window.ethereum.enable) {
    await window.ethereum.enable();
  }
  const accounts = await web3.eth.getAccounts();
  const res = await towerGameInstance.play(dx, accounts[0]);
  console.log("play res", res);
}

async function run() {
  if (!web3) {
    return console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }

  const networkId = await web3.eth.net.getId();
  // networkMetadata = { name, desc }
  const networkMetadata = networks[networkId] || {};
  const networkGameAddress = (towerGame.networks[networkId] || {}).address;
  put({
    type: "UPDATE_NETWORK",
    network: { networkId, networkGameAddress, ...networkMetadata }
  });

  // Stop initialization, network ID not supported
  if (!networkGameAddress)
    return console.error(`Network ID ${networkId} not supported`);

  // To create an instance, towerGame.abi + towerGame.networks[networkId].address
  towerGameInstance = new TowerGameInstance(networkGameAddress);

  await updateState();
  subscribeToStateChanges();
  getPastResults();
}

// Utility
function areFloatArraysEqual(arr1, arr2) {
  const tf = x => (x ? x.toFixed(10) : x);
  for (let i = arr1.length - 1; i >= 0; i--) {
    if (tf(arr1[i].toF) !== tf(arr2[i])) {
      return false;
    }
  }
  return true;
}

export default {
  run,
  play
};
