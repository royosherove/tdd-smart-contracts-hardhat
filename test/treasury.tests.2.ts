import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Treasury } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

//some helpers
const { parseEther, formatEther } = ethers.utils;
const { provider } = ethers;
const test = it;

const deploy = async () => {
  const [owner, otherAccount] = await ethers.getSigners();

  const TreasuryContract = await ethers.getContractFactory("Treasury");
  const treasury = await TreasuryContract.deploy();

  return { treasury, owner, otherAccount };
};
const send1EthFromTo = async (owner: SignerWithAddress, treasury: Treasury) => {
  await owner.sendTransaction({
    to: treasury.address,
    value: parseEther("1"),
  });
};

describe("Treasury", async () => {
  test("receive(), with 1 eth sent, can be received()", async function () {
    const { treasury, owner } = await deploy();

    await send1EthFromTo(owner, treasury);

    const balance = await treasury.getBalance();
    expect(formatEther(balance)).to.eq("1.0");
  });
  test("getBalance(), 1 eth sent, shows 1 eth", async function () {
    const { treasury, owner } = await deploy();

    await send1EthFromTo(owner, treasury);

    const balance = await ethers.provider.getBalance(treasury.address);
    expect(formatEther(balance)).to.eq("1.0");
  });
});
