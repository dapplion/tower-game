import React from 'react';
import EventBus from 'EventBusAlias';
import AppStore from 'Store';

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
      userDx: 600,
      maxCoins: 15,
    };

    // Bind internal events
    this.handleUserDxChange = this.handleUserDxChange.bind(this);
    this.handleMaxChange = this.handleMaxChange.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
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
