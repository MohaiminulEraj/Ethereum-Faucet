// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Owned.sol";
// import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, IFaucet {
    // storing address of all the users that are using addFunds()
    uint256 public numOffFunders;

    mapping(address => bool) private funders;
    mapping(uint256 => address) private lutFunders; // look up table funders

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 1000000000000000000,
            "Cannot withdraw more than 1 ether"
        );
        _;
    }

    receive() external payable {}

    // function emitLog() public pure override returns (bytes32) {
    //     return "Faucet";
    // }

    function addFunds() external payable override {
        address funder = msg.sender;
        // prevent duplicatation
        if (!funders[funder]) {
            uint256 index = numOffFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    function withdraw(uint256 withdrawAmount)
        external
        override
        limitWithdraw(withdrawAmount)
    {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOffFunders);
        for (uint256 i = 0; i < numOffFunders; i++) {
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return lutFunders[index];
    }
}

// const { ethers } = require('ethers');
// const instance = await Faucet.deployed();
// instance.addFunds({from: accounts[0], value: ethers.utils.parseEther('1')});
// instance.addFunds({from: accounts[1], value: ethers.utils.parseEther('1')});
// instance.withdraw("500000000000000000", {from: accounts[1]});
