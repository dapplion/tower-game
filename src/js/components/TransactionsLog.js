import React from "react";
import TransactionLogTable from './TransactionsLog/TransactionsTable';
import EventBus from 'EventBusAlias';
import AppStore from 'Store';

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
      TXLog: AppStore.getTXLog()
    };
    // Bind internal events
    this.handleTXUpdate = this.handleTXUpdate.bind(this);
    this.getTXLog = this.getTXLog.bind(this);
    // Bind external events
    EventBus.on(EventBus.tag.TXUpdate,this.handleTXUpdate);
  }

  componentWillMount() {
    AppStore.on(AppStore.tag.TXLOG.CHANGE, this.getTXLog);
  }

  componentWillUnmount() {
    AppStore.removeListener(AppStore.tag.TXLOG.CHANGE, this.getTXLog);
  }

  getTXLog() {
    this.setState({
      TXLog: AppStore.getTXLog()
    });
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

  printTransactionReceipt(e) {
    let TXid = e.currentTarget.id;
    let TXLog = AppStore.getTXLog();
    let TXdata;
    if (TXid in TXLog) TXdata = TXLog[TXid];
    else console.log('Error retrieving transaction')
    let receipt;
    if ('receipt' in TXdata) console.log('TX Receipt',TXid,TXdata.receipt);
    else console.log('TX Not completed yet: ',TXdata)
  }

  render() {
    return (
      <div class='body'>
        <h2>Transactions Log</h2>
        <TransactionLogTable
          transactionsLog={this.state.TXLog}
          printTransactionReceipt={this.printTransactionReceipt}
          />
      </div>
    );
  }
}
