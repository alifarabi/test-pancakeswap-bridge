import * as chalk from "chalk";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
import inquirer from "inquirer";

dotenv.config();

class TradeShit {
  public initialLiquidityDetected: boolean = false;
  public erc: any;
  public factory: any;
  public router: any;
  public data: any;
  public provider: any;
  public wallet: any;
  public account: any;

  //   public factory: string;

  constructor() {
    this.setDataFromEnv();
    this.init("wss://bsc-ws-node.nariox.org:443");
    this.setContract();
  }

  init(wss: string) {
    // this.provider = new ethers.providers.WebSocketProvider(wss);
    this.provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-2-s1.binance.org:8545/');
    // @ts-ignore
    this.wallet = new ethers.Wallet(Buffer.from(process.env.YOUR_MNEMONIC, "hex"));
    this.account = this.wallet.connect(this.provider);
  }

  async setContract() {

    this.factory = new ethers.Contract(
      this.data.factory,
      [
        "event PairCreated(address indexed token0, address indexed token1, address pair, uint)",
        "function getPair(address tokenA, address tokenB) external view returns (address pair)"
      ],
      this.account
    );

    this.router = new ethers.Contract(
      this.data.router,
      [
        "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
      ],
      this.account
    );
    this.erc = new ethers.Contract(
      this.data.WBNB,
      [
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          payable: false,
          type: "function"
        },
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
      ],
      this.account
    );


    console.log("Factory Contract initails!", this.factory !== undefined ? "✔" : "❌");
    console.log("Router Contract initails!", this.router !== undefined ? "✔" : "❌");
    console.log("Erc Contract initails!", this.erc !== undefined ? "✔" : "❌");

  }

  setDataFromEnv() {
    this.data = {
      WBNB: process.env.WBNB_CONTRACT, //wbnb

      to_PURCHASE: process.env.TO_PURCHASE, // token that you will purchase = BUSD for test ''

      AMOUNT_OF_WBNB: process.env.AMOUNT_OF_WBNB, // how much you want to buy in WBNB

      factory: process.env.FACTORY, //PancakeSwap V2 factory

      router: process.env.ROUTER, //PancakeSwap V2 router

      recipient: process.env.YOUR_ADDRESS, //your wallet address,

      Slippage: process.env.SLIPPAGE, //in Percentage

      gasPrice: process.env.GWEI, //in gwei

      gasLimit: process.env.GAS_LIMIT, //at least 21000

      minBnb: process.env.MIN_LIQUIDITY_ADDED //min liquidity added
    };
  }

  /**
   * buy
   */
  public async buy(
    tokenIn: any,
    tokenOut: any,
    slippage: any,
    AMOUNT_OF_WBNB: any,
    recipient: any,
    gasLimit: any,
    gasPrice: any
  ): Promise<any> {
    const jmlBnb = await this.chechLiqudity(tokenIn, tokenOut);

    console.log("jmlBnb", jmlBnb);

    if (parseInt(jmlBnb) > parseInt(this.data.minBnb)) {
      setTimeout(
        () =>
          this.buyAction(
            tokenIn,
            tokenOut,
            slippage,
            AMOUNT_OF_WBNB,
            recipient,
            gasLimit,
            gasPrice
          ),
        3000
      );
    } else {
      this.initialLiquidityDetected = false;
      console.log(" run again...");
      return await this.buy(
        tokenIn,
        tokenOut,
        slippage,
        AMOUNT_OF_WBNB,
        recipient,
        gasLimit,
        gasPrice
      );
    }
  }

  /**
   * buyAction
   */
  public async buyAction(
    tokenIn: string,
    tokenOut: string,
    slippage: string,
    AMOUNT_OF_WBNB: string,
    recipient: string,
    gasLimit: string,
    gasPrice: string
  ) {
    if (this.initialLiquidityDetected === true) {
      console.log("not buy cause already buy");
      return null;
    }

    console.log("ready to buy");

    try {
      this.initialLiquidityDetected = true;
      //We buy x amount of the new token for our wbnb
      const amountIn = ethers.utils.parseUnits(`${AMOUNT_OF_WBNB}`, "ether");
      const amounts = await this.getPrice(AMOUNT_OF_WBNB, tokenIn, tokenOut);

      //Our execution price will be a bit different, we need some flexbility
      // const amountOutMin = amounts[1].sub(amounts[1].div(`${data.slippage}`));
      const amountOutMin = amounts[1]
        .mul(`${100 - parseInt(slippage)}`)
        .div(`100`);

      console.log(
        chalk.green.inverse(`Start to buy \n`) +
        `Buying Token
          =================
          tokenIn: ${amountIn.toString()} ${tokenIn} (WBNB)
          tokenOut: ${amountOutMin.toString()} ${tokenOut}
        `
      );

      console.log("Processing Transaction.....");
      console.log(chalk.yellow(`amountIn: ${amountIn}`));
      console.log(chalk.yellow(`amountOutMin: ${amountOutMin}`));
      console.log(chalk.yellow(`tokenIn: ${tokenIn}`));
      console.log(chalk.yellow(`tokenOut: ${tokenOut}`));
      console.log(chalk.yellow(`data.recipient: ${recipient}`));
      console.log(chalk.yellow(`data.gasLimit: ${gasLimit}`));
      console.log(
        chalk.yellow(
          `data.gasPrice: ${ethers.utils.parseUnits(`${gasPrice}`, "gwei")}`
        )
      );

      const tx = await this.router.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        [tokenIn, tokenOut],
        recipient,
        Date.now() + 1000 * 60 * 5, //5 minutes
        {
          gasLimit: gasLimit,
          gasPrice: ethers.utils.parseUnits(`${gasPrice}`, "gwei"),
          nonce: null //set you want buy at where position in blocks
        }
      );

      const receipt = await tx.wait();

      console.log("----", receipt);

      console.log(
        `Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`
      );
      return receipt;
    } catch (err) {
      let error = JSON.parse(JSON.stringify(err));
      console.log(`Error caused by :
          {
          reason : ${error.reason},
          transactionHash : ${error.transactionHash}
          message : Please check your BNB/WBNB balance, maybe its due because insufficient balance or approve your token manually on pancakeSwap
          }`);
      console.log(error);

      inquirer
        .prompt([
          {
            type: "confirm",
            name: "runAgain",
            message: "Do you want to run again thi bot?"
          }
        ])
        .then((answers) => {
          if (answers.runAgain === true) {
            console.log(
              "= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = ="
            );
            console.log("Run again");
            console.log(
              "= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = ="
            );
            this.initialLiquidityDetected = false;
            this.buy(
              tokenIn,
              tokenOut,
              slippage,
              AMOUNT_OF_WBNB,
              recipient,
              gasLimit,
              gasPrice
            );
          } else {
            process.exit();
          }
        });
    }
  }

  /**
   * chechLiqudity
   */
  public async chechLiqudity(tokenIn: any, tokenOut: any): Promise<any> {
    const pairAddressx = await this.factory.getPair(tokenIn, tokenOut);
    console.log(chalk.blue(`pairAddress: ${pairAddressx}`));
    if (pairAddressx !== null && pairAddressx !== undefined) {
      // console.log("pairAddress.toString().indexOf('')", pairAddress.toString().indexOf(''));
      if (pairAddressx.toString().indexOf("0x0000000000000") > -1) {
        console.log(
          chalk.red(`pairAddress ${pairAddressx} not detected. Auto restart`)
        );
        return await this.chechLiqudity(tokenIn, tokenOut);
      }
    }
    console.log("this.erc", this.erc);

    const pairBNBvalue = await this.erc.balanceOf(pairAddressx);
    console.log("pairBNBvalue", pairBNBvalue);

    const jmlBnb = ethers.utils.formatEther(pairBNBvalue);
    console.log(`value BNB : ${jmlBnb}`);

    return jmlBnb;
  }

  /**
   * getPrice
   */
  public async getPrice(
    AMOUNT_OF_WBNB: string,
    tokenIn: string,
    tokenOut: string
  ): Promise<Array<ethers.BigNumber>> {
    const amountIn = ethers.utils.parseUnits(`${AMOUNT_OF_WBNB}`);
    const amounts = await this.router.getAmountsOut(amountIn, [
      tokenIn,
      tokenOut
    ]);
    return amounts;
  }

  public async getPriceHuman(
    AMOUNT_OF_WBNB: string,
    tokenIn: string,
    tokenOut: string,
    unitName: string
  ): Promise<any> {
    const amountIn = ethers.utils.parseUnits(`${AMOUNT_OF_WBNB}`, unitName);
    const amounts = await this.router.getAmountsOut(amountIn, [
      tokenIn,
      tokenOut
    ]);
    return <any>amounts[1].toString() / (Math.pow(10, 18));
  }

  /**
   * estimateGas
   */
  public async estimateGas() {
  }

  /**
   * getFee
   */
  public async getFee() {
  }


  /**
   * getBalanceOfToken
   * for get balance of token with get token address to func.
   * @param tokenAddress
   * @return balanceOfToken
   */
  public async getBalanceOfToken(tokenAddress: string): Promise<string> {
    const tokenErc = new ethers.Contract(
      tokenAddress,
      [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
      ],
      this.account
    );
    const walletAddress = this.wallet.getAddress();
    const balance = await tokenErc.balanceOf(walletAddress);
    const decimal = await tokenErc.decimals();
    const symbol = await tokenErc.symbol();
    let formatBalance = ethers.utils.formatUnits(balance, decimal);
    return `💛 Balance Of Your Token -> ${symbol} is : ${formatBalance} 💛`;


  }



    /**
   * getBalanceOfAccount
   * برای گرفتن مقدار bnb در حساب
   */

  public async getBalanceOfAccount(): Promise<any> {

    const res = await this.wallet.getAddress()
    console.log(res);
    const b = await this.account.getBalance();
    const c = ethers.utils.formatUnits(b)
    return c
    
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

    const send_abi = [{
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
    }];

    const currentGasPrice = await this.provider.getGasPrice();
    console.log(currentGasPrice.toString());
    let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice));
    console.log(`gas_price: ${gas_price}`);

    if (contract_address)// general token send
    {
      let contract = new ethers.Contract(contract_address, send_abi, this.account);

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
      const transferResult = await contract.transfer(to_address, numberOfTokens);
      console.dir(transferResult);
      console.dir('gasPrice', transferResult.gasPrice.toString());
      console.dir('gasLimit', transferResult.gasLimit.toString());

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

  public async sendBnb(
    send_token_amount: any,
    to_address: any
  ){
    const tx = await this.account.sendTransaction({
      to: to_address,
      value: ethers.utils.parseEther(send_token_amount)
    });

    console.log(tx);
  }



}

const run = async () => {
  const bot = new TradeShit();
  // const balance = await bot.send_token("", "0.05", "");
  //  await bot.sendBnb( "0.05", "");
  // const balance = await bot.getBalanceOfToken('')
  const  balance = await bot.getBalanceOfAccount()

  console.log(balance);

  // let res = await bot.getPriceHuman('100000','' ,'', '18')

  // let res = bot.erc.name()
  // console.log(res );

  // const x = await bot.buy(
  //   "",
  //   "",
  //   "16",
  //   "0.001",
  //   "",
  //   "1000000",
  //   "5"
  // );
};

run();
