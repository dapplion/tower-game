import React from "react";
import Table from './GameDisplay/Table';

export default class GameDisplay extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      count: 3,
      dxs: [-34, 12, 42, 51, 0],
      maxCount: 12
    };
  }


  render() {
    return (
      <div class='body'>
        <h2>Game Display</h2>
        <Table />
      </div>
    );
  }
}
