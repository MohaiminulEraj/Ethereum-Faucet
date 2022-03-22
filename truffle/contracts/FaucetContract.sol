// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    // storing address of all the users that are using addFunds()
    uint256 public numOffFunders;
    mapping(uint256 => address) private funders;

    receive() external payable {}

    function addFunds() external payable {
        uint256 index = numOffFunders++;
        funders[index] = msg.sender;
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOffFunders);
        for (uint256 i = 0; i < numOffFunders; i++) {
            _funders[i] = funders[i];
        }
        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return funders[index];
    }
}

// const { ethers } = require('ethers');
// const instance = await Faucet.deployed();
// instance.addFunds({from: accounts[0], value: ethers.utils.parseEther('1')});
// instance.addFunds({from: accounts[1], value: ethers.utils.parseEther('1')});
