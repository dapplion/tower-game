import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { updateDx } from "./actions";
import api from "./api";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

const inputId = "play-input-position";

const ExecutePlay = ({ dx, updateDx }) => (
  <div className="mt-3 mb-3">
    <h3>Execute play</h3>
    <InputGroup className="mb-3" style={{ width: 400 }}>
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
        <Button
          variant="info"
          onClick={() => {
            api.play(document.getElementById(inputId).value);
          }}
        >
          Play
        </Button>
      </InputGroup.Append>
    </InputGroup>
  </div>
);

const mapStateToProps = createStructuredSelector({
  dx: state => state.dx
});

const mapDispatchToProps = {
  updateDx
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExecutePlay);
