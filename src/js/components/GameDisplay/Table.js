import React from 'react';
import EventBus from 'EventBusAlias';

class ProductRow extends React.Component {
  render() {
    const isCoin = this.props.isCoin;
    const x = this.props.x;
    const dx = this.props.dx;

    return (
      <tr>
        <td>{isCoin}</td>
        <td>{x}</td>
        <td>{dx}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    console.log('Updating Game Display render')
    const maxCoins = this.props.maxCoins;
    const numCoins = this.props.numCoins;
    const dxs = this.props.dxs.slice();
    const rows = [];
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

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleUserDxChange = this.handleUserDxChange.bind(this);
    this.handleMaxChange = this.handleMaxChange.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleRandomPlay = this.handleRandomPlay.bind(this);
  }

  handleUserDxChange(e) {
    this.props.onUserDxChange(e.target.value);
  }

  handleMaxChange(e) {
    this.props.onMaxChange(e.target.value);
  }

  handlePlay(e) {
    this.props.onPlay();
  }

  handleRandomPlay(e) {
    this.props.onRandomPlay();
  }

  render() {
    const maxCoins = this.props.maxCoins;
    const userDx = this.props.userDx;

    return (
      <form>
        <span>Max coins</span>
        <input
          type="number"
          placeholder="Max"
          value={maxCoins}
          onChange={this.handleMaxChange}
        />
        <span>User dx</span>
        <input
          type="number"
          value={userDx}
          onChange={this.handleUserDxChange}
        />
        <button
          class='bttn'
          type="button"
          onClick={this.handlePlay}
        >send play
        </button>
        <button
          class='bttn'
          type="button"
          onClick={this.handleRandomPlay}
        >send random play
        </button>
      </form>
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDx: 0,
      maxCoins: 12,
      count: 0,
      dxs: Array.from({length: 20}, () => Math.floor(Math.random() * 9))
    };

    // Bind internal events
    this.handleCountChange = this.handleCountChange.bind(this);
    this.handleUserDxChange = this.handleUserDxChange.bind(this);
    this.handleDxsChange = this.handleDxsChange.bind(this);
    this.handleMaxChange = this.handleMaxChange.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    // Bind external events
    EventBus.on(EventBus.tag.countUpdate,this.handleCountChange);
    EventBus.on(EventBus.tag.dxsUpdate,this.handleDxsChange);
  }

  handleCountChange(count) {
    this.setState({count});
  }

  handleMaxChange(maxCoins) {
    this.setState({maxCoins});
  }

  handleUserDxChange(userDx) {
    this.setState({userDx});
  }

  handlePlay() {
    let userSelectedDx = parseInt(this.state.userDx);
    EventBus.emit(EventBus.tag.callPlay,{dx : userSelectedDx})
  }

  handleRandomPlay() {
    let userSelectedDx = Math.floor((Math.random()-0.5) * 99);
    EventBus.emit(EventBus.tag.callPlay,{dx : userSelectedDx})
  }

  handleDxsChange(dxs) {
    this.setState({dxs})
  }

  render() {
    return (
      <div>
        <SearchBar
          userDx={this.state.userDx}
          maxCoins={this.state.maxCoins}
          onCountChange={this.handleCountChange}
          onMaxChange={this.handleMaxChange}
          onUserDxChange={this.handleUserDxChange}
          onPlay={this.handlePlay}
          onRandomPlay={this.handleRandomPlay}
        />
        <ProductTable
          products={this.props.products}
          numCoins={this.state.count}
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
