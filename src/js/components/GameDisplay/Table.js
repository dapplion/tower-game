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
    const dx = this.props.dx;
    const isCoin = this.props.isCoin;

    return (
      <tr>
        <td>{isCoin}</td>
        <td>{dx}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    const maxCoins = this.props.maxCoins;
    const numCoins = this.props.numCoins;
    const dxs = this.props.dxs;
    console.log('maxCoins: '+maxCoins)

    const rows = [];
    let lastCategory = null;
    var count = 0;

    var data = [];
    for (var i = 0; i < maxCoins-numCoins; i++) {
      data.push('-');
    }
    for (var i = maxCoins-numCoins; i < maxCoins; i++) {
      data.push('X');
    }

    data.forEach((dataElem) => {
      count++;
      if (count>maxCoins) {
        return;
      }
      rows.push(
        <ProductRow
          isCoin={dataElem}
          dx={dxs[count]}
          key={count}
        />
      );
    });

    return (
      <table class='gameDisplayTable'>
        <thead>
          <tr>
            <th>Is coin</th>
            <th>dx</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleCountChange = this.handleCountChange.bind(this);
    this.handleMaxChange = this.handleMaxChange.bind(this);
    this.handleResetDxs = this.handleResetDxs.bind(this);
  }

  handleCountChange(e) {
    this.props.onCountChange(e.target.value);
  }

  handleMaxChange(e) {
    this.props.onMaxChange(e.target.value);
  }

  handleResetDxs(e) {
    this.props.onResetDxs();
  }

  render() {
    const maxCoins = this.props.maxCoins;
    const numCoins = this.props.numCoins;

    return (
      <form>
        <span>Coin count</span>
        <input
          type="number"
          placeholder="Count"
          value={numCoins}
          onChange={this.handleCountChange}
        />
      <span>Max coins</span>
        <input
          type="number"
          placeholder="Max"
          value={maxCoins}
          onChange={this.handleMaxChange}
        />
        <button
          class='bttn'
          type="button"
          onClick={this.handleResetDxs}
        >Reset dxs
        </button>
      </form>
    );
  }
}



class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numCoins: 1,
      maxCoins: 12,
      dxs: Array.from({length: 20}, () => Math.floor(Math.random() * 9))
    };

    this.handleCountChange = this.handleCountChange.bind(this);
    this.handleMaxChange = this.handleMaxChange.bind(this);
    this.handleResetDxs = this.handleResetDxs.bind(this);
  }

  handleCountChange(numCoins) {
    this.setState({
      numCoins: numCoins
    });
  }

  handleMaxChange(maxCoins) {
    this.setState({
      maxCoins: maxCoins
    });
  }

  handleResetDxs() {
    this.setState({
      dxs : Array.from({length: 20}, () => Math.floor(Math.random() * 9))
    })
  }

  render() {
    return (
      <div>
        <SearchBar
          numCoins={this.state.numCoins}
          maxCoins={this.state.maxCoins}
          onCountChange={this.handleCountChange}
          onMaxChange={this.handleMaxChange}
          onResetDxs={this.handleResetDxs}
        />
        <ProductTable
          products={this.props.products}
          numCoins={this.state.numCoins}
          maxCoins={this.state.maxCoins}
          dxs={this.state.dxs}
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
