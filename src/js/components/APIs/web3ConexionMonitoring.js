import * as AppActions from "Action";
import AppStore from 'Store';
import params from 'Params';


// AppStore.on(AppStore.tag.NETWORK_CHANGE, launchWebsocketConnection);

let HTTPBlockNumber;
let HTTPLastBlockTimestamp;
let WebsocketBlockNumber;
let WebsocketLastBlockTimestamp;
let timeLimit = 60; // in seconds

AppStore.on(AppStore.tag.BLOCKNUMBER.CHANGE, function(){
  let blockNumber = AppStore.getBlockNumber();
  // Check that:
  // 1 block numbers exist
  if (typeof blockNumber.HTTP == 'undefined') {
    console.warn('HTTP BlockNumber undefined: ',blockNumber.HTTP)
  }
  if (typeof blockNumber.websocket == 'undefined') {
    console.warn('WS BlockNumber undefined: ',blockNumber.websocket)
  }
  // 2 HTTP number is behind websockets
  // 2.1 block numbers are similar
  if (blockNumber.HTTP && blockNumber.websocket) {
    if (blockNumber.HTTP > blockNumber.websocket) {
      console.warn('Websocket block number is lagging behing the HTTP')
    }
    let blockNumberDifference = Math.abs(blockNumber.HTTP - blockNumber.websocket);
    if (blockNumberDifference > 3) {
      console.warn('Block number difference > 3 ',blockNumberDifference)
    }
    // 3 It isn't taking too long between blocks
    if (blockNumber.HTTP != HTTPBlockNumber) {
      HTTPLastBlockTimestamp = Date.now()
      HTTPBlockNumber = blockNumber.HTTP;
    }
    if (blockNumber.websocket != WebsocketBlockNumber) {
      WebsocketLastBlockTimestamp = Date.now()
      WebsocketBlockNumber = blockNumber.websocket;
    }
  }
});

setInterval(function(){
  if (HTTPLastBlockTimestamp
  && (HTTPLastBlockTimestamp-Date.now()) > timeLimit) {
    let timeDiff = HTTPLastBlockTimestamp-Date.now();
    console.warn('HTTP new block is taking too long: (s) ',timeDiff)
  }
  if (WebsocketLastBlockTimestamp
  && (WebsocketLastBlockTimestamp-Date.now()) > timeLimit) {
    let timeDiff = WebsocketLastBlockTimestamp-Date.now();
    console.warn('HTTP new block is taking too long: (s) ',timeDiff)
  }
}, 3000);
