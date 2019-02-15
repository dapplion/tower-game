import React from "react";
import api from "./api";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

const inputId = "play-input-position";

const ExecutePlay = () => (
  <React.Fragment>
    <h5>Execute play</h5>
    <InputGroup className="mb-3" style={{ width: 400 }}>
      <FormControl
        id={inputId}
        type="number"
        placeholder="Coin position"
        aria-label="Coin position"
        aria-describedby="basic-addon2"
      />
      <InputGroup.Append>
        <Button
          variant="outline-secondary"
          onClick={() => {
            api.play(document.getElementById(inputId).value);
          }}
        >
          Play
        </Button>
      </InputGroup.Append>
    </InputGroup>
  </React.Fragment>
);

export default ExecutePlay;
