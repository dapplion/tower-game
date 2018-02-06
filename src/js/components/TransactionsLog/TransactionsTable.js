import React from 'react';

class ProductCategoryRow extends React.Component {
  render() {
    const category = this.props.category;
    return (
      <tr>
        <th colSpan="2">
          {category}
        </th>
      </tr>
    );
  }
}

class ProductRow extends React.Component {
  render() {
    const id = this.props.id;
    const status = this.props.status;

    return (
      <tr>
        <td>{id}</td>
        <td>{status}</td>
      </tr>
    );
  }
}

export default class TransactionLogTable extends React.Component {
  render() {
    const transactionsLog = this.props.transactionsLog;
    const rows = [];
    for (const transactionId in transactionsLog) {
      let transaction = transactionsLog[transactionId]
      rows.push(
        <ProductRow
          id={transaction.name}
          status={transaction.status}
          key={transaction.id}
        />
      );
    }

    return (
      <table class='gameDisplayTable'>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
