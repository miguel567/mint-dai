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

const account = async () => {
var buildParams = {
  gasPrice: '20000000000'
}
try {
  console.log('DSA creation TxHash: ', await dsa.build(buildParams));
  var dsaId = await dsa.getAccounts(process.env.ACCOUNT_ADDRESS);

  await dsa.setInstance(dsaId);
} catch (error) {
  console.log(error);
}

console.log('dsaId: ', dsaId[0]['id']);
console.log ('DSA Accounts from ', process.env.ACCOUNT_ADDRESS, dsaId);



  
}

account();


