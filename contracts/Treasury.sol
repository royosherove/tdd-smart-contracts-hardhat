// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Treasury {

    function getBalance() public view  returns (uint256) {
        // return 0;
        return address(this).balance;
    }

    receive() external payable {

    }
}
