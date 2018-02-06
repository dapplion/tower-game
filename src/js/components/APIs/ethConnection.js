import EventBus from 'EventBusAlias';
import { getCoinbase,
  getNetworkPromise,
  checkAddressPromise } from './cxnPromises';
// ===================================================
    // ===================================================
    // ===================================================
    // ===================================================
    // [START-UP] FUNCTION RUN ON PAGE LOAD:
    // ===================================================
    // ===================================================
    // ===================================================
    // ===================================================

    // Internal variables
    var account;

    // ##LION## I deleted - watchBlockInfo()
    startApp();

    function startApp(){
      monitorAccountChanges();
      watchSyncing();
      reloadPageWhenNoNetwork();
    }

    // [START-UP] MONITOR METAMASK ACCOUNT CHANGES: Launched on start-up
    function monitorAccountChanges() {
      // Declare accountInterval here! Clear the variable if there is no Ethereum node found.
      let accountInterval;

      // Check if an Ethereum node is found.
      if(web3.isConnected()){

        // If a coinbase account is found, automatically update the fromAddress form field with the coinbase account
        getCoinbase()
        //getCoinbasePromise()
        .then(function(fromAddress){
          EventBus.emit(EventBus.tag.AccountUpdate, {
            active: true,
            address: fromAddress,
            addressProvider: 'Coinbase'
          } );
        })
        .catch(function(err){
            console.log(err)
        });

        account = web3.eth.accounts[0];

        // At a time interval of 1 sec monitor account changes
        accountInterval = setInterval(function() {

          // Monitor account changes. If you switch account, for example in MetaMask, it will detect this.
          // See: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md
          if (web3.eth.accounts[0] !== account) {
              // Acount is different, update
            account = web3.eth.accounts[0];
            // ####### Convert to Event emit
            // document.getElementById('fromAddress').value = account;
          } else {
              // Account is the same, throw error
          }
          if(account != null) {
              // account is not null, remove error
            EventBus.emit(EventBus.tag.AccountUpdate, {
              active: true,
              address: account,
              addressProvider: 'metamask'
            } );
            accountStatusUpdate(true)
          } else {
            EventBus.emit(EventBus.tag.AccountUpdate, {
              active: false,
              address: ''
            } );
            accountStatusUpdate(false)
          }

          // Check which Ethereum network is used
          getNetworkPromise()
          // getNetworkPromise()
          .then(function(network){
            EventBus.emit(EventBus.tag.ConnectionUpdate, {
              active: true,
              network: network
            } );
          })
          .catch(function(err){
            console.log(err);
          });

      }, 500); // end of accountInterval = setInterval(function()

      } else {
        // Stop the accountInterval
        clearInterval(accountInterval);
        EventBus.emit(EventBus.tag.ConnectionUpdate, {
          active: false,
          network: ''
        } );
      }
    }

    var accountActive = false;
    function accountStatusUpdate(Status) {
        if (accountActive != Status) {
            // There has been a change!
            accountActive = Status;
            // showBtn(accountActive, 'No active account');
        }
    };

    function showBtn(True, message) {
        if(True){
            document.getElementById('playBtn').style.display = 'inline';
            document.getElementById('txStatus').style.display = 'none';
        } else {
            document.getElementById('playBtn').style.display = 'none';
            document.getElementById('txStatus').style.display = 'inline';
        }
        document.getElementById('txStatus').innerText = message;
    }

    // Everytime a sync starts, updates and stops.
    function watchSyncing(){
      web3.eth.isSyncing(function(err, sync){
        if(!err) {
          // stop all app activity
          if(sync === true) {
           // we use `true`, so it stops all filters, but not the web3.eth.syncing polling
           web3.reset(true);
          } else if(sync) {
            // Show sync info. When your Ethereum node is not runnning for a day, your node need to be synchronized.
            // A message will be displayed on top of screen.
            //
            // ####### Convert to Event emit
           // document.getElementById('intervalErrorMessage').innerText = 'Syncing from '+sync.currentBlock+' to '+sync.highestBlock;
           //console.log('The block number where the sync started = '+sync.startingBlock);
           //console.log('The block number where at which block the node currently synced to already = '+sync.currentBlock);
           //console.log('The estimated block number to sync to = '+sync.highestBlock);
          } else {
            // re-gain app operation
            // console.log('startApp');
            startApp();
          }
        }
      });
    }

    let eventHandlerPageLoad = function() {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
      } else {
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      }
      // Immediately execute methods after web page is loaded
      startApp();
    }

    // WHAT IS THIS DOING?
    window.addEventListener('load', eventHandlerPageLoad);
    // [START-UP] ETHEREUM NODE CHECKER: Launched on start-up
    // Check if an Ethereum node is available every 5 seconds.
    // I have chosen arbritray 5 seconds.
    function reloadPageWhenNoNetwork(){
      setInterval(function(){
        if(!web3.isConnected()){
          // If an Ethereum node is found, reload web page.
          eventHandlerPageLoad();
        }
      }, 5000);
    }

    function getAccount() {
        console.log('SENDING ADDRESS '+account)
        return account;
    }

    export default getAccount;
