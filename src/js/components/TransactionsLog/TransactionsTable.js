import React from 'react';
import AppStore from 'Store';

class ProductCategoryRow extends React.Component {
  render() {
    const category = this.props.category;
    return (
      <tr>
        <th colSpan="3">
          {category}
        </th>
      </tr>
    );
  }
}

class ProductRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <tr id={this.props.id} onClick={this.props.printTransactionReceipt}>
        <td>{this.props.id}</td>
        <td>{this.props.status}</td>
        <td>{this.props.gasUsed}</td>
      </tr>
    );
  }
}

export default class TransactionLogTable extends React.Component {
  scream(e) {
    console.warn('AHHHHH',e.currentTarget.id)
  }

  render() {
    const transactionsLog = this.props.transactionsLog;
    const rows = [];
    for (const transactionId in transactionsLog) {
      let transaction = transactionsLog[transactionId]
      let gasUsed = (transaction.receipt) ? transaction.receipt.gasUsed : '';
      rows.push(
        <ProductRow
          id={transaction.id}
          status={transaction.status}
          gasUsed={gasUsed}
          key={transaction.id}
          printTransactionReceipt={this.props.printTransactionReceipt}
        />
      );
    }

    return (
      <table class='gameDisplayTable'>
        <thead>
          <tr id='Main header' onClick={this.scream}>
            <th>Transaction ID</th>
            <th>Status</th>
            <th>Gas Used</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
