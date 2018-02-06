import contract from './kSpecs';
import { getCount, getDxs, getW } from './contractSimulation';
import EventBus from 'EventBusAlias';

// import isEqual from './../lib/isEqual';


// ###########################################
// Refactoried YES
// AMDed       YES
// Tested      UNABLE - too many dependencies (web3)

var useFakeContract = false;

// Implement the fake contract
var functionMap;
if(useFakeContract){
  // Contract simulation
  functionMap = {
      count: getCount,
      dxs: getDxs,
      W: getW
  };
} else {
  // Real web3 functions
  functionMap = {
      count: contract.coinCount,
      dxs: contract.getCoinPositionsArray,
      W: contract.coinWidth
  };
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
  dxs : [],
  count : 0,
  W : 0,
  // Define handlers
  // Track changes and if so, publish an update event
  handleDxs : function(dxsNew) {
    if (arrayIsDiff(this.dxs, dxsNew)){
      this.dxs = dxsNew;
      EventBus.emit(EventBus.tag.dxsUpdate, dxsNew.slice());
    }
  },
  handleCount : function(countNew) {
    if (this.count != countNew){
      this.count = countNew;
      EventBus.emit(EventBus.tag.countUpdate,countNew);
    }
  },
  handleW : function(Wnew) {
    if (this.W != Wnew){
      this.W = Wnew;
      EventBus.emit('WUpdate', Wnew);
    }
  },
}

var parser = {
  parseDxs : function(dxsUnparsed) {
      return JSON.parse("[" + String(dxsUnparsed) + "]");
  },
  parseCount : function(countUnparsed) {
      return parseInt(countUnparsed);
  },
  parseW : function(WUnparsed) {
      return parseFloat(WUnparsed);
  }
}

// Define a generic Promise
function getterPromise(getter) {
    return new Promise(function(resolve, reject){
        getter((err, res) => {
            if(err) reject('Error with < '+String(getter)+' > : '+err);
            else resolve(res);
        });
    });
}

export function getStats() {
    getterPromise(functionMap.dxs).then(function(dxsUnparsed){
      handler.handleDxs(parser.parseDxs(dxsUnparsed));
      return getterPromise(functionMap.count)
    }).then(function(countUnparsed){
      handler.handleCount(parser.parseCount(countUnparsed));
    }).catch(function(err){
      console.log('ERROR updating game stat, err = '+err)
    });
  }
export function getConstants() {
    getterPromise(functionMap.W).then(function(WUnparsed){
      handler.handleW(parser.parseW(WUnparsed));
    }).catch(function(err){
      console.log('ERROR updating game consts, err = '+err)
    });
  }
