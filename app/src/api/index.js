import web3 from "./web3";
import towerGame from "../contracts/TowerGame.json";
import networks from "./networks.json";
import { put } from "./connectToStore";
import TowerGameInstance from "./TowerGameInstance";

let towerGameInstance;

async function updateState() {
  if (!towerGameInstance) throw Error("towerGameInstance is not defined");
  const gameState = await towerGameInstance.getState();
  put({ type: "UPDATE_GAME_STATE", gameState });
}

async function subscribeToStateChanges() {
  towerGameInstance.subscribeToResults((error, event) => {
    console.log("new event", { event, error }); // same results as the optional callback above
    updateState();
  });
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

  updateState();
  subscribeToStateChanges();
}

export default {
  run,
  play
};
