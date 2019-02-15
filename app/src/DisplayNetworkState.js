import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

const DisplayGameState = ({ network }) => (
  <React.Fragment>
    <h5>Network state</h5>
    <p>
      {network
        ? `${network.name}: ${
            network.networkGameAddress ? "ok" : "not supported"
          }`
        : "No network selected"}
    </p>
  </React.Fragment>
);

const mapStateToProps = createStructuredSelector({
  network: state => state.network
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayGameState);
