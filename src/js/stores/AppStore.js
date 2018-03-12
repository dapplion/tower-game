import { EventEmitter } from 'events';

import dispatcher from '../dispatcher';

class AppStore extends EventEmitter {
  constructor() {
    super()
    this.cxnStatus = {
      active: false,
      network: '',
      contract: null,
      contractAddress: ''
    }
    this.account = {
      active: false,
      address: ''
    }
    this.gameStatus = {
      coinCount: 0,
      coinWidth: 0,
      coinPositionsArray: [],
      playPrice: 0,
    }
    this.TXLog = {}
    this.AnimationLog = []
    this.contractBalance = 0
    this.blockNumber = {
      websocket: 0,
      HTTP: 0
    }

    this.tag = {
      NETWORK_CHANGE: 'NETWORK_CHANGE',
      BLOCKNUMBER_UPDATE_WEBSOCKET: 'BLOCKNUMBER_UPDATE_WEBSOCKET',
      BLOCKNUMBER_UPDATE_HTTP: 'BLOCKNUMBER_UPDATE_HTTP',
      ADD_COIN_POSITION: 'ADD_COIN_POSITION',
      UPDATE_COIN_COUNT: 'UPDATE_COIN_COUNT',
      ACCOUNT: {
        UPDATE: 'ACCOUNT_UPDATE',
        CHANGE: 'ACCOUNT_CHANGE'
      },
      CXN: {
        UPDATE: 'CXN_UPDATE',
        CHANGE: 'CXN_CHANGE'
      },
      GAME: {
        UPDATE: 'GAME_UPDATE',
        CHANGE: 'GAME_CHANGE'
      },
      TXLOG: {
        UPDATE: 'TXLOG_UPDATE',
        CHANGE: 'TXLOG_CHANGE'
      },
      EVENT: {
        UPDATE: 'EVENT_UPDATE',
        CHANGE: 'EVENT_CHANGE'
      },
      BALANCE: {
        UPDATE: 'BALANCE_UPDATE',
        CHANGE: 'BALANCE_CHANGE'
      },
      BLOCKNUMBER: {
        UPDATE: 'BLOCKNUMBER_UPDATE',
        CHANGE: 'BLOCKNUMBER_CHANGE'
      }
    }
  }

  getCxnStatus() {
    return this.cxnStatus;
  }

  getCurrentNetwork() {
    return this.cxnStatus.network;
  }

  getAccountStatus() {
    return this.account;
  }

  getGameStatus() {
    return this.gameStatus;
  }

  getTXLog() {
    return this.TXLog;
  }

  getContractBalance() {
    return this.contractBalance;
  }

  getAnimationLog() {
    return this.AnimationLog;
  }

  getBlockNumber() {
    return this.blockNumber;
  }


  handleActions(action) {
    switch(action.type) {
      case this.tag.ADD_COIN_POSITION: {
        this.gameStatus.coinPositionsArray[action.data.i] = action.data.position;
        this.emit(this.tag.GAME.CHANGE);
        break;
      }
      case this.tag.UPDATE_COIN_COUNT: {
        this.gameStatus.coinCount = action.newCoinCount;
        this.emit(this.tag.GAME.CHANGE);
        break;
      }
      case this.tag.ACCOUNT.UPDATE: {
        this.account = action.accountNewStatus;
        this.emit(this.tag.ACCOUNT.CHANGE);
        break;
      }
      case this.tag.CXN.UPDATE: {
        this.cxnStatus = action.cxnNewStatus;
        this.emit(this.tag.CXN.CHANGE);
        this.emit(this.tag.NETWORK_CHANGE);
        break;
      }
      case this.tag.GAME.UPDATE: {
        this.gameStatus = action.gameNewStatus;
        this.emit(this.tag.GAME.CHANGE);
        break;
      }
      case this.tag.BALANCE.UPDATE: {
        this.contractBalance = action.newBalance;
        this.emit(this.tag.BALANCE.CHANGE);
        break;
      }
      case this.tag.BLOCKNUMBER_UPDATE_WEBSOCKET: {
        this.blockNumber.websocket = action.newBlockNumber;
        this.emit(this.tag.BLOCKNUMBER.CHANGE);
        break;
      }
      case this.tag.BLOCKNUMBER_UPDATE_HTTP: {
        this.blockNumber.HTTP = action.newBlockNumber;
        this.emit(this.tag.BLOCKNUMBER.CHANGE);
        break;
      }
      case this.tag.TXLOG.UPDATE: {
        let TXid = action.TXdata.id;
        if (TXid in this.TXLog) {
          Object.assign(this.TXLog[TXid], action.TXdata);
        } else {
          this.TXLog[TXid] = action.TXdata;
        }
        this.emit(this.tag.TXLOG.CHANGE);
        break;
      }
      case this.tag.EVENT.UPDATE: {
        // console.log('action.event',action.event)
        let values = action.event.returnValues
        // .TXid  .currentcount  .dx  .resultStability
        // let contractAddress = action.event.address
        // let blockNumber = action.event.blockNumber
        let numberOfFallenCoins;
        let msg;
        if (values.resultStability < 0){
          // Coin addition
          numberOfFallenCoins = 0;
          let coinPosition = parseFloat(values.currentcount)+1;
          msg = 'Add coin at #'+coinPosition;
        } else {
          // Coins fall
          numberOfFallenCoins = values.currentcount - values.resultStability;
          msg = 'Fallen '+numberOfFallenCoins+' coins, until #'+values.resultStability;
        }
        this.AnimationLog.push({
          TXid: values.TXid,
          msg: msg,
          dx: values.dx,
        })
        this.emit(this.tag.EVENT.CHANGE);
        break;
      }
    }
  }

}

const appStore = new AppStore;
dispatcher.register(appStore.handleActions.bind(appStore));

export default appStore;
