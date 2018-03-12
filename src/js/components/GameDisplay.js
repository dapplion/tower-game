import React from "react";
import EventBus from 'EventBusAlias';
import AppStore from 'Store';
import * as AppActions from "Action";

import Table from './GameDisplay/Table';
import TableProps from './GameDisplay/TableProps';
import GameApp from './GameEngine/gameMain';
import AnimationLog from './GameDisplay/AnimationLog';

import MainGame from './GameEngine/gameMain';

function getCoinXr(coinCount) {
  return new Promise(function (resolve, reject) {
    let gameStatus = AppStore.getGameStatus();
    let coinPositionsArray = gameStatus.coinPositionsArray;
    let xr = 0;
    for (let i = 0; i < coinCount; i++) {
      xr += coinPositionsArray[i];
    }
    resolve(xr);
  });
}

EventBus.on(EventBus.tag.playEvent,handlePlayEvent);
function handlePlayEvent (event) {
  let resultStability = parseInt(event.returnValues.resultStability);
  let coinCountBeforePlay = parseInt(event.returnValues.currentcount);
  let coinPosition = parseInt(event.returnValues.dx);
  let TXid = event.returnValues.TXid;
  // Now broadcast new game state
  AppActions.addCoinPosition({
    position: coinPosition,
    i: coinCountBeforePlay
  })
  // Now craft the animation to do list
  let animationList = [];
  if (resultStability < 0){
    // Coin addition - no need to fetch info
    // ANIMATION: add static coins
    animationList.push({
      type: 'addStaticCoin',
      coinNum: coinCountBeforePlay,
      coinPosition: coinPosition
    })
    // Now broadcast new game state
    AppActions.updateCoinCount(coinCountBeforePlay+1)
  } else {
    // Coins fall - need to fetch coinPositionsArray
    // ANIMATION: remove static coins, add dynamic
    let newCoinCount = resultStability;
    let oldCoinCount = coinCountBeforePlay;
    // At this point, always oldCoinCount >= newCoinCount
    for (let i = newCoinCount; i < oldCoinCount; i++) {
      animationList.push({
        type: 'switchCoinToDynamic',
        coinNum: i
      })
    }
    getCoinXr(oldCoinCount).then(function(previousCoinXr) {
      animationList.push({
        type: 'addDynamicCoin',
        coinNum: oldCoinCount,
        xr: previousCoinXr+coinPosition
      })
      EventBus.emit('animation',animationList);
    })
    // Now broadcast new game state
    AppActions.updateCoinCount(newCoinCount)
  }
}

export default class GameDisplay extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      coinCount: 0,
      coinPositionsArray: [],
      maxCoins: 20
    };
    this.getGameStatus = this.getGameStatus.bind(this);
  }

  componentWillMount() {
    AppStore.on("GAME_CHANGE", this.getGameStatus);
  }

  componentWillUnmount() {
    AppStore.removeListener("GAME_CHANGE", this.getGameStatus);
  }

  getGameStatus() {
    let gameStatus = AppStore.getGameStatus();
    this.setState({
      coinCount: gameStatus.coinCount,
      coinPositionsArray: gameStatus.coinPositionsArray,
    });
  }


  render() {
    let stageWidth = 600;
    let stageHeigth = 400;
    let activeCoinsArray = [];
    let xr = 0;
    for (let i = 0; i < this.state.coinCount; i++) {
      xr += this.state.coinPositionsArray[i];
      activeCoinsArray.push(xr);
    }
    EventBus.emit('activeCoinsArray',activeCoinsArray);


    return (
      <div class='body'>

        <h2>Game Display with only props</h2>
        <TableProps
        coinCount={this.state.coinCount}
        maxCoins={this.state.maxCoins}
        coinPositionsArray={this.state.coinPositionsArray}
        />
        <h2>Send play calls interface</h2>
        <Table />
        <h2>Game Canvas with only props</h2>
        <GameApp
        coinCount={this.state.coinCount}
        coinPositionsArray={this.state.coinPositionsArray}
        stageWidth={stageWidth}
        stageHeigth={stageHeigth}
        />
        <AnimationLog />
      </div>
    );
  }
}
