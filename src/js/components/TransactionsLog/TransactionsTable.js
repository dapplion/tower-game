import React from 'react';
import _ from 'lodash';

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

class ProductTable extends React.Component {
  render() {
    const transactionsLog = this.props.transactionsLog;

    const rows = [];
    transactionsLog.forEach((transaction) => {
      rows.push(
        <ProductRow
          id={transaction.id}
          status={transaction.status}
          key={transaction.id}
        />
      );
    });

    return (
      <table class='gameDisplayTable'>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>status</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function generateRandomTransaction() {
  const possibleStatus = ['User Rejected','Contract Rejected','Finished','Mining...']
  return {
    id: Math.floor(99*Math.random()),
    status: possibleStatus.randomElement()
  }
}

class SearchBar extends React.Component {
  constructor() {
    super();
    this.handleTransactionAdd = this.handleTransactionAdd.bind(this);
  }

  handleTransactionAdd(e) {
    var transaction = generateRandomTransaction()
    this.props.onTransactionAdd(transaction);
  }

  render() {
    return (
      <form>
        <button
          class='bttn'
          type="button"
          onClick={this.handleTransactionAdd}
        >Add random transaction
        </button>
      </form>
    );
  }
}



class FilterableProductTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      transactionsLog: []
    };
    this.handleTransactionAdd = this.handleTransactionAdd.bind(this);
  }

  handleTransactionAdd(transaction) {
    let transactionsLogNew = this.state.transactionsLog;
    transactionsLogNew.push(transaction);
    this.setState({
      transactionsLog: transactionsLogNew
    });
  }

  render() {
    return (
      <div>
        <SearchBar
          onTransactionAdd={this.handleTransactionAdd}
        />
        <ProductTable
          transactionsLog={this.state.transactionsLog}
        />
      </div>
    );
  }
}


export default class Table extends React.Component {

  render() {
    return (
      <div>
        <FilterableProductTable />
      </div>
    );
  }
}
