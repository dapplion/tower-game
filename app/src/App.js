import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import DisplayGameState from "./DisplayGameState";
import DisplayNetworkState from "./DisplayNetworkState";
import ExecutePlay from "./ExecutePlay";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <header className="App-header">
          <h5>Ethereum Tower Game</h5>

          <DisplayNetworkState />
          <DisplayGameState />
          <ExecutePlay />
        </header>
      </div>
    );
  }
}

export default App;
