let tokenAddress = process.env.DAI_ADDRESS;
let walletAddress = process.env.ACCOUNT_ADDRESS;

// The minimum ABI to get ERC20 Token balance
let minABI = [
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

// Get ERC20 Token contract instance
let contract = web3.eth.contract(minABI).at(tokenAddress);

// Call balanceOf function
contract.balanceOf(walletAddress, (error, balance) => {
  // Get decimals
  contract.decimals((error, decimals) => {
    // calculate a balance
    balance = balance.div(10**decimals);
    console.log(balance.toString());
  });
});