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
var _this = this;
var ethers = require('ethers');
var addresses = {
    WBNB: '',
    factory: '',
    router: '',
    recipient: 'recipient of the profit here'
};
//First address of this mnemonic must have enough BNB to pay for tx fess
var mnemonic = '';
var provider = new ethers.providers.WebSocketProvider('Ankr websocket url to mainnet');
var wallet = ethers.Wallet.fromMnemonic(mnemonic);
var account = wallet.connect(provider);
var factory = new ethers.Contract(addresses.factory, ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'], account);
var router = new ethers.Contract(addresses.router, [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
], account);
var wbnb = new ethers.Contract(addresses.WBNB, [
    'function approve(address spender, uint amount) public returns(bool)',
], account);
var init = function () { return __awaiter(_this, void 0, void 0, function () {
    var tx, receipt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, wbnb.approve(router.address, 'replace by amount covering several trades')];
            case 1:
                tx = _a.sent();
                return [4 /*yield*/, tx.wait()];
            case 2:
                receipt = _a.sent();
                console.log('Transaction receipt');
                console.log(receipt);
                return [2 /*return*/];
        }
    });
}); };
factory.on('PairCreated', function (token0, token1, pairAddress) { return __awaiter(_this, void 0, void 0, function () {
    var tokenIn, tokenOut, amountIn, amounts, amountOutMin, tx, receipt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("\n    New pair detected\n    =================\n    token0: " + token0 + "\n    token1: " + token1 + "\n    pairAddress: " + pairAddress + "\n  ");
                if (token0 === addresses.WBNB) {
                    tokenIn = token0;
                    tokenOut = token1;
                }
                if (token1 == addresses.WBNB) {
                    tokenIn = token1;
                    tokenOut = token0;
                }
                //The quote currency is not WBNB
                if (typeof tokenIn === 'undefined') {
                    return [2 /*return*/];
                }
                amountIn = ethers.utils.parseUnits('0.1', 'ether');
                return [4 /*yield*/, router.getAmountsOut(amountIn, [tokenIn, tokenOut])];
            case 1:
                amounts = _a.sent();
                amountOutMin = amounts[1].sub(amounts[1].div(10));
                console.log("\n    Buying new token\n    =================\n    tokenIn: " + amountIn.toString() + " " + tokenIn + " (WBNB)\n    tokenOut: " + amounOutMin.toString() + " " + tokenOut + "\n  ");
                return [4 /*yield*/, router.swapExactTokensForTokens(amountIn, amountOutMin, [tokenIn, tokenOut], addresses.recipient, Date.now() + 1000 * 60 * 10 //10 minutes
                    )];
            case 2:
                tx = _a.sent();
                return [4 /*yield*/, tx.wait()];
            case 3:
                receipt = _a.sent();
                console.log('Transaction receipt');
                console.log(receipt);
                return [2 /*return*/];
        }
    });
}); });
init();
//# sourceMappingURL=app.js.map