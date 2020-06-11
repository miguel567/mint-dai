//CONNECT
import dotenv from 'dotenv';
const result = dotenv.config();
import Maker from '@makerdao/dai';
import  McdPlugin from '@makerdao/dai-plugin-mcd';

/* var provider = new Web3.providers.HttpProvider(process.env.GANACHE);
web3 = new Web3(provider); */

const maker = async () => {
    await Maker.create('http', {
    plugins: [McdPlugin],
    url: process.env.GANACHE,
    privateKey:process.env.PRIVATEKEY
  });

  // verify that the private key was read correctly
console.log(maker.currentAddress());
}

