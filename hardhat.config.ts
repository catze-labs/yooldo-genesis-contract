require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const BSC_TESTNET_RPC_URL = process.env.BSC_TESTNET_RPC_URL;
const POLYGON_TESTNET_RPC_URL = process.env.POLYGON_TESTNET_RPC_URL;
const ETH_SEPOLIA_RPC_URL = process.env.ETH_SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    bsc_testnet: {
      url: `${BSC_TESTNET_RPC_URL}`,
      accounts: [`${PRIVATE_KEY}`],
      gas : 20000000,
      gasPrice : 10000000000,
    },
    polygon_testnet: {
      url: `${POLYGON_TESTNET_RPC_URL}`,
      accounts: [`${PRIVATE_KEY}`],
    },
    eth_sepolia: {
      url: `${ETH_SEPOLIA_RPC_URL}`,
      accounts: [`${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY
  },
};

export default config;
