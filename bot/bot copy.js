import ethers from "ethers";
import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import inquirer from "inquirer";
import Web3 from "web3";

const web3 = new Web3();

const app = express();
dotenv.config();


let jmlBnb = 0;

const bscMainnetUrl = "https://bsc-dataseed1.defibit.io/"; //https://bsc-dataseed1.defibit.io/ https://bsc-dataseed.binance.org/
const tokenIn = data.WBNB;
const tokenOut = data.to_PURCHASE;
// const provider = new ethers.providers.JsonRpcProvider(bscMainnetUrl)




const run = async () => {
  await checkLiq();
};

let checkLiq = async () => {
};

let buyAction = async () => {

  
};

run();

const PORT = 5000;

app.listen(
  PORT,
  console.log(
    chalk.yellow(
      `Listening for Liquidity Addition to token ${data.to_PURCHASE}`
    )
  )
);
