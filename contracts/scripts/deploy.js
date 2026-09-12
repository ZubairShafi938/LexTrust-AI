const hre = require("hardhat");

async function main() {
  const AuditRegistry = await hre.ethers.getContractFactory("AuditRegistry");
  const registry = await AuditRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("AuditRegistry deployed to:", address);
  console.log("Add this to your .env as CONTRACT_ADDRESS, then set CHAIN_MODE=onchain");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
