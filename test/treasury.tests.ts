import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Treasury } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { parseEther, formatEther } = ethers.utils;
const { provider } = ethers;
const test = it;

// await expect(lock.withdraw())
//   .to.emit(lock, "Withdrawal")
//   .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg

const deploy = async () => {
  const [owner, otherAccount] = await ethers.getSigners();

  const TreasuryContract = await ethers.getContractFactory("Treasury");
  const treasury = await TreasuryContract.deploy();

  return { treasury, owner, otherAccount };
};
async function send1EthFromOwner(owner: SignerWithAddress, treasury: Treasury) {
  await owner.sendTransaction({
    to: treasury.address,
    value: parseEther("1"),
  });
}
describe("Treasury", async () => {
  let deployment: { owner: any; treasury: any; otherAccount?: SignerWithAddress; };
  describe("with 1 eth sent", async () => {
    beforeEach(async () => {
      deployment = await deploy();
      await send1EthFromOwner(deployment.owner, deployment.treasury);
    });
    it("receive() allows getting the money", async function () {
      const balance = await deployment.treasury.getBalance();
      expect(formatEther(balance)).to.eq("1.0");
    });
    it("getBalance() shows the money", async function () {
      const balance = await provider.getBalance(deployment.treasury.address);
      expect(formatEther(balance)).to.eq("1.0");
    });
  });
});
