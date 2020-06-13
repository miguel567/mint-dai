//CONNECT
const dotenv = require('dotenv');
const result = dotenv.config();
const Web3 = require('web3');
const DSA = require('dsa-sdk');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.GANACHE));

const dsa = new DSA({
  web3: web3,
  mode: "node",
  privateKey: process.env.PRIVATE_KEY
});
var dsaId = 0;
var vaultIds = 0;
const account = async () => {
var buildParams = {
  gasPrice: '20000000000',
  origin: process.env.ACCOUNT_ADDRESS
}
try {
  console.log('DSA creation TxHash: ', await dsa.build(buildParams));

  dsaId =  await dsa.getAccounts(process.env.ACCOUNT_ADDRESS);

  await dsa.setInstance(dsaId[0]['id']);
} catch (error) {
  console.log(error);
}



console.log('dsaId: ', dsaId[0]['id']);
console.log ('DSA Accounts from ', process.env.ACCOUNT_ADDRESS, dsaId);


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
 console.log('opening vault TxHash: ', await dsa.cast({
    spells: openVault,
    gasPrice: '20000000000'
  }));
} catch (error) {
  console.log(error);
}

//fetching Vault details.
try {
  let vaults = await dsa.maker.getVaults(dsaId[0]['address']);
  console.log('Maker vaults:', vaults);
  console.log('Maker vault Ids',Object.keys(vaults).length, Object.keys(vaults));
  vaultIds = Object.keys(vaults);
} catch (error) {
  console.log(error);
}


//define spell to deposit Eth and borrow DAI
let borrowDAI = dsa.Spell();
let vaultId = vaultIds[0];
console.log("Vault ID to use for minting", vaultId);
borrowDAI.add({
  connector: "maker",
  method: "deposit",
  args: [vaultId[0], dsa.tokens.fromDecimal(50,"ETH"), 0, 0] // deposit 50 ETH
});
borrowDAI.add({
  connector: "maker",
  method: "borrow",
  args: [vaultId[0], dsa.tokens.fromDecimal(3000,"DAI"), 0, 0]
});
//Deopist Eth and get DAI
try {
  console.log('opening vault TxHash: ', await dsa.cast({
     spells: borrowDAI,
     gasPrice: '20000000000'
   }));
 } catch (error) {
   console.log(error);
 }

}
account();
