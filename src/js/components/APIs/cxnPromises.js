import contract from './kSpecs';

// ###########################################
    // Refactoried NO
    // AMDed       YES
    // Tested      UNABLE - too many dependencies

function getCoinbase(){
  return new Promise(function(resolve, reject){
    web3.eth.getCoinbase(function(err, res){
      if (!res) {
        reject('No active account');
      } else {
        resolve(res);
      }
    });
  });
}

function getNetworkPromise() {
  return new Promise(function(resolve, reject){
    // Check which Ethereum network is used
    web3.version.getNetwork(function(err, res){
      let selectedNetwork = '';

      if (!err) {
        if(res > 1000000000000) {
          // I am not sure about this. I maybe wrong!
          selectedNetwork = 'testrpc';
        } else {
          switch (res) {
            case '1':
              selectedNetwork = 'mainnet';
              break
            case '2':
              selectedNetwork = 'morden';
              break
            case '3':
              selectedNetwork = 'ropsten';
              break
            case '4':
              selectedNetwork = 'rinkeby';
              break
            case "42":
              selectedNetwork = 'kovan';
              break
            default:
              selectedNetwork = 'Unknown network = '+res;
          }
        }
        resolve(selectedNetwork);
      } else {
        reject('getBlockTransactionCountPromise: '+err);
      }
    });
  });
}

function checkAddressPromise(address, addressType) {
  return new Promise(function(resolve, reject){
    if (address != null && web3.isAddress(address)) {
      resolve();
    } else {
      reject(addressType);
    }
  });
}


export {
    getCoinbase,
    getNetworkPromise,
    checkAddressPromise,
};
