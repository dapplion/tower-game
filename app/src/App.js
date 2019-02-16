import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GeneralFeedback from "./GeneralFeedback";
import DisplayGameState from "./DisplayGameState";
import ExecutePlay from "./ExecutePlay";
import DisplayResults from "./DisplayResults";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <header className="App-header">
          <Container className="mt-4 mb-5">
            <Row>
              <Col sm={7}>
                <DisplayGameState />
              </Col>
              <Col sm={5} className="side-column-controls">
                <div>
                  <GeneralFeedback />
                </div>
                <div className="horizontal-line" />
                <div>
                  <h3 className="sub-title">Execute play</h3>
                  <ExecutePlay />
                </div>
                <div className="horizontal-line" />
                <div>
                  <h3 className="sub-title">Display Results</h3>
                  <DisplayResults />
                </div>
              </Col>
            </Row>
          </Container>
        </header>
      </div>
    );
  }
}

export default App;
