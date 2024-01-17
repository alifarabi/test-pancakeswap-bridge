const ethers = require ("ethers") ;

const HDWallet = require('ethereum-hdwallet')

try {
    const mnemonic = ''
    const hdwallet = HDWallet.fromMnemonic(mnemonic)
    const mywallet = hdwallet.derive(`m/44'/60'/0'/0`)

    console.log("my wallet" , mywallet)
    console.log(`0x${mywallet.derive(1).getAddress().toString('hex')}`) //
    console.log(`0x${mywallet.derive(2).getAddress().toString('hex')}`) //
    console.log(`0x${mywallet.derive(3).getAddress().toString('hex')}`) //
    console.log(`0x${mywallet.derive(1000).getAddress().toString('hex')}`) //
    console.log(`0x${mywallet.derive(3).hdpath()}`) // 

    const isaddress = ethers.utils.isAddress(
        `0x${mywallet.derive(1).getAddress().toString('hex')}`)
    console.log("ether getAddress" ,
        ethers.utils.getAddress(`0x${mywallet.derive(5).getAddress().toString('hex')}`));
    console.log("isaddress" , isaddress);

} catch (e) {
    console.log("errrooor", e.message)
}



