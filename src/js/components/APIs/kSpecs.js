
      // Each time you modify the DemoContract.sol and deploy it on the blockchain, you need to get the abi value.
      // Paste the abi value in web3.eth.contract(PASTE_ABI_VALUE);
      // When the contract is deployed, do not forget to change the contract address, see
      // formfield id 'contractAddress'
      // Replace contract address: 0xf1d2e0b8e09f4dda7f3fd6db26496f74079faeeb with your own.

let contractAddress = {
	ropsten: '0x10b27f56b3b48ba48b9cf8350937bf2a6a30f2f6',
	rinkeby: '0x5f22e9e94562ec83c224f573c7a6466a053f8a64',
	testrpc: '0x8a2eaca7d5ef81a43c6a8928a47a6fc10ffae177'
};
let contractABI = [
	{
		"constant": true,
		"inputs": [],
		"name": "winner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "coinPositionsArray",
		"outputs": [
			{
				"name": "",
				"type": "int32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "playPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "coinWidth",
		"outputs": [
			{
				"name": "",
				"type": "int32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "maxn",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getCoinPositionsArray",
		"outputs": [
			{
				"name": "",
				"type": "int32[30]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "coinCount",
		"outputs": [
			{
				"name": "",
				"type": "uint32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "TXid",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "dx",
				"type": "int32"
			},
			{
				"indexed": false,
				"name": "currentcount",
				"type": "uint32"
			},
			{
				"indexed": false,
				"name": "resultStability",
				"type": "int32"
			}
		],
		"name": "playResult",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "dx",
				"type": "int32"
			},
			{
				"name": "TXid",
				"type": "address"
			}
		],
		"name": "play",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_playPrice",
				"type": "uint256"
			}
		],
		"name": "setPlayPrice",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];


// RETURNS CONTRACT ABI AND ADDRESS WHEN CALLED
export default {
	address: contractAddress,
	ABI: contractABI
};
