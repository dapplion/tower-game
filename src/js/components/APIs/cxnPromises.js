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
                  selectedNetwork = 'Testrpc';
                } else {
                  switch (res) {
                    case '1':
                      selectedNetwork = 'Mainnet';
                      break
                    case '2':
                      selectedNetwork = 'Morden';
                      break
                    case '3':
                      selectedNetwork = 'Ropsten';
                      break
                    case '4':
                      selectedNetwork = 'Rinkeby';
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
