// scripts/verifyRequest.js
require("dotenv").config();
const hre = require("hardhat");

async function main(){
  const contract = await hre.ethers.getContractAt("DonationPool", process.env.CONTRACT_ADDRESS);
  const tx = await contract.fundRequest(Number(process.env.DEMO_REQUEST_ID || 0));
  await tx.wait();
  console.log("fundRequest tx:", tx.hash);
}
main().catch(console.error);
