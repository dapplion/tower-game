import Web3 from "web3";

const web3 = window.ethereum
  ? new Web3(window.ethereum) // Modern dapp browsers
  : window.web3
  ? new Web3(window.web3.currentProvider) // Legacy dapp browsers
  : null; // Non-dapp browsers

console.log(web3 ? `Web3 version: ${web3.version}`: 'Metamask is not enabled');

export default web3;
