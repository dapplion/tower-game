import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import icon from "../img/icon.png";

const Header = ({ network }) => (
  <Navbar
    bg="light"
    className="justify-content-between app-header"
    style={{ borderBottom: "1px solid #eeeeee" }}
  >
    <Container className="correct-container-padding">
      <Navbar.Brand href="/">
        <div>
          <img src={icon} alt="icon" className="icon" /> Ethereum Tower Game
        </div>
      </Navbar.Brand>
      <Navbar.Text className="float-right">
        {network
          ? `Network: ${network.name} ${
              network.contractAddress ? "" : "(Not supported)"
            }`
          : "No network"}
      </Navbar.Text>
    </Container>
  </Navbar>
);

const mapStateToProps = createStructuredSelector({
  network: state => state.network
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
