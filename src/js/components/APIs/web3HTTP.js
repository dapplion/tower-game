import * as AppActions from "../../actions/AppActions";
import { getCoinbase,
  getNetworkPromise,
  checkAddressPromise } from './cxnPromises';
import Web3WS from '../../lib/web3.min';
import contractData from './kSpecs';

    // 1. After load launch watch interval loop
    // 2. Compare new variables with stored to track changes
    // 3. If variables changed, dispatch event

window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    setState.cxn.active(true);
    window.web3js = new Web3WS(web3.currentProvider);
    // Initialize base contract
    state.cxn.contract = new web3js.eth.Contract(contractData.ABI, null);

    let WATCH_LOOP_INTERVAL = 1000; // in miliseconds
    launchIntervalWatchLoop(WATCH_LOOP_INTERVAL);
  } else {
    setState.cxn.active(false);
    console.warn('No web3? You should consider trying MetaMask!')
    // window.web3js = new Web3WS(new Web3WS.providers.HttpProvider("http://localhost:8545"));
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  }
})

let launchIntervalWatchLoop = function(WATCH_LOOP_INTERVAL) {
  let HTTPBlockNumber = 0;
  let intervalWatchLoop = setInterval(function() {
    getNetworkPromise()
    .then(setState.cxn.network)
    .catch(function(err){
      console.log(err);
    });
    web3js.eth.getAccounts(function(e, accounts) {
      if(e || accounts.length === 0) {
        setState.account.address('please unlock your accounts');
        return;
      }
      setState.account.address(accounts[0]);
    });
    web3js.eth.getBlockNumber(function(error, blockNumber){
      if (blockNumber && HTTPBlockNumber != parseInt(blockNumber)) {
        HTTPBlockNumber = parseInt(blockNumber);
        AppActions.blockNumberUpdateHTTP(HTTPBlockNumber)
      }
      if (error) {
        AppActions.blockNumberUpdateHTTP(null)
        console.warn('HTTP Block number error: ',error)
      };

    })
  }, WATCH_LOOP_INTERVAL);
};

let state = {
  cxn: {
    dispatch: function() {
      AppActions.cxnUpdate({
        active: state.cxn.active,
        network: state.cxn.network,
        contract: state.cxn.contract,
        contractAddress: state.cxn.contractAddress
      });
    }
  },
  account: {
    dispatch: function() {
      AppActions.accountUpdate({
        active: state.account.active,
        address: state.account.address,
      });
    }
  }
}

let setState = {
  cxn: {
    // Update methods
    active: function(newValue) {
      if (!state.cxn.active || state.cxn.active != newValue) {
        state.cxn.active = newValue;
        state.cxn.dispatch();
      }
    },
    network: function(networkNew) {
      if (!state.cxn.network || state.cxn.network != networkNew) {
        state.cxn.network = networkNew;
        // Set contract instance to the new network
        if (networkNew in contractData.address) {
          state.cxn.contractAddress = contractData.address[networkNew];
        } else {
          state.cxn.contractAddress = null;
        }
        if (state.cxn.contract) state.cxn.contract.options.address = state.cxn.contractAddress;
        state.cxn.dispatch();
      }
    }
  },
  account: {
    address: function(addressNew) {
      if (state.account.address != addressNew) {
        state.account.address = addressNew;
        state.account.active = web3js.utils.isAddress(addressNew);
        state.account.dispatch();
      }
    }
  }
}
