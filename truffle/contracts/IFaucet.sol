// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// Interfaces:
// they cannot inherit from other smart contracts
// they can only inherit from other interfaces

// They cannot declare a constructor
// They cannot declare state variables
// all declared functions have to be external

interface IFaucet {
    function addFunds(uint256 amount) external payable;

    function withdraw(uint256 withdrawAmount) external;
}
