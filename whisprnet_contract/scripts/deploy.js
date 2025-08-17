const hre = require("hardhat");

async function main() {
  const whisprnet = await hre.ethers.getContractFactory("whisprnet");
  const whisprnet = await whisprnet.deploy();
  await whisprnet.waitForDeployment();

  console.log("whisprnet deployed to:", whisprnet.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
