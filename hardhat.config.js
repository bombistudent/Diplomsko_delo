require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // Or your custom RPC endpoint
      chainId: 31337,
      name: "Hardhat Local Network"
    },
    // Other network configurations...
  },
  solidity: "0.8.19",
  hardhat: {
    loggingEnabled: true,
  }
};
