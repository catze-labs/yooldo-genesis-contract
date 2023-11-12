import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const YooldoToken = await ethers.getContractFactory("YooldoToken");
  const yooldoToken = await YooldoToken.deploy(deployer.address);

  // check balance of this token
  const balance = await yooldoToken.balanceOf(deployer.address);
  console.log("Balance of deployer:", ethers.utils.formatEther(balance));

  console.log("YooldoToken address:", yooldoToken.address);
  
  console.log(`npx hardhat verify --network eth_sepolia ${yooldoToken.address} ${deployer.address}`)

  // npx hardhat run --network eth_sepolia scripts/deploy.ts 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

