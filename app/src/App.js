import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import DisplayGameState from "./DisplayGameState";
import ExecutePlay from "./ExecutePlay";
import DisplayResults from "./DisplayResults";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <header className="App-header">
          <DisplayGameState />
          <ExecutePlay />
          <DisplayResults />
        </header>
      </div>
    );
  }
}

export default App;
