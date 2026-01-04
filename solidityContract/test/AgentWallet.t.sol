// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/BaseAgentWallet.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("MockToken", "MTK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract AgentWalletTest is Test {
    BaseAgentWallet wallet;
    MockERC20 token;
    address owner = address(1);
    address agent = address(2);
    address treasury = address(3);
    address user = address(4);

    function setUp() public {
        vm.prank(owner);
        wallet = new BaseAgentWallet(treasury);
        token = new MockERC20();
    }

    function testDepositETH() public {
        vm.deal(user, 1 ether);
        vm.prank(user);
        (bool success,) = address(wallet).call{value: 1 ether}("");
        require(success);
        assertEq(wallet.getBalance(), 1 ether);
    }

    function testDepositERC20() public {
        token.transfer(user, 500 * 10**18);
        vm.prank(user);
        token.approve(address(wallet), 500 * 10**18);
        vm.prank(user);
        wallet.depositERC20(address(token), 500 * 10**18);
        assertEq(wallet.getERC20Balance(address(token)), 500 * 10**18);
    }

    function testGrantRevokeAgent() public {
        vm.prank(owner);
        wallet.grantAgent(agent);
        assertTrue(wallet.isAgent(agent));

        vm.prank(owner);
        wallet.revokeAgent(agent);
        assertFalse(wallet.isAgent(agent));
    }

    function testAgentSendETH() public {
        vm.deal(address(wallet), 1 ether);
        vm.prank(owner);
        wallet.grantAgent(agent);

        vm.prank(agent);
        wallet.agentSendETH(user, 1 ether);

        uint256 fee = (1 ether * 50) / 10000; // 0.5%
        uint256 net = 1 ether - fee;

        assertEq(wallet.getBalance(), 0);
        assertEq(treasury.balance, fee);
        assertEq(user.balance, net);
    }

    function testAgentSendETHUnauthorized() public {
        vm.deal(address(wallet), 1 ether);
        vm.prank(user);
        vm.expectRevert("Not authorized");
        wallet.agentSendETH(user, 1 ether);
    }

    function testTransferERC20() public {
        token.transfer(address(wallet), 1000 * 10**18);
        vm.prank(owner);
        wallet.grantAgent(agent);

        vm.prank(agent);
        wallet.transferERC20(address(token), user, 1000 * 10**18);

        uint256 fee = (1000 * 10**18 * 50) / 10000;
        uint256 net = 1000 * 10**18 - fee;

        assertEq(wallet.getERC20Balance(address(token)), 0);
        assertEq(token.balanceOf(treasury), fee);
        assertEq(token.balanceOf(user), net);
    }

    // Note: Swap test would require mocking Uniswap, which is complex. For now, skip or add basic check.
    function testEmergencyWithdraw() public {
        vm.deal(address(wallet), 1 ether);
        vm.prank(owner);
        wallet.emergencyWithdrawETH();
        assertEq(wallet.getBalance(), 0);
        assertEq(owner.balance, 1 ether);
    }
}