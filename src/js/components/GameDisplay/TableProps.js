import React from 'react';
import EventBus from 'EventBusAlias';
import AppStore from 'Store';

class ProductRow extends React.Component {
  render() {
    const isCoin = this.props.isCoin;
    const x = isNaN(this.props.x) ? '' : String(this.props.x);
    const dx = isNaN(this.props.dx) ? '' : String(this.props.dx);
    return (
      <tr>
        <td>{this.props.num}</td>
        <td>{isCoin}</td>
        <td>{x}</td>
        <td>{dx}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    // console.log('Updating Game Display render')
    const maxCoins = this.props.maxCoins;
    const numCoins = this.props.numCoins;
    const dxs = this.props.dxs.slice();
    let rows = [];
    let lastCategory = null;

    // Fill the dxs array
    for (var i = dxs.length; i < maxCoins; i++) {
      dxs.push(0);
    }

    // Fill the data array
    var data = [];
    for (var i = 0; i < numCoins; i++) {
      data.push('X');
    }
    for (var i = numCoins; i < maxCoins; i++) {
      data.push('-');
    }

    // Fill the x array
    var x = []; x[0] = dxs[0];
    for (var i = 1; i < numCoins; i++) {
      x[i] = x[i-1] + dxs[i];
    }

    var count = 0;
    data.forEach((dataElem) => {
      if (count>maxCoins) {
        return;
      }
      rows.push(
        <ProductRow
          isCoin={dataElem}
          x={x[count]}
          dx={dxs[count]}
          num={count}
          key={count}
        />
      );
      count++;
    });
    rows.reverse();

    return (
      <table class='gameDisplayTable'>
        <thead>
          <tr>
            <th>#</th>
            <th>Is coin</th>
            <th>x</th>
            <th>dx</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default class TableProps extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ProductTable
          numCoins={this.props.coinCount}
          maxCoins={this.props.maxCoins}
          dxs={this.props.coinPositionsArray}
        />
      </div>
    );
  }
}
