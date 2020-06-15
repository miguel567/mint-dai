require('dotenv').config()
const Web3 = require('web3')
const ansi = require('ansicolor').nice
const transfer = require('./transfer');
/**
 * Network configuration
 */
/* const testnet = `https://rinkeby.infura.io/${process.env.INFURA_ACCESS_TOKEN}` */
const testnet = process.env.GANACHE;
 
 
/**
 * Change the provider that is passed to HttpProvider to `mainnet` for live transactions.
 */
const web3 = new Web3( new Web3.providers.HttpProvider(testnet) )


let tokenAddress = process.env.DAI_ADDRESS;
let fromAddress = process.argv[2];
let toAddress = process.argv[3];
/* console.log('To Address: '.blue, toAddress); */

// The minimum ABI to get ERC20 Token balance
let minABIbalanceOf = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];

let minABItransfer = [
    // transfer
    {
        "constant": false,
        "inputs": [
        {
            "name": "_to",
            "type": "address"
        },
        {
            "name": "_value",
            "type": "uint256"
        }
        ],
        "name": "transfer",
        "outputs": [
        {
            "name": "",
            "type": "bool"
        }
        ],
        "type": "function"
    }
    ];

const getBalance = async () => {
    try {
        // Get ERC20 Token contract instance
        let contractBalance = await new web3.eth.Contract(minABIbalanceOf,tokenAddress);

        // Call balanceOf function
        let balanceFrom = await contractBalance.methods.balanceOf(fromAddress).call()
       /*  console.log('blanace From: ',balanceFrom); */
        let balanceTo = await contractBalance.methods.balanceOf(toAddress).call()
        /* console.log('Balance to: ', balanceTo); */
        // Get decimals

        let decimals = await  contractBalance.methods.decimals().call();
        /* console.log('decimals', decimals); */
        // calculate a balance
        balanceFrom = balanceFrom/(10**decimals);
        balanceTo = balanceTo/(10**decimals);
        console.log('Balance from: '.blue, balanceFrom.toString(), ' Balance to: '.blue, balanceTo.toString());

    } catch (error) {
        console.log(error);
    }
   



}

const transferDai = async () => {
    await getBalance();
    // Use BigNumber
    let decimals = web3.utils.toBN(18);
    let amount = web3.utils.toBN(5);
    // calculate ERC20 token amount
    let value = amount*(10**decimals);
    console.log('Value: '.blue, value);
    try {
        let gasPrices = await transfer.getCurrentGasPrices();
        
        // Get ERC20 Token contract instance
        let contract = await new web3.eth.Contract(minABItransfer,tokenAddress);

        // call transfer function
        let txHash = await contract.methods.transfer(toAddress, value.toString()).send({
            from: fromAddress,
            gas:210000,
            gasPrice: web3.utils.toHex(gasPrices.high* 1000000000) 
        })
        // it returns tx hash because sending tx
        /* console.log('TX hash:'.blue, txHash); */

    } catch (error) {
        console.log(error);
    }
    await getBalance();
}

transferDai();