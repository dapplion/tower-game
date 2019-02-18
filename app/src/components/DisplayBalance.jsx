import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Card from "react-bootstrap/Card";
import * as s from "../selectors";
import Big from "big.js";

const ExecutePlay = ({ balance }) =>
  typeof balance !== "undefined" ? (
    <div>
      <h5 className="sub-sub-title">Your balance</h5>
      <Card
        body
        className="mb-2 app-card"
        style={{ fontSize: "120%", fontWeight: 600, opacity: 0.8 }}
      >
        {Big(balance || 0)
          .div(Big(1e18))
          .round(5)
          .toString() + " ETH"}
      </Card>
    </div>
  ) : null;

const mapStateToProps = createStructuredSelector({
  balance: s.getBalance
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExecutePlay);
