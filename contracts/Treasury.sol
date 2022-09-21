// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Treasury {
    error NotPaid();
    
    mapping (address => bool) members  ;

    function getBalance() public view  returns (uint256) {
        return address(this).balance;
    }

    function join() public payable {
        if(msg.value < 0.1 ether) revert NotPaid();
        members[msg.sender] = true; 
    }

    function isMember(address _address) public view returns (bool){
       return members[_address];
    }

    receive() external payable { }
}
