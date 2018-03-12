import contract from './kSpecs';
import { play } from './contractSimulation';
import EventBus from 'EventBusAlias';
import keccak from 'Lib/keccak';
import * as AppActions from "../../actions/AppActions";

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
  if (sendIsPossible) {
    fireTransaction(data.dx);
  } else {
    console.warn('Transaction not possible')
  }
}

var TXcount = 0;
function fireTransactionSimulation(dxSelection) {
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

import AppStore from 'Store';
// Define internal state
var sendIsPossible = false;
var contractInstance;
var accountSender;
var playPriceCall;
AppStore.on(AppStore.tag.ACCOUNT.CHANGE, checkIfSendIsPossible);
AppStore.on(AppStore.tag.CXN.CHANGE, checkIfSendIsPossible);
AppStore.on(AppStore.tag.GAME.CHANGE, getPlayPrice);

function getPlayPrice() {
  let gameStatus = AppStore.getGameStatus();
  playPriceCall = gameStatus.playPrice;
}

function checkIfSendIsPossible() {
  let cxnStatus = AppStore.getCxnStatus();
  let accountStatus = AppStore.getAccountStatus();
  if (cxnStatus.active
    && cxnStatus.contract
    && cxnStatus.contractAddress
    && accountStatus.active) {
      sendIsPossible = true;
      contractInstance = cxnStatus.contract;
      accountSender = accountStatus.address;
    } else {
      sendIsPossible = false;
    }
  // console.log('sendIsPossible',sendIsPossible)
};

// function play(int32 dx, address TXid) payable public {
function fireTransaction(dxSelection) {
  // using the event emitter
  let TXnum = TXcount++;
  let TXid = hashId(TXnum + Date())
  AppActions.TXUpdate({
    id: TXid,
    status: 'fired'
  })
  contractInstance.methods.play(dxSelection,TXid).send({
    from: accountSender,
    value: playPriceCall
  })
  .on('receipt', function(receipt){
    AppActions.TXUpdate({
      id: TXid,
      status: 'got receipt',
      receipt: receipt
    })
  })
  .on('error', function(error){
    if(error.message.toString().includes('User denied transaction signature')) {
      AppActions.TXUpdate({
        id: TXid,
        status: 'user denied',
      })
    } else {
      console.error(error)
    }
  }); // If there's an out of gas error the second parameter is the receipt.
}
