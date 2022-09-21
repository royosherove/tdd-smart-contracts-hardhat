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
  test('isMember() iwthout joining, returns false()', async () => { 
    const { treasury, owner,otherAccount } = await deploy();
    expect(
          await treasury.isMember(otherAccount.address))
          .to.eq(false)
   })

  test('join(), with needed payment, can be verified with isMember()', async () => { 
    const { treasury, owner,otherAccount } = await deploy();

    await treasury
      .connect(otherAccount)
      .join({value:parseEther('0.1')});

    expect(await treasury.isMember(otherAccount.address))
          .to.eq(true)
   })
  test('join(), with below threshold payment payment, revets with message()', async () => { 
    const { treasury, owner,otherAccount } = await deploy();

    await expect( treasury.join({value:parseEther('0.01')}))
            .to.revertedWithCustomError(treasury,"NotPaid")

   })
  test("receive(), with 1 eth sent, can be received()", async function () {
    const { treasury, owner,otherAccount } = await deploy();

    await send1EthFromTo(owner, treasury);

    const balance = await treasury.getBalance();
    expect(formatEther(balance)).to.eq("1.0");
  });
  test("getBalance(), 1 eth sent, shows 1 eth", async function () {
    const { treasury, owner,otherAccount } = await deploy();

    await send1EthFromTo(owner, treasury);

    const balance = await ethers.provider.getBalance(treasury.address);
    expect(formatEther(balance)).to.eq("1.0");
  });
});
