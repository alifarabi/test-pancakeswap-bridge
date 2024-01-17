const express = require('express');
const { ethers } = require('ethers');
const app = express();
const port = 3000;

const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

const contract = {
    factory: '', // PancakeSwap V2 factory
    router: '', // PancakeSwap V2 router
};
const tokens = {
    BUSD: '',
    SCZ: '',
    DOP: '',
    PEG: '',
};

const router = new ethers.Contract(
    contract.router,
    ['function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)'],
    provider
);

app.get('/getPrice', (req, res) => {

    let 
        token  = req.query.token,
        tokenBase = req.query.tokenBase,
        amount = req.query.amount,
        des = req.query.des;
    
    if ( !amount ) {
        amount = 1
    }

    if(token.indexOf('0x') === -1){
        token = tokens[token.toUpperCase()];
    }
    
    if(token) {
        getPrice(token, tokenBase, amount, des).then(price => {
            res.json({
                success: true,
                BUSD: price
            });
        });

    }else{
        res.status(400).json({
            success: false,
            description: 'missing `token` parameter'
        });
    } 
});

app.listen(port, () => {
    console.log(`getPrice listening at http://localhost:${port}`)
});

async function getPrice(inputCurrency, outputCurrency, amount, des){
    const amounts = await router.getAmountsOut(ethers.utils.parseUnits(amount.toString(), des), [inputCurrency, outputCurrency]);
    return amounts[1].toString()/1e18;
}