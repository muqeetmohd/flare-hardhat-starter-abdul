// scripts/donate.js
require("dotenv").config();
const hre = require("hardhat");

async function main(){
  const contract = await hre.ethers.getContractAt("DonationPool", process.env.CONTRACT_ADDRESS);
  const tx = await contract.connect((await hre.ethers.getSigners())[1]).donate({ value: hre.ethers.parseEther("0.01") }); // adjust amount
  const rc = await tx.wait();
  console.log("Donation tx:", tx.hash);
}
main().catch(console.error);
