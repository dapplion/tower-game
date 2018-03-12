import dispatcher from "../dispatcher";
import AppStore from 'Store';

export function accountUpdate(accountStatus) {
  dispatcher.dispatch({
    type: AppStore.tag.ACCOUNT.UPDATE,
    accountNewStatus: accountStatus
  });
}

export function addCoinPosition(data) {
  dispatcher.dispatch({
    type: AppStore.tag.ADD_COIN_POSITION,
    data: data
  });
}

export function updateCoinCount(newCoinCount) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_COIN_COUNT,
    newCoinCount: newCoinCount
  });
}

export function cxnUpdate(cxnStatus) {
  dispatcher.dispatch({
    type: AppStore.tag.CXN.UPDATE,
    cxnNewStatus: cxnStatus
  });
}

export function gameUpdate(gameStatus) {
  dispatcher.dispatch({
    type: AppStore.tag.GAME.UPDATE,
    gameNewStatus: gameStatus
  });
}

export function TXUpdate(TXdata) {
  dispatcher.dispatch({
    type: AppStore.tag.TXLOG.UPDATE,
    TXdata: TXdata
  });
}

export function newEvent(event) {
  dispatcher.dispatch({
    type: AppStore.tag.EVENT.UPDATE,
    event: event
  });
}

export function contractBalanceUpdate(newBalance) {
  dispatcher.dispatch({
    type: AppStore.tag.BALANCE.UPDATE,
    newBalance: newBalance
  });
}

export function blockNumberUpdate(newBlockNumber) {
  dispatcher.dispatch({
    type: AppStore.tag.BLOCKNUMBER.UPDATE,
    newBlockNumber: newBlockNumber
  });
}

export function blockNumberUpdateWebsocket(newBlockNumber) {
  dispatcher.dispatch({
    type: AppStore.tag.BLOCKNUMBER_UPDATE_WEBSOCKET,
    newBlockNumber: newBlockNumber
  });
}

export function blockNumberUpdateHTTP(newBlockNumber) {
  dispatcher.dispatch({
    type: AppStore.tag.BLOCKNUMBER_UPDATE_HTTP,
    newBlockNumber: newBlockNumber
  });
}

export function deleteTodo(id) {
  dispatcher.dispatch({
    type: "DELETE_TODO",
    id,
  });
}

export function reloadTodos() {
  // axios("http://someurl.com/somedataendpoint").then((data) => {
  //   console.log("got the data!", data);
  // })
  dispatcher.dispatch({type: "FETCH_TODOS"});
  setTimeout(() => {
    dispatcher.dispatch({type: "RECEIVE_TODOS", todos: [
      {
        id: 8484848484,
        text: "Go Shopping Again",
        complete: false
      },
      {
        id: 6262627272,
        text: "Hug Wife",
        complete: true
      },
    ]});
  }, 1000);
}
