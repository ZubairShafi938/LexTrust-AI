require("dotenv").config({ path: "../.env" });
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    // Free public testnet — good default for a hackathon submission.
    // Get an RPC URL from Alchemy/Infura and testnet ETH from a faucet.
    sepolia: {
      url: process.env.RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Polygon Amoy is another cheap/fast option if the bounty prefers Polygon.
    amoy: {
      url: process.env.RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
