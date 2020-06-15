//CONNECT
const dotenv = require('dotenv');
const result = dotenv.config();
const Web3 = require('web3');
const DSA = require('dsa-sdk');
const ansi = require('ansicolor').nice;
const transfer = require('./transfer');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.GANACHE));

const dsa = new DSA({
  web3: web3,
  mode: "node",
  privateKey: process.env.PRIVATE_KEY
});
var dsaId = 0;
var vaultIds = 0;
var gasPrice = '20000000000';
const account = async () => {
var buildParams = {
  gasPrice: gasPrice,
  origin: process.env.ACCOUNT_ADDRESS
}
try {
  console.log('DSA creation TxHash: '.blue, await dsa.build(buildParams));

  dsaId =  await dsa.getAccounts(process.env.ACCOUNT_ADDRESS);

  await dsa.setInstance(dsaId[0]['id']);
} catch (error) {
  console.log(error);
}



console.log('dsaId: '.blue, dsaId[0]['id']);
console.log ('DSA Accounts from '.blue, process.env.ACCOUNT_ADDRESS, dsaId);


minter();
  
}

const minter = async() =>{
//OPEN a new Mkaer Vault
let openVault = dsa.Spell();
openVault.add({
  connector: "maker",
  method: "open",
  args: ["ETH-A"]
});
//openVault by casting the spell
try {
 console.log('opening vault TxHash: '.blue, await dsa.cast({
    spells: openVault,
    gasPrice: gasPrice
  }));
} catch (error) {
  console.log(error);
}

//fetching Vault details.
try {
  let vaults = await dsa.maker.getVaults(dsaId[0]['address']);
  console.log('Maker vaults:'.blue, vaults);
  console.log('Maker vault Ids'.blue,Object.keys(vaults).length, Object.keys(vaults));
  vaultIds = Object.keys(vaults);
} catch (error) {
  console.log(error);
}

//send ETH to vault account owner from my account
/* console.log('Transfer 50 Eth from my account to Vault owner account txHash: '.blue, await dsa.transfer({
  token: "eth", // the token key to transfer
  amount: dsa.tokens.fromDecimal(5, "eth"), // this helper changes the amount to decimal value
  to: dsaId[0]['address'], // DSA address, which then becomes the vault owner when vauls is created by DSA
  from: process.env.ACCOUNT_ADDRESS, // my account with 100 eth as in ganache
  gasPrice: gasPrice // estimate gas price*
})); */
await transfer(process.env.ACCOUNT_ADDRESS,dsaId[0]['address'],'5');

//define spell to deposit Eth and borrow DAI
let borrowDAI = dsa.Spell();
let vaultId = vaultIds[0];
console.log("Vault ID to use for minting".blue, vaultId, dsa.tokens.fromDecimal(3,'eth'));
borrowDAI.add({
  connector: "maker",
  method: "deposit",
  args: [vaultId[0], dsa.tokens.fromDecimal(3.0,'eth'), 0, 0] // deposit 50 ETH
});


/* borrowDAI.add({
  connector: "maker",
  method: "borrow",
  args: [vaultId[0], dsa.tokens.fromDecimal(3000,"DAI"), 0, 0]
}); */
//Deopist Eth and get DAI
try {
  console.log('opening vault TxHash: '.blue, await dsa.cast({
     spells: borrowDAI,
     gasPrice: gasPrice
   }));
 } catch (error) {
   console.log(error);
 }


 //check vault balance after  deposit.
 try {
  let vaults = await dsa.maker.getVaults(dsaId[0]['address']);
  console.log('Maker vaults:'.blue, vaults);
  console.log('Maker vault Ids'.blue,Object.keys(vaults).length, Object.keys(vaults));
  vaultIds = Object.keys(vaults);
} catch (error) {
  console.log(error);
}

}
account();
