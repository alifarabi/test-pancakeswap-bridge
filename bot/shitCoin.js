"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var chalk = require("chalk");
var ethers = require("ethers");
var dotenv = require("dotenv");
var inquirer_1 = require("inquirer");
dotenv.config();
var TradeShit = /** @class */ (function () {
    //   public factory: string;
    function TradeShit() {
        this.initialLiquidityDetected = false;
        this.setDataFromEnv();
        this.init("wss://bsc-ws-node.nariox.org:443");
        this.setContract();
    }
    TradeShit.prototype.init = function (wss) {
        this.provider = new ethers.providers.WebSocketProvider(wss);
        this.wallet = new ethers.Wallet(Buffer.from(process.env.YOUR_MNEMONIC, "hex"));
        this.account = this.wallet.connect(this.provider);
    };
    TradeShit.prototype.setContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.factory = new ethers.Contract(this.data.factory, [
                    "event PairCreated(address indexed token0, address indexed token1, address pair, uint)",
                    "function getPair(address tokenA, address tokenB) external view returns (address pair)",
                ], this.account);
                this.router = new ethers.Contract(this.data.router, [
                    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
                    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
                ], this.account);
                this.erc = new ethers.Contract(this.data.WBNB, [
                    {
                        constant: true,
                        inputs: [{ name: "_owner", type: "address" }],
                        name: "balanceOf",
                        outputs: [{ name: "balance", type: "uint256" }],
                        payable: false,
                        type: "function"
                    },
                ], this.account);
                console.log('Factory Contract initails!', this.factory);
                console.log('Router Contract initails!', this.router);
                console.log('Erc Contract initails!', this.erc);
                return [2 /*return*/];
            });
        });
    };
    TradeShit.prototype.setDataFromEnv = function () {
        this.data = {
            WBNB: process.env.WBNB_CONTRACT,
            to_PURCHASE: process.env.TO_PURCHASE,
            AMOUNT_OF_WBNB: process.env.AMOUNT_OF_WBNB,
            factory: process.env.FACTORY,
            router: process.env.ROUTER,
            recipient: process.env.YOUR_ADDRESS,
            Slippage: process.env.SLIPPAGE,
            gasPrice: process.env.GWEI,
            gasLimit: process.env.GAS_LIMIT,
            minBnb: process.env.MIN_LIQUIDITY_ADDED
        };
    };
    /**
     * buy
     */
    TradeShit.prototype.buy = function (tokenIn, tokenOut, slippage, AMOUNT_OF_WBNB, recipient, gasLimit, gasPrice) {
        return __awaiter(this, void 0, void 0, function () {
            var jmlBnb;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chechLiqudity(tokenIn, tokenOut)];
                    case 1:
                        jmlBnb = _a.sent();
                        console.log("jmlBnb", jmlBnb);
                        if (!(parseInt(jmlBnb) > parseInt(this.data.minBnb))) return [3 /*break*/, 2];
                        setTimeout(function () {
                            return _this.buyAction(tokenIn, tokenOut, slippage, AMOUNT_OF_WBNB, recipient, gasLimit, gasPrice);
                        }, 3000);
                        return [3 /*break*/, 4];
                    case 2:
                        this.initialLiquidityDetected = false;
                        console.log(" run again...");
                        return [4 /*yield*/, this.buy(tokenIn, tokenOut, slippage, AMOUNT_OF_WBNB, recipient, gasLimit, gasPrice)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * buyAction
     */
    TradeShit.prototype.buyAction = function (tokenIn, tokenOut, slippage, AMOUNT_OF_WBNB, recipient, gasLimit, gasPrice) {
        return __awaiter(this, void 0, void 0, function () {
            var amountIn, amounts, amountOutMin, tx, receipt, err_1, error;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.initialLiquidityDetected === true) {
                            console.log("not buy cause already buy");
                            return [2 /*return*/, null];
                        }
                        console.log("ready to buy");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        this.initialLiquidityDetected = true;
                        amountIn = ethers.utils.parseUnits("" + AMOUNT_OF_WBNB, "ether");
                        return [4 /*yield*/, this.getPrice(AMOUNT_OF_WBNB, tokenIn, tokenOut)];
                    case 2:
                        amounts = _a.sent();
                        amountOutMin = amounts[1]
                            .mul("" + (100 - parseInt(slippage)))
                            .div("100");
                        console.log(chalk.green.inverse("Start to buy \n") +
                            ("Buying Token\n          =================\n          tokenIn: " + amountIn.toString() + " " + tokenIn + " (WBNB)\n          tokenOut: " + amountOutMin.toString() + " " + tokenOut + "\n        "));
                        console.log("Processing Transaction.....");
                        console.log(chalk.yellow("amountIn: " + amountIn));
                        console.log(chalk.yellow("amountOutMin: " + amountOutMin));
                        console.log(chalk.yellow("tokenIn: " + tokenIn));
                        console.log(chalk.yellow("tokenOut: " + tokenOut));
                        console.log(chalk.yellow("data.recipient: " + recipient));
                        console.log(chalk.yellow("data.gasLimit: " + gasLimit));
                        console.log(chalk.yellow("data.gasPrice: " + ethers.utils.parseUnits("" + gasPrice, "gwei")));
                        return [4 /*yield*/, this.router.swapExactTokensForTokens(amountIn, amountOutMin, [tokenIn, tokenOut], recipient, Date.now() + 1000 * 60 * 5, //5 minutes
                            {
                                gasLimit: gasLimit,
                                gasPrice: ethers.utils.parseUnits("" + gasPrice, "gwei"),
                                nonce: null
                            })];
                    case 3:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 4:
                        receipt = _a.sent();
                        console.log("----", receipt);
                        console.log("Transaction receipt : https://www.bscscan.com/tx/" + receipt.logs[1].transactionHash);
                        return [2 /*return*/, receipt];
                    case 5:
                        err_1 = _a.sent();
                        error = JSON.parse(JSON.stringify(err_1));
                        console.log("Error caused by :\n          {\n          reason : " + error.reason + ",\n          transactionHash : " + error.transactionHash + "\n          message : Please check your BNB/WBNB balance, maybe its due because insufficient balance or approve your token manually on pancakeSwap\n          }");
                        console.log(error);
                        inquirer_1["default"]
                            .prompt([
                            {
                                type: "confirm",
                                name: "runAgain",
                                message: "Do you want to run again thi bot?"
                            },
                        ])
                            .then(function (answers) {
                            if (answers.runAgain === true) {
                                console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
                                console.log("Run again");
                                console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
                                _this.initialLiquidityDetected = false;
                                _this.buy(tokenIn, tokenOut, slippage, AMOUNT_OF_WBNB, recipient, gasLimit, gasPrice);
                            }
                            else {
                                process.exit();
                            }
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * chechLiqudity
     */
    TradeShit.prototype.chechLiqudity = function (tokenIn, tokenOut) {
        return __awaiter(this, void 0, void 0, function () {
            var pairAddressx, pairBNBvalue, jmlBnb;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.factory.getPair(tokenIn, tokenOut)];
                    case 1:
                        pairAddressx = _a.sent();
                        console.log(chalk.blue("pairAddress: " + pairAddressx));
                        if (!(pairAddressx !== null && pairAddressx !== undefined)) return [3 /*break*/, 3];
                        if (!(pairAddressx.toString().indexOf("") > -1)) return [3 /*break*/, 3];
                        console.log(chalk.red("pairAddress " + pairAddressx + " not detected. Auto restart"));
                        return [4 /*yield*/, this.chechLiqudity(tokenIn, tokenOut)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        console.log("this.erc", this.erc);
                        return [4 /*yield*/, this.erc.balanceOf(pairAddressx)];
                    case 4:
                        pairBNBvalue = _a.sent();
                        console.log("pairBNBvalue", pairBNBvalue);
                        jmlBnb = ethers.utils.formatEther(pairBNBvalue);
                        console.log("value BNB : " + jmlBnb);
                        return [2 /*return*/, jmlBnb];
                }
            });
        });
    };
    /**
     * getPrice
     */
    TradeShit.prototype.getPrice = function (AMOUNT_OF_WBNB, tokenIn, tokenOut) {
        return __awaiter(this, void 0, void 0, function () {
            var amountIn, amounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amountIn = ethers.utils.parseUnits("" + AMOUNT_OF_WBNB, "ether");
                        return [4 /*yield*/, this.router.getAmountsOut(amountIn, [
                                tokenIn,
                                tokenOut,
                            ])];
                    case 1:
                        amounts = _a.sent();
                        return [2 /*return*/, amounts];
                }
            });
        });
    };
    /**
     * estimateGas
     */
    TradeShit.prototype.estimateGas = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    /**
     * getFee
     */
    TradeShit.prototype.getFee = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    return TradeShit;
}());
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var bot, b, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bot = new TradeShit();
                return [4 /*yield*/, bot.getPrice('1000000', '', '')];
            case 1:
                b = _a.sent();
                console.log(b);
                console.log(b[0].toString());
                console.log(b[1].toString());
                res = b[1].toString() / 1e18;
                console.log(res);
                return [2 /*return*/];
        }
    });
}); };
run();
