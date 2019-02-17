import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Navbar from "react-bootstrap/Navbar";

const Header = ({ network }) => (
  <Navbar
    bg="light"
    className="justify-content-between app-header"
    style={{ borderBottom: "1px solid #eeeeee" }}
  >
    <Navbar.Brand href="/">Ethereum Tower Game</Navbar.Brand>
    <Navbar.Text className="float-right">
      {network
        ? `Network: ${network.name} ${
            network.networkGameAddress ? "" : "(Not supported)"
          }`
        : "No network"}
    </Navbar.Text>
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
