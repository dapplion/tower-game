import React from "react";
import TransactionLogTable from './TransactionsLog/TransactionsTable';
import EventBus from 'EventBusAlias';

function processStatus(data) {
        // userResponse: true/false
        // contractResponse: true/false
        if ('contractResponse' in data) {
            return 'Processed';
        } else if ('userResponse' in data) {
            return 'Aproved';
        } else {
            return 'fired'
        }
    }

export default class TransactionsLog extends React.Component {


  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      transactionsLog : {},
    };
    // Bind internal events
    this.handleTXUpdate = this.handleTXUpdate.bind(this);
    // Bind external events
    EventBus.on(EventBus.tag.TXUpdate,this.handleTXUpdate);
  }

    handleTXUpdate(data) {
      let id = data.TXid;
      let TX = {};
      if (!(id in this.state.transactionsLog)) {
        // Create TX entry
        TX.name = 'TX #'+data.TXnum;
        TX.id = id;
      } else {
        TX = this.state.transactionsLog[id];
        if ('receipt' in data) {
          TX.receipt = data.receipt;
        }
      }
      if ('status' in data) {
        TX.status = data.status
      } else {
        TX.status = processStatus(data);
      }
      let updatedTransactionsLog = Object.assign({}, this.state.transactionsLog, {
          [id]: TX,
      });
      this.setState({
        transactionsLog: updatedTransactionsLog
      });
    }

  handleChange(e) {
    const title = e.target.value;
    this.setState({title});
  }

  render() {
    return (
      <div class='body'>
        <h2>Transactions Log</h2>
        <TransactionLogTable
          transactionsLog={this.state.transactionsLog}
          />
      </div>
    );
  }
}
