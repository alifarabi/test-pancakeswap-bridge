const ethers = require('ethers');

const addresses = {
  WBNB: '',
  SAFE: '',
  factory: '',
  router: '',
  recipient: ''
}


// Use the mainnet
// const network = "homestead";

// Specify your own API keys
// Each is optional, and if you omit it the default
// API key for that service will be used.
// const provider = ethers.getDefaultProvider(network, {
//     // etherscan: YOUR_ETHERSCAN_API_KEY,
//     infura: '8ecc1a1eb3984b2fadee80a16204fac5',
//     // Or if using a project secret:
//     // infura: {
//     //   projectId: YOUR_INFURA_PROJECT_ID,
//     //   projectSecret: YOUR_INFURA_PROJECT_SECRET,
//     // },
//     // alchemy: YOUR_ALCHEMY_API_KEY,
//     // pocket: YOUR_POCKET_APPLICATION_KEY
//     // Or if using an application secret key:
//     // pocket: {
//     //   applicationId: ,
//     //   applicationSecretKey:
//     // }
// });

//First address of this mnemonic must have enough BNB to pay for tx fess
const mnemonic = '';

const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);
const factory = new ethers.Contract(
  addresses.factory,
  ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
  account
);
const router = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  ],
  account
);

factory.on("PairCreated", async (from, to, value, event) => {
  console.log('from',from);
  console.log('to',to);
  console.log('value',value);
  console.log('event',event);
} )

// const weth = await ethers.Contract

// const address = wallet.mnemonic
// async () => {
//   const q = await account.getBalance()
//   console.log('q', q); 
// }



// const wbnb = new ethers.Contract(
//   addresses.WBNB,
//   [
//     'function approve(address spender, uint amount) public returns(bool)',
//   ],
//   account
// );

// const init = async () => {
//   const tx = await wbnb.approve(
//     router.address, 
//     'replace by amount covering several trades'
//   );
//   const receipt = await tx.wait(); 
//   console.log('Transaction receipt');
//   console.log(receipt);
// }

factory.on('PairCreated', async (token0, token1, pairAddress) => {
  console.log(`
    New pair detected
    =================
    token0: ${token0}
    token1: ${token1}
    pairAddress: ${pairAddress}
  `);
})



//   console.log(1);
//   //The quote currency needs to be WBNB (we will pay with WBNB)
//   let tokenIn, tokenOut;
//   if(token0 === addresses.WBNB) {
//       console.log(2);
//     tokenIn = token0; 
//     tokenOut = token1;
//   }

//   if(token1 == addresses.WBNB) {
//       console.log(3);
//     tokenIn = token1; 
//     tokenOut = token0;
//   }

//   //The quote currency is not WBNB
//   if(typeof tokenIn === 'undefined') {
//       console.log(4);
//     return;
//   }

  // //We buy for 0.1 BNB of the new token
  // //ethers was originally created for Ethereum, both also work for BSC
  // //'ether' === 'bnb' on BSC
  // const amountIn = ethers.utils.parseUnits('0.01', 'ether');
  // const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
  // //Our execution price will be a bit different, we need some flexbility
  // const amountOutMin = amounts[1].sub(amounts[1].div(10));
  // console.log(`
  //   Buying new token
  //   =================
  //   tokenIn: ${amountIn.toString()} ${tokenIn} (WBNB)
  //   tokenOut: ${amountOutMin.toString()} ${tokenOut}
  // `);
//   const tx = await router.swapExactTokensForTokens(
//     amountIn,
//     amountOutMin,
//     [tokenIn, tokenOut],
//     addresses.recipient,
//     Date.now() + 1000 * 60 * 10 //10 minutes
//   );
//   const receipt = await tx.wait(); 
//   console.log('Transaction receipt');
//   console.log(receipt);
// });

// init();