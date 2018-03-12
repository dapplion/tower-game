import { getCount, getDxs, getW } from './contractSimulation';
import EventBus from 'EventBusAlias';
import AppStore from 'Store';
import * as AppActions from 'Action';

// ###########################################
// Refactoried YES
// AMDed       YES
// Tested      UNABLE - too many dependencies (web3)

// Define internal state
var cxnStatus = AppStore.getCxnStatus();
// Update internal state
AppStore.on(AppStore.tag.CXN.CHANGE, function(){
  cxnStatus = AppStore.getCxnStatus();
  let loop;
  let updateInterval = 1000/10;
  // Stop the loop
  clearInterval(loop);
  // Check if connection is active
  if (cxnStatus.active
    && cxnStatus.contractAddress
    && cxnStatus.contract) {
    // console.log('CONEXION ACTIVE, FETCHING STATS ',cxnStatus)
    // Create the function map
    let callFunctionsMap = createCallFunctionsMap(cxnStatus.contract);
    // Get constants
    getConstants(callFunctionsMap);
    // Start stats loop
    getStats(callFunctionsMap);
    // loop = setInterval(function(){
    //   getStats(callFunctionsMap);
    // }, updateInterval);
  }
});

var useFakeContract = false;
function createCallFunctionsMap(contractInstance){
  if(useFakeContract){
    // Contract simulation
    return {
        count: getCount,
        dxs: getDxs,
        W: getW
    };
  } else {
    // Real web3 functions
    return {
      count: contractInstance.methods.coinCount().call,
      dxs: contractInstance.methods.getCoinPositionsArray().call,
      coinWidth: contractInstance.methods.coinWidth().call,
      playPrice: contractInstance.methods.playPrice().call
    };
  }
}

function arrayIsDiff(array1, array2) {
  // console.log(array1,array1.length,array2,array2.length)
  if (array1.length != array2.length) {
    return true;
  } else {
    for (var i = 0, len = array1.length; i < len; i++) {
      if (array1[i] != array2[i]) {
        return true;
      }
    }
  }
  return false;
}


var handler = {
  // Initialize variables
  state: AppStore.getGameStatus(),
  // gameUpdate
  handleDxs : function(newValueUnparsed) {
    let newValue = parse.dxs(newValueUnparsed)
    if (arrayIsDiff(handler.state.coinPositionsArray, newValue)){
      handler.state.coinPositionsArray = newValue;
      handler.update();
    }
  },
  handleCount : function(newValueUnparsed) {
    let newValue = parse.count(newValueUnparsed)
    if (handler.state.coinCount != newValue){
      handler.state.coinCount = newValue;
      handler.update();
    }
  },
  handleW : function(newValueUnparsed) {
    let newValue = parse.coinWidth(newValueUnparsed)
    if (handler.state.coinWidth != newValue){
      handler.state.coinWidth = newValue;
      handler.update();
    }
  },
  handlePlayPrice : function(newValueUnparsed) {
    let newValue = parse.playPrice(newValueUnparsed)
    if (handler.state.playPrice != newValue){
      handler.state.playPrice = newValue;
      handler.update();
    }
  },
  update: function() {
    AppActions.gameUpdate({
      coinCount: handler.state.coinCount,
      coinWidth: handler.state.coinWidth,
      coinPositionsArray: handler.state.coinPositionsArray.slice(),
      playPrice: handler.state.playPrice
    });
  }
}

var parse = {
  dxs : function(dxsUnparsed) {
      return JSON.parse("[" + String(dxsUnparsed) + "]");
  },
  count : function(countUnparsed) {
      return parseInt(countUnparsed);
  },
  coinWidth : function(WUnparsed) {
      return parseFloat(WUnparsed);
  },
  playPrice : function(playPriceUnparsed) {
      return parseInt(playPriceUnparsed);
  }
}

function getStats(callFunctionsMap) {
  callFunctionsMap.dxs()
  .then(handler.handleDxs)
  .catch(function(err){
    console.log('DXS fetch ERROR, '+err)
  });
  callFunctionsMap.count()
  .then(handler.handleCount)
  .catch(function(err){
    console.log('Count fetch ERROR, '+err)
  });
}

function getConstants(callFunctionsMap) {
  callFunctionsMap.coinWidth()
  .then(handler.handleW)
  .catch(function(err){
    console.log('W fetch ERROR, '+err)
  });
  callFunctionsMap.playPrice()
  .then(handler.handlePlayPrice)
  .catch(function(err){
    console.log('W fetch ERROR, '+err)
  });
}
