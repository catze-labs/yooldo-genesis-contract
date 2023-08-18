import { ethers } from "hardhat";
import { expect } from "chai";

describe("YooldoToken", function () {
  it("Should deploy and mint tokens", async function () {
    const YooldoToken = await ethers.getContractFactory("YooldoToken");
    const yooldoToken = await YooldoToken.deploy();

    await yooldoToken.deployed();

    const [owner, addr1] = await ethers.getSigners();

    // Mint tokens to an address
    const mintAmount = ethers.utils.parseEther("1000");
    await yooldoToken.mint(addr1.address, mintAmount);

    const balanceOwner = await yooldoToken.balanceOf(owner.address);
    const balanceAddr1 = await yooldoToken.balanceOf(addr1.address);

    expect(balanceOwner).to.equal(0);
    expect(balanceAddr1).to.equal(mintAmount);
  });
});
