import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


describe("YooldoToken", function () {
  let YooldoToken: Contract;
  
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  const MAXIMUM_SUPPLY = BigNumber.from("1000000000").mul(BigNumber.from("10").pow(18)); // 1 billion with 18 decimals

  beforeEach(async function () {
    // Get the signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    const YooldoTokenFactory = await ethers.getContractFactory("YooldoToken", owner);
    YooldoToken = await YooldoTokenFactory.deploy(owner.getAddress());
    await YooldoToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await YooldoToken.hasRole(await YooldoToken.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should mint the total supply to the owner", async function () {
      const ownerBalance = await YooldoToken.balanceOf(owner.address);
      expect(await YooldoToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await YooldoToken.transfer(addr1.address, 50);
      const addr1Balance = await YooldoToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await YooldoToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (all tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(YooldoToken.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await YooldoToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await YooldoToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await YooldoToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await YooldoToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await YooldoToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await YooldoToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await YooldoToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });

  describe("Pausing", function () {
    it("Should pause and unpause the contract", async function () {
      await YooldoToken.pause();
      await expect(YooldoToken.transfer(addr1.address, 50)).to.be.revertedWith("Pausable: paused");

      await YooldoToken.unpause();
      await YooldoToken.transfer(addr1.address, 50);
      const addr1Balance = await YooldoToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);
    });

    it("Should prevent non-pausers from pausing", async function () {
      await expect(YooldoToken.connect(addr1).pause()).to.be.revertedWith(`AccessControl: account ${addr1.address.toLowerCase()} is missing role ${await YooldoToken.PAUSER_ROLE()}`);
    });

    it("Should allow pausers to pause", async function () {
      await YooldoToken.connect(owner).pause();
      await expect(YooldoToken.transfer(addr1.address, 50)).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Safety", function () {

    // Error Messages
    it("Should emit an error message when trying to transfer more than balance", async function () {
      const initialBalance = await YooldoToken.balanceOf(owner.address);
      const transferAmount = initialBalance.add(1); // More than the owner's balance
      await expect(YooldoToken.connect(owner).transfer(addr1.address, transferAmount)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    // Edge Cases
    it("Should not allow transferring to the zero address", async function () {
      await expect(YooldoToken.connect(owner).transfer(ethers.constants.AddressZero, 100)).to.be.revertedWith("ERC20: transfer to the zero address");
    });

    // Additional tests for checking the correct error message on trying to burn more tokens than an account holds
    it("Should revert with an error when trying to burn more tokens than the account holds", async function () {
      // Assuming owner has all the tokens initially
      const burnAmount = MAXIMUM_SUPPLY.add(1); // More than the total supply
      await expect(YooldoToken.connect(owner).burn(burnAmount)).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });
  });
});
