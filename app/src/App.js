import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import towerGame from "./contracts/TowerGame.json";

// window.addEventListener("load", async () => {
//   // Modern dapp browsers...
//   if (window.ethereum) {
//     window.web3 = new Web3(window.ethereum);
//     try {
//       // Request account access if needed
//       await window.ethereum.enable();
//       // Acccounts now exposed
//       window.web3.eth.sendTransaction({
//         /* ... */
//       });
//     } catch (error) {
//       // User denied account access...
//     }
//   }
//   // Legacy dapp browsers...
//   else if (window.web3) {
//     window.web3 = new Web3(window.web3.currentProvider);
//     // Acccounts always exposed
//     window.web3.eth.sendTransaction({
//       /* ... */
//     });
//   }
//   // Non-dapp browsers...
//   else {
//     console.log(
//       "Non-Ethereum browser detected. You should consider trying MetaMask!"
//     );
//   }
// });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0, web3: null, positions: [] };
  }

  async executePlay() {
    const { towerGameInstance, width, playPriceWei, web3 } = this.state;
    const dx = Math.floor(0.9 * width);

    const accounts = await web3.eth.getAccounts();
    console.log({ accounts });

    const res = await towerGameInstance.methods.play(dx).send({
      from: accounts[0],
      value: playPriceWei,
      gas: 100000
    });
    console.log({ res });
  }

  async componentDidMount() {
    // Modern dapp browsers...
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      this.setState({ web3, modernDappBrowser: true });
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      this.setState({ web3, modernDappBrowser: false });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      return;
    }

    const networkId = await web3.eth.net.getId();
    // Show network ID not supported
    if (!towerGame.networks[networkId])
      throw Error(`Network ID ${networkId} not supported`);

    // To create an instance, towerGame.abi + towerGame.networks[networkId].address
    const towerGameInstance = new web3.eth.Contract(
      towerGame.abi,
      towerGame.networks[networkId].address
    );

    const playPriceWei = await towerGameInstance.methods.playPrice().call();
    const width = await towerGameInstance.methods.width().call();

    this.setState({ networkId, playPriceWei, width, towerGameInstance });

    async function getState() {
      const initialCoinPositions = await towerGameInstance.methods
        .getCoinPositionsArray()
        .call();
      this.setState({ positions: initialCoinPositions });
    }

    getState.bind(this)();

    towerGameInstance.events.PlayResult().on("data", event => {
      console.log({ event }); // same results as the optional callback above
      getState.bind(this)();
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <p>{JSON.stringify(this.state.positions, null, 2)}</p>
          <button onClick={this.executePlay.bind(this)}>PLAY</button>
        </header>
      </div>
    );
  }
}

export default App;
