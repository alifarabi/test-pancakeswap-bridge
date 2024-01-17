

export default [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function addLiquidity(' +
    '  address tokenA,' +
    '  address tokenB,' +
    '  uint amountADesired,' +
    '  uint amountBDesired,' +
    '  uint amountAMin,' +
    '  uint amountBMin,' +
    '  address to,' +
    '  uint deadline' +
    ') external returns (uint amountA, uint amountB, uint liquidity)',
    'function addLiquidityETH(' +
    '  address token,' +
    '  uint amountTokenDesired,' +
    '  uint amountTokenMin,' +
    '  uint amountETHMin,' +
    '  address to,' +
    '  uint deadline' +
    ') external payable returns (uint amountToken, uint amountETH, uint liquidity)',

    'function removeLiquidityETH(' +
    '  address token,' +
    '  uint liquidity,' +
    '  uint amountTokenMin,' +
    '  uint amountETHMin,' +
    '  address to,' +
    '  uint deadline' +
    ') external returns (uint amountToken, uint amountETH)',
    'function removeLiquidity(' +
    '  address tokenA,' +
    '  address tokenB,' +
    '  uint liquidity,' +
    '  uint amountAMin,' +
    '  uint amountBMin,' +
    '  address to,' +
    '  uint deadline' +
    ') external returns (uint amountA, uint amountB)',
    'function removeLiquidityETHSupportingFeeOnTransferTokens(' +
    '  address token,' +
    '  uint liquidity,' +
    '  uint amountTokenMin,' +
    '  uint amountETHMin,' +
    '  address to,' +
    '  uint deadline '+
    ') external returns (uint amountETH)',
    'function removeLiquidityETHWithPermit(\n' +
    '  address token,\n' +
    '  uint liquidity,\n' +
    '  uint amountTokenMin,\n' +
    '  uint amountETHMin,\n' +
    '  address to,\n' +
    '  uint deadline,\n' +
    '  bool approveMax, uint8 v, bytes32 r, bytes32 s\n' +
    ') external returns (uint amountToken, uint amountETH)' ,
    'function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(\n' +
    '  address token,\n' +
    '  uint liquidity,\n' +
    '  uint amountTokenMin,\n' +
    '  uint amountETHMin,\n' +
    '  address to,\n' +
    '  uint deadline,\n' +
    '  bool approveMax, uint8 v, bytes32 r, bytes32 s\n' +
    ') external returns (uint amountETH);',
    'function removeLiquidityWithPermit(\n' +
    '  address tokenA,\n' +
    '  address tokenB,\n' +
    '  uint liquidity,\n' +
    '  uint amountAMin,\n' +
    '  uint amountBMin,\n' +
    '  address to,\n' +
    '  uint deadline,\n' +
    '  bool approveMax, uint8 v, bytes32 r, bytes32 s\n' +
    ') external returns (uint amountA, uint amountB);',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)\n' +
    '  external\n' +
    '  payable\n' +
    '  returns (uint[] memory amounts);',
    'function swapExactETHForTokensSupportingFeeOnTransferTokens(\n' +
    '  uint amountOutMin,\n' +
    '  address[] calldata path,\n' +
    '  address to,\n' +
    '  uint deadline\n' +
    ') external payable;',
    'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)\n' +
    '  external\n' +
    '  returns (uint[] memory amounts);',
    'function swapExactTokensForETHSupportingFeeOnTransferTokens(\n' +
    '  uint amountIn,\n' +
    '  uint amountOutMin,\n' +
    '  address[] calldata path,\n' +
    '  address to,\n' +
    '  uint deadline\n' +
    ') external;',


]
