const { ethers } = require("hardhat");

async function main() {
  const PrivateMessenger = await ethers.getContractFactory("PrivateMessenger");
  const contract = await PrivateMessenger.deploy();
  await contract.waitForDeployment(); // for ethers v6

  console.log("PrivateMessenger deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
