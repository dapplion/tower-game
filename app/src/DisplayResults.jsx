import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Table from "react-bootstrap/Table";

function trimString(s) {
  return typeof s === "string" && s.length > 10 ? `${s.slice(0, 10)}...` : s;
}

const DisplayResults = ({ results }) => (
  <Table responsive>
    <thead>
      <tr>
        <th>Won</th>
        <th>Count</th>
        <th>Player</th>
        <th>Time</th>
        <th>TX Hash</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(results)
        .sort((a, b) => results[b].blockNumber - results[a].blockNumber)
        .map(id => (
          <tr
            key={id}
            style={
              results[id].fallingCoins > 0 ? { backgroundColor: "#f0fff0" } : {}
            }
          >
            <th>{results[id].fallingCoins}</th>
            <th>{results[id].coinCount}</th>
            <th>{trimString(results[id].player)}</th>
            <th>{new Date(results[id].timestamp * 1000).toGMTString()}</th>
            <th>{trimString(results[id].transactionHash)}</th>
          </tr>
        ))}
    </tbody>
  </Table>
);

const mapStateToProps = createStructuredSelector({
  results: state => state.results
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayResults);
