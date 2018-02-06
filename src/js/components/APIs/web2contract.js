import contract from './kSpecs';
import { play } from './contractSimulation';
import EventBus from 'EventBusAlias';
import getAccount from './ethConnection';
import keccak from 'Lib/keccak';

// Functionality
// addr = getEthAddress('Random text')
function hashId(message) {
    let msg = String(message);
    let h = keccak.keccak256(msg);
    return '0x'+h.slice(-40);
}

// Bind elements
EventBus.on(EventBus.tag.callPlay,handlePlay2);

function handlePlay2(data){
  // msg : 'Bark, bark!',
  // dx : Math.floor(Math.random() * 99)
  console.log('SENDING play for dx: '+data.dx)
  // fireTransactionSimulation(data.dx);
  fireTransaction(data.dx);
}

var TXcount = 0;
var amountWei = getPlayPriceInWei();

function getPlayPriceInWei() {
    let amountEther = 1; // #### get this from the contract
    return web3.toWei(amountEther, 'ether');
}

function fireTransactionSimulation(dxSelection) {
    //if (TransactionIsPossible(fromAddress)) {
    if (true) {
        // Pre-process inputs
        let fromAddress = '0x0fd92c62225c1673f496447294a2a00ab51bd634';
        let TXid = TXcount++;
        // Handle the transaction
        EventBus.emit(EventBus.tag.TXUpdate, {
          TXid: TXid,
          fired: true
        } );
        setTimeout(function () {
            EventBus.emit(EventBus.tag.TXUpdate, {
              TXid: TXid,
              userResponse: true,
              dxSelection: dxSelection
            } );
        }, 1000);
        setTimeout(function () {
            EventBus.emit(EventBus.tag.TXUpdate, {
              TXid: TXid,
              contractResponse: true,
              receipt: 'Fake receipt'
            } );
        }, 2000);
        setTimeout(function () {
            play(dxSelection);
        }, 3000);
    }
}

function fireTransaction(dxSelection) {
        let fromAddress = getAccount();
        if (TransactionIsPossible(fromAddress)) {
            // Pre-process inputs
            let TXnum = TXcount++;
            let TXid = hashId(TXnum + Date())
            console.log('TXid '+TXid)
            EventBus.emit(EventBus.tag.TXUpdate, {
              TXid: TXid,
              TXnum: TXnum,
              fired: true} );
            // Handle the transaction
            contractCallPlayPromise(TXid, fromAddress,dxSelection) // if the play called succeeded, call get receipt
            .then(getReceiptPromise)
            .then(function(receiptRaw){
                console.log('receiptRaw: ',receiptRaw)
                let receipt = JSON.stringify(receiptRaw, null, '\t');
                let contractApprovedTX = Boolean(parseInt(receipt['status'], 16));
                EventBus.emit(EventBus.tag.TXUpdate, {
                  TXid: TXid,
                  contractResponse: contractApprovedTX,
                  receipt: receipt } );
            }).catch(function (err) {
                console.log(err)
            })
        } else {

        }
    }

    function contractCallPlayPromise (TXid, fromAddress, dxEnc) {
            return new Promise(function(resolve, reject){
                // var TXidAsAddress = keccak(TXid);
                contract.play(dxEnc, TXid, {gas: 300000, from: fromAddress, value: amountWei}, function (err, txHash) {
                    EventBus.emit(EventBus.tag.TXUpdate, {
                      TXid: TXid,
                      userResponse: !Boolean(err),
                    } );
                    if(err) reject(err);
                    else resolve(txHash);
                });
            });
        }

        function getReceiptPromise (txhash) {
            console.log('txhash: ',txhash)
            return new Promise(function callback(resolve, reject){
                web3.eth.getTransactionReceipt(txhash, function (err, receiptRaw) {
                    if (err) reject(err);
                    else resolve(receiptRaw);
                });
            });
        }

        function TransactionIsPossible(fromAddress) {
            if( web3.isConnected() ){
                if (web3.isAddress(fromAddress) ){
                    return true;
                } else { PubSub.publish('cxn.WrongAddress', fromAddress); }
            } else { PubSub.publish('cxn.NoNodeFound', ''); }
        }
