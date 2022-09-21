import { HardhatUserConfig } from "hardhat/config";
require('hardhat-watcher')

import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

export default config;
