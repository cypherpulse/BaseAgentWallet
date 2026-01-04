// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BaseAgentWallet.sol";

contract DeployAgentWallet is Script {
    function run() external {
        vm.startBroadcast();

        address treasury = msg.sender; // Deployer as treasury

        BaseAgentWallet wallet = new BaseAgentWallet(treasury);

        vm.stopBroadcast();

        console.log("BaseAgentWallet deployed at:", address(wallet));
    }
}