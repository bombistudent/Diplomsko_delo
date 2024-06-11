async function main() {
  const { ethers } = require("hardhat");

  // Load the BlockWheels contract's artifacts
  const BlockWheels = await ethers.getContractFactory("BlockWheels");

  console.log("Deploying BlockWheels...");

  // Deploy the BlockWheels contract
  const blockWheels = await BlockWheels.deploy();

  // Wait for the deployment to be confirmed
  await blockWheels.waitForDeployment();

  console.log("BlockWheels deployed to:", blockWheels.getAddress());
}

// Execute the deployment function
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
