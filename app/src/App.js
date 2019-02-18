import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GeneralFeedback from "./components/GeneralFeedback";
import DisplayGameState from "./components/DisplayGameState";
import ExecutePlay from "./components/ExecutePlay";
import DisplayResults from "./components/DisplayResults";
import DisplayBalance from "./components/DisplayBalance";
import WinModal from "./components/WinModal";

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Container className="mt-4 mb-5">
            <Row>
              <Col sm={7} className="mb-4">
                <DisplayGameState />
              </Col>
              <Col sm={5} className="mb-4 side-column-controls">
                <GeneralFeedback />
                <div className="horizontal-line" />
                <ExecutePlay />
                <div className="horizontal-line" />
                <DisplayBalance />
                <div className="horizontal-line" />
                <DisplayResults />
              </Col>
            </Row>
          </Container>
          <WinModal />
        </div>
      </div>
    );
  }
}

export default App;
