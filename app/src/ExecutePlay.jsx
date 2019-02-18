import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as s from "./selectors";
import { updateDx, executePlay } from "./actions";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Big from "big.js";

const inputId = "play-input-position";

const ExecutePlay = ({ dx, updateDx, executePlay, playPrice }) => (
  <div>
    <h5 className="sub-sub-title">
      Execute play{" "}
      {playPrice
        ? `(${Big(playPrice)
            .div(Big(1e18))
            .round(5)
            .toString()} ETH)`
        : null}
    </h5>
    <InputGroup>
      <FormControl
        id={inputId}
        type="number"
        placeholder="Coin position"
        aria-label="Coin position"
        aria-describedby="basic-addon2"
        value={dx || ""}
        onChange={e => {
          const _dx = e.target.value;
          if (_dx <= 1 && _dx >= -1) updateDx(_dx);
        }}
      />
      <InputGroup.Append>
        <Button variant="info" onClick={executePlay}>
          Play
        </Button>
      </InputGroup.Append>
    </InputGroup>
  </div>
);

const mapStateToProps = createStructuredSelector({
  dx: s.getDx,
  playPrice: s.getPlayPrice
});

const mapDispatchToProps = {
  updateDx,
  executePlay
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExecutePlay);
