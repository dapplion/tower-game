
import Web3WS from '../../lib/web3.min';
import contract from './kSpecs';
import * as AppActions from "../../actions/AppActions";

// console.log('web3WS -----')
var web3WS = new Web3WS(new Web3WS.providers.WebsocketProvider('wss://ropsten.infura.io/ws'));
window.web3WS = web3WS;
var contractInstanceWS = new web3WS.eth.Contract(contract.ABI, null)

// make sure connection is live

let subscribeToBlockHeaders = function(web3Instance) {
  const subscription = web3Instance.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
    if (error) return console.error(error);

    console.log('WS Successfully subscribed!', blockHeader.number);
  }).on('data', (blockHeader) => {
    console.log('WS data: ', blockHeader.number);
  });

  // unsubscribes the subscription
  subscription.unsubscribe((error, success) => {
    if (error) return console.error(error);

    console.log('WS Successfully unsubscribed!');
  });
}

var TimestampLastBlock = Date.now();
let checkWSConnection = function() {
  let WSBlockNumber;
  let HTTPBlockNumber = 0;
  let GETWSBlockNumber = 0;
  // Get the blockNumber through websocket subscription
  subscribeToBlockHeaders(web3WS);
  // Get the blockNumber through HTTP request
  let errorCount = 0;
  setInterval(function() {
    if(typeof web3js !== 'undefined'){
      web3js.eth.getBlockNumber(function(error, blockNumber){
        if (blockNumber && HTTPBlockNumber != parseInt(blockNumber)) {
          HTTPBlockNumber = parseInt(blockNumber);
          let t = ' Time since block '+String(Date.now() - TimestampLastBlock)+' ms';
          console.log('HTTP Block num ',HTTPBlockNumber,t)
        }
        if (error) HTTPBlockNumber = null;
      })
    }
    web3WS.eth.getBlockNumber(function(error, blockNumber){
      if (blockNumber && GETWSBlockNumber != parseInt(blockNumber)) {
        GETWSBlockNumber = parseInt(blockNumber);
        let t = ' Time since block '+String(Date.now() - TimestampLastBlock)+' ms';
        console.log('WS GET Block num ',GETWSBlockNumber,t)
      }
      if (error) HTTPBlockNumber = null;
    })
    if (!WSBlockNumber && HTTPBlockNumber) {
      AppActions.blockNumberUpdate(HTTPBlockNumber);
    }
    // Check the connection status
    if (
      WSBlockNumber
      && HTTPBlockNumber
      && Math.abs(WSBlockNumber-HTTPBlockNumber)<3
      && WSBlockNumber > 0
    ) {
      // Connection is likely to be ok
      errorCount = 0;
      logIsConnected();
    } else {
      errorCount++;
      if (errorCount > 15) {
        // console.warn('Websocket or HTTP connection may be broken (FIX, only works for the Ropsten network)')
      }
    }
  }, 100);
}

let logIsConnected = function(){
     logIsConnected = function(){}; // kill it as soon as it was called
     console.log('#### WS CONNECTED'); // your stuff here
};

checkWSConnection();


// checkWSConnection()
// window.addEventListener('load', function() {
//   web3js.eth.getBlockNumber(function(error, result){
//     console.log('result',result)
//   })
// });
// console.log('myContract',myContract.events)


import AppStore from 'Store';

var cxnStatus = AppStore.getCxnStatus();
AppStore.on(AppStore.tag.CXN.CHANGE, function(){
  subscribeToWSEvents();
});
let subscribeToWSEvents = function(fromBlock='latest') {
  cxnStatus = AppStore.getCxnStatus();
  if (cxnStatus.contractAddress) {
    contractInstanceWS.options.address = cxnStatus.contractAddress;
    // Bind contract events
    contractBalanceLoopLaunch(cxnStatus.contractAddress);
    contractInstanceWS.events.playResult({
        fromBlock: fromBlock
    }, function(error, event){
      if (error) {
        console.log('WSerror',error);
      } else {
        console.log('event',event)
        AppActions.newEvent(event);
      }
    })
  }
}
window.subscribeToWSEvents = subscribeToWSEvents;

let contractBalanceLoop;
let contractBalanceLoopLaunch = function(contractAddress) {
  clearInterval(contractBalanceLoop);
  contractBalanceLoop = setInterval(function(){
    web3js.eth.getBalance(contractAddress)
    .then(function(balance){
      let etherBalance = parseFloat(web3js.utils.fromWei(balance, 'ether'));
      contractBalanceUpdate(etherBalance);
    })
  }, 1000/4);
}

let balanceOld = null;
let contractBalanceUpdate = function(newBalance) {
  if(balanceOld != newBalance) {
    let diff = newBalance - balanceOld;
    console.log('## BALANCE CHANGE by '+diff+' new balance: '+newBalance)
    AppActions.contractBalanceUpdate(newBalance);
    balanceOld = newBalance;
  }
}

import contractData from './kSpecs';
AppStore.on(AppStore.tag.NETWORK_CHANGE, function(){
  let network = AppStore.getCurrentNetwork();
  if (network) {
    let WSurl = 'wss://'+network+'.infura.io/ws';
    console.warn('Connecting to ',WSurl)
    let web3WS = new Web3WS(new Web3WS.providers.WebsocketProvider(WSurl));
    // 1. verify the WS connection
    monitorWBconnection.start(web3WS)
    // 2. subscribe to events of the contract
    let contractInstanceWS = new web3WS.eth.Contract(
      contract.ABI,
      contractData.address[network]
    )
  }
});

let monitorWBconnection = {
  WS_GET_BlockNumber: null,
  loopInterval: 3000,
  loopInstance: null,
  start: function(web3_WBinstance) {
    let that = this;
    this.loopInstance = setInterval(function(){
      web3_WBinstance.eth.getBlockNumber(function(error, blockNumber){
        if (blockNumber) that.WS_GET_BlockNumber = parseInt(blockNumber);
        if (error) console.log('WS ERROR: ',error);
      });
      if(!that.WS_GET_BlockNumber) console.log('WS NOT LOADED')
      else console.log('CONEXION OK, WS num: ',that.WS_GET_BlockNumber)
    },this.loopInterval)
  },
  stop: function() {
    clearInterval(this.loopInstance);
  }
}
