import {ethers} from "ethers";
import routerABI from './contractABI/router-v2';
import factoryABI from './contractABI/factory-v2';


class MainEthers {
    private PRIVATE_KEY: string = '';
    private PANCAKE_SWAP_FACTORY_V2: string = '';
    private PANCAKE_SWAP_ROUTER_V2: string = '';
    private WBNB_ADDRESS: string = '';
    provider: any;
    router: any;
    signer: any;
    wallet: any;
    factory: any;
    shiba: any;

    constructor() {
        this.connectToProvider();
        this.connectToAdminWallet();
        this.createSigner();
        this.setContracts();
    }

    private connectToProvider() {
        // this.provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org:443');
        this.provider = ethers.getDefaultProvider('ropsten');
    }

    private connectToAdminWallet() {
        try {
            const mnemonic = '';
            this.wallet = ethers.Wallet.fromMnemonic( mnemonic  , `m/44'/60'/0'/0`);

        }catch (e) {
            console.log("connect to Admin Wallet" , e.message);
        }

    }

    private createSigner() {
        this.signer = this.wallet.connect(this.provider);
    }

    private setContracts() {
        // this.factory = new ethers.Contract(
        //     this.PANCAKE_SWAP_FACTORY_V2,
        //     factoryABI,
        //     this.signer
        // );
        // this.router = new ethers.Contract(
        //     this.PANCAKE_SWAP_ROUTER_V2,
        //     routerABI,
        //     this.signer
        // );
        this.shiba = new ethers.Contract(
            '',
            [
                {
                    constant: true,
                    inputs: [{name: "_owner", type: "address"}],
                    name: "balanceOf",
                    outputs: [{name: "balance", type: "uint256"}],
                    payable: false,
                    type: "function"
                },
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
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                "function decimals() view returns (uint8)",
                "function symbol() view returns (string)"
            ],
            this.signer
        )
    }
    public async transfer() {
        try {
            // const t = await this.shiba.transfer("", ethers.utils.formatUnits(1000000000, 0));
            const t2 = await this.send_token("" , "100000", "")
            console.log("transfer To" ,'' , t2 );
        }catch (e) {
            console.error("transefer error " , e.message);
        }
    }

    /**
   * send_token
   * for send token between to account that give
   * @param contract_address which token we want to send
   * @param send_token_amount amount of token we want to send
   * @param to_address that address we want send token to it
   * And we
   * @return restartOfTx some information about transaction
   */
  public async send_token(
    contract_address: any,
    send_token_amount: any,
    to_address: any
    // send_account : any,
    // private_key : any
  ) {
    // let wallet = new ethers.Wallet(private_key);
    // wallet --> wallet
    // let walletSigner = wallet.connect(window.ethersProvider);
    // walletSigner --> account

    const send_abi = [
      {
        constant: false,
        inputs: [
          {
            name: "_to",
            type: "address",
          },
          {
            name: "_value",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            name: "",
            type: "bool",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const currentGasPrice = await this.provider.getGasPrice();
    console.log(currentGasPrice.toString());
    let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice));
    console.log(`gas_price: ${gas_price}`);

    if (contract_address) {
      // general token send
      let contract = new ethers.Contract(
        contract_address,
        send_abi,
        this.signer
      );

      // How many tokens?
      let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18);
      console.log(`numberOfTokens: ${numberOfTokens}`);

      const ali = await this.provider.estimateGas({
        // Wrapped ETH address
        to: to_address,

        // `function deposit() payable`
        data: "",
      });

      console.log("ali", ali.toString());

      // Send tokens
      const transferResult = await contract.transfer(
        to_address,
        numberOfTokens
      );
      console.dir(transferResult);
      console.dir("gasPrice", transferResult.gasPrice.toString());
      console.dir("gasLimit", transferResult.gasLimit.toString());

      console.log("sent token");
    }
    //   else // ether send
    //   {
    //       const tx =
    //       {
    //           from : send_account,
    //           to : to_address,
    //           value : ethers.utils.parseEther(send_token_amount),
    //           nonce : window.ethersProvider.getTransactionCount(send_account, 'latest'),
    //           gasLimit : ethers.utils.hexlify(gas_limit), // 100000
    //           gasPrice : gas_price
    //       }
    //       console.dir(tx);
    //       try{
    //           walletSigner.sendTransaction(tx).then((transaction) =>
    //           {
    //               console.dir(transaction);
    //               alert('Send finished!');
    //           });
    //       }catch(error){
    //           alert("failed to send!!");
    //       }
    //
    // }
  }

    public async swapExactTokensForTokens(
        tokenA: string,
        tokenB: string,
        recipient: string,
        AMOUNT_OF_WBNB: any,
        slippage: any,
        gasLimit: any,
        gasPrice: any
    ) {
        const pair = await this.factory.getPair(tokenA, tokenB);
        console.log("Pair", pair);
        const balance = await this.shiba.balanceOf(pair);
        console.log("balance", balance);
        const formatBalance = ethers.utils.formatEther(balance);
        console.log("formatBalance", formatBalance);
        if (parseInt(formatBalance) < 1000) {
            console.log("liquidity is ok");
            return;
        }
        const amountIn = ethers.utils.parseUnits(AMOUNT_OF_WBNB, 'ether');
        console.log("amountIn", amountIn);
        const amounts = await this.router.getAmountsOut(amountIn, [tokenA, tokenB]);
        console.log("amounts", amounts);
        //Our execution price will be a bit different, we need some flexbility
        const amountOutMin = amounts[1].sub(amounts[1].div(10));
        console.log(`
            Buying new token
            =================
            tokenIn: ${amountIn.toString()} ${tokenA} (WBNB)
            tokenOut: ${amountOutMin.toString()} ${tokenB}
          `);
        try {
            const tx = await this.router.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                [tokenA, tokenB],
                recipient,
                Date.now() + 1000 * 60 * 10, //10 minutes
                {
                    gasLimit: gasLimit,
                    gasPrice: ethers.utils.parseUnits(`${gasPrice}`, "gwei"),
                    nonce: null //set you want buy at where position in blocks
                }
            );
            const receipt = await tx.wait();
            console.log('Transaction receipt');
            console.log(receipt);
        } catch (e) {
            const error = JSON.parse(JSON.stringify(e));
            console.log("error", error);
            return error.reason
        }
    }
    public async addLiquidity(
        tokenA: string, // The contract address of one token from your liquidity pair.
        tokenB: string, // The contract address of the other token from your liquidity pair.
        amountADesired: string, //The amount of tokenA you'd like to provide as liquidity.
        amountBDesired: string, // The amount of tokenA you'd like to provide as liquidity.
        amountAMin: string, // The minimum amount of tokenA to provide (slippage impact).
        amountBMin: string, // The minimum amount of tokenB to provide (slippage impact).
        to: string, // Address of LP Token recipient.
    ) {

        const newPair = await this.factory.createPair(tokenA , tokenB);
        console.log("newPair" , newPair);

        try {
            const liquid = await this.router.addLiquidity(
                tokenA,
                tokenB,
                amountADesired,
                amountBDesired,
                amountAMin,
                amountBMin,
                to,
                Date.now() + 1000 * 60 * 10, //10 minutes
            );
            console.log('liquidity ' , liquid);
            return liquid;
        } catch (e) {
            const error = JSON.parse(JSON.stringify(e));
            console.log("error", error);
            return error.reason
        }

    }


}

const main = () => {
    const main = new MainEthers();
    // main.swapExactTokensForTokens(
    //     '', // wrapped BNB
    //     '', // pancake swap cake
    //     '', // address account of recipient
    //     "0.01",
    //     "16",
    //     "1000000",
    //     "5",
    // )
    main.transfer();
}
main();
