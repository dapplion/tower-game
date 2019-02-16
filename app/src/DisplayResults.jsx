import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Card from "react-bootstrap/Card";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

window.timeAgo = timeAgo;

const trimString = s =>
  typeof s === "string" && s.length > 8 ? `${s.slice(0, 8)}...` : s;

const byBlockNum = (a, b) => {
  if (!("blockNumber" in a)) return -1;
  if (!("blockNumber" in b)) return 1;
  return (b.blockNumber || 0) - (a.blockNumber || 0);
};

const getTimestampMs = ts => (ts > 1e11 ? ts : ts * 1000);
const msThreshold = 24 * 60 * 60 * 1000;

const ResultCard = ({ result }) => {
  const { player, hash, fallingCoins, timestamp, confirmationNumber } = result;
  const you = ((window.ethereum || {}).selectedAddress || "").toLowerCase();
  const playerName =
    you && you === (player || "").toLowerCase()
      ? "You"
      : `Player ${trimString(player)}`;
  const playSummary =
    fallingCoins > 0
      ? `${playerName} won ${fallingCoins}`
      : `${playerName} played`;
  const timestampMs = getTimestampMs(timestamp);
  const date =
    Date.now() - timestampMs > msThreshold
      ? new Date(getTimestampMs(timestamp))
          .toGMTString()
          .replace("GMT", "")
          .trim()
      : timeAgo.format(new Date(getTimestampMs(timestamp)));
  return (
    <Card body className="mb-2">
      {playSummary} - {date} -{" "}
      <a href={`https://kovan.etherscan.io/tx/${hash}`}>link</a>
      {confirmationNumber ? `${confirmationNumber} confirmations` : ""}
    </Card>
  );
};

const DisplayResults = ({ results }) => {
  const pending = [];
  const recent = [];
  const previous = [];
  for (const result of Object.values(results).sort(byBlockNum)) {
    if (!result.blockNumber) pending.push(result);
    else if (
      result.timestamp &&
      Date.now() - getTimestampMs(result.timestamp) < msThreshold
    )
      recent.push(result);
    else previous.push(result);
  }
  const categories = [
    {
      name: "Pending plays",
      items: pending
    },
    {
      name: "Recent plays",
      items: recent
    },
    {
      name: "Previous plays",
      items: previous
    }
  ];
  return categories
    .filter(category => category.items.length)
    .map(category => (
      <React.Fragment key={category.name}>
        <h6 className="sub-sub-title">{category.name}</h6>
        {category.items.map((result, i) => (
          <ResultCard key={result.hash || i} result={result} />
        ))}
      </React.Fragment>
    ));
};

const mapStateToProps = createStructuredSelector({
  results: state => state.results
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayResults);
