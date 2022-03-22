// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    // storing address of all the users that are using addFunds()
    uint256 public numOffFunders;
    mapping(address => bool) private funders;

    receive() external payable {}

    function addFunds() external payable {
        address funder = msg.sender;
        if (!funders[funder]) {
            numOffFunders++;
            funders[funder] = true;
        }
    }
}

// const { ethers } = require('ethers');
// const instance = await Faucet.deployed();
// instance.addFunds({from: accounts[0], value: ethers.utils.parseEther('1')});
// instance.addFunds({from: accounts[1], value: ethers.utils.parseEther('1')});
