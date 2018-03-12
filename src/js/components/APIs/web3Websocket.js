import Web3WS from 'Lib/web3.min';
import contractData from './kSpecs';
import * as AppActions from "Action";
import AppStore from 'Store';
import params from 'Params';
import EventBus from 'EventBusAlias';

// This module should take care of all websocket connection pieces
// It's main purpose if to receive events
// which may not work with current metamask (web3js 0.2x + HTTP)
// However, WS are still buggy in Infura and tend to disconect
// after some time.


// This function sets up a new websocket connection
// It is called on the following events:
// 1 - a network change (which includes startup)
// 2 - If the websocket subscription returns an error

let launchWebsocketConnection = function() {
  let network = AppStore.getCurrentNetwork();
  if (network && network in params.availableNetworks) {
    let WebsocketUrl;
    switch (network) {
      case 'ropsten':
        WebsocketUrl = 'wss://'+network+'.infura.io/ws';
        break
      case 'rinkeby':
        WebsocketUrl = 'wss://'+network+'.infura.io/ws';
        break
      case 'testrpc':
        WebsocketUrl = 'ws://localhost:8545';
        break
    }
    let web3WS = new Web3WS(new Web3WS.providers.WebsocketProvider(WebsocketUrl));
    // 1. verify the WS connection
    monitorWebsocketconnection(web3WS);
    // setTimeout(function(){
    //   handleWebsocketError('penis');
    // }, 30000);
    // 2. subscribe to events of the contract
    let contractInstanceWS = new web3WS.eth.Contract(
      contractData.ABI,
      contractData.address[network]
    )
    subscribeToWebsocketEvents(contractInstanceWS);
  } else if(network) {
    console.warn(network,' websocket connection NOT available')
  }
}

let subscription;
let monitorWebsocketconnection = function(web3_WBinstance) {
  // Request block number initialy (to speed startup time)
  web3_WBinstance.eth.getBlockNumber(function(error, blockNumber){
    if (blockNumber) AppActions.blockNumberUpdateWebsocket(parseInt(blockNumber));
  })
  // Subscribe for new blocks
  subscription = web3_WBinstance.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
    if (error) handleWebsocketError(error.message.toString());
  }).on('data', (blockHeader) => {
    AppActions.blockNumberUpdateWebsocket(blockHeader.number)
  }).on('error', function(error){
    handleWebsocketError(error.message.toString())
  });
}

let subscribeToWebsocketEvents = function(contractInstance) {
  let fromBlock='latest';
  contractInstance.events.playResult({
      fromBlock: fromBlock
  }, function(error, event){
    if (error) {
      console.log('WSerror',error);
    } else {
      console.log('event',event)
      AppActions.newEvent(event);
      EventBus.emit(EventBus.tag.playEvent,event);
    }
  })
}

// Error message is parsed before hand so
// you can throw the error + reset function at will
// (With a timeout every 3-5 minutes for example)
let handleWebsocketError = function(errorString) {
  if(errorString.includes('connection not open')) {
    console.log('Error includes the string: ','connection not open')
  } else {
    console.warn('Websockets Unknown error, ',errorString)
  }
  console.warn('RELAUNCHING WEBSOCKET CONNECTION')
  subscription.unsubscribe(function(error, success){
    if(error) console.warn('Error unsubscribing')
    if(success) console.log('Successfully unsubscribed!');
  });
  launchWebsocketConnection();
}

export default launchWebsocketConnection;
