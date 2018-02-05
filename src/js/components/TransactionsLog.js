import React from "react";

import TransactionsTable from './TransactionsLog/TransactionsTable';

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

  changeTitle(title) {

  }

  handleChange(e) {
    const title = e.target.value;
    this.setState({title});
  }

  render() {
    return (
      <div class='body'>
        <h2>Transactions Log</h2>
        <TransactionsTable />
      </div>
    );
  }
}
