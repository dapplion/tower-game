import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import Card from "react-bootstrap/Card";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Big from "big.js";
import nameGenerator from "../randomNameGenerationSource/nameGenerator";

const useNameGenerator = true;

const ExternalLinkIcon = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <path
      fill="currentColor"
      d="M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 L 5 3 z M 14 3 L 14 5 L 17.585938 5 L 8.2929688 14.292969 L 9.7070312 15.707031 L 19 6.4140625 L 19 10 L 21 10 L 21 3 L 14 3 z"
    />
  </svg>
);

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

window.timeAgo = timeAgo;

const trimString = s =>
  typeof s === "string" && s.length > 10 ? `${s.slice(0, 10)}...` : s;

const byBlockNum = (a, b) => {
  if (!(a || {}).blockNumber) return -1;
  if (!(b || {}).blockNumber) return 1;
  return (b.blockNumber || 0) - (a.blockNumber || 0);
};

const getTimestampMs = ts => (ts ? (ts > 1e11 ? ts : ts * 1000) : ts);
const msThreshold = 24 * 60 * 60 * 1000;

const DisplayResults = ({ results, link, playPrice }) => {
  const pending = [];
  const recent = [];
  const previous = [];
  for (const result of Object.values(results).sort(byBlockNum)) {
    if (!result.blockNumber && !result.error) pending.push(result);
    else if (
      result.error ||
      (result.timestamp &&
        Date.now() - getTimestampMs(result.timestamp) < msThreshold)
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
        <h5 className="sub-sub-title">{category.name}</h5>
        {category.items.map((result, i) => {
          const {
            player = "",
            hash = "",
            fallingCoins = 0,
            timestamp = "",
            error = "",
            dx
          } = result;
          const pending = !Boolean(result.blockNumber) && !error;
          const won = fallingCoins > 0;
          const yourAddress = (
            (window.ethereum || {}).selectedAddress || ""
          ).toLowerCase();
          const itsYou =
            pending ||
            (yourAddress && yourAddress === (player || "").toLowerCase());
          const playerName = itsYou
            ? "You"
            : useNameGenerator && player.length > 20
            ? nameGenerator(player)
            : trimString(player);

          const timestampMs = getTimestampMs(timestamp);
          const date = pending
            ? "pending"
            : timestampMs
            ? Date.now() - timestampMs > msThreshold
              ? new Date(getTimestampMs(timestamp))
                  .toLocaleString("en-GB")
                  .split(",")[0]
              : timeAgo.format(new Date(getTimestampMs(timestamp)))
            : null;
          const wonAmount = won
            ? playPrice
              ? Big(playPrice || 0)
                  .div(Big(1e18))
                  .times(fallingCoins)
                  .toString() + " ETH"
              : fallingCoins + " coins"
            : null;
          return (
            <Card
              key={hash || i}
              body
              className={`mb-2 app-card ${
                pending ? "pending" : won ? "won" : ""
              }`}
            >
              <div
                className="d-flex justify-content-between"
                style={{ opacity: itsYou ? 0.8 : 0.5 }}
              >
                <div>
                  {error ? (
                    <React.Fragment>
                      <strong>Error! </strong> {String(error)}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {playerName}{" "}
                      {won ? (
                        <span>won {wonAmount}</span>
                      ) : (
                        <span>
                          played <span style={{ opacity: 0.3 }}>({dx})</span>
                        </span>
                      )}
                    </React.Fragment>
                  )}
                </div>
                <div>
                  {date}{" "}
                  {link && hash ? (
                    <a
                      href={`${link}${hash}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <ExternalLinkIcon size={16} />
                    </a>
                  ) : null}
                </div>
              </div>
            </Card>
          );
        })}
      </React.Fragment>
    ));
};

const mapStateToProps = createStructuredSelector({
  results: s.getResults,
  link: s.getNetworkLink,
  playPrice: s.getPlayPrice
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayResults);
