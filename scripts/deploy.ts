import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const YooldoToken = await ethers.getContractFactory("YooldoToken");
  const yooldoToken = await YooldoToken.deploy();

  console.log("YooldoToken address:", yooldoToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
