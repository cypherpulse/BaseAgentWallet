// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256) external;
}

contract BaseAgentWallet is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public immutable treasury;
    uint256 public constant PROTOCOL_FEE_BPS = 50; // 0.5%

    mapping(address => bool) public isAgent;
    mapping(address => bool) public isPaused; // Not used in this version, but reserved

    address public immutable SWAP_ROUTER_ADDRESS;
    address public constant WETH = 0x4200000000000000000000000000000000000006; // WETH on Base

    event AgentGranted(address indexed agent);
    event AgentRevoked(address indexed agent);
    event AgentAction(address indexed agent, string action, uint256 amount, uint256 fee);
    event Deposited(address indexed user, address token, uint256 amount);
    event EmergencyWithdraw(address token, uint256 amount);

    modifier onlyOwnerOrAgent() {
        require(msg.sender == owner() || isAgent[msg.sender], "Not authorized");
        _;
    }

    constructor(address _treasury) Ownable(msg.sender) {
        treasury = _treasury;
        // SWAP_ROUTER_ADDRESS = address(bytes20(0x2626664c2603336E57B271c5C0b26F421741e4815));
    }

    receive() external payable {}

    function depositERC20(address token, uint256 amount) external {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, token, amount);
    }

    function grantAgent(address agent) external onlyOwner {
        isAgent[agent] = true;
        emit AgentGranted(agent);
    }

    function revokeAgent(address agent) external onlyOwner {
        isAgent[agent] = false;
        emit AgentRevoked(agent);
    }

    function agentSendETH(address to, uint256 amount) external onlyOwnerOrAgent nonReentrant {
        require(address(this).balance >= amount, "Insufficient balance");
        uint256 fee = (amount * PROTOCOL_FEE_BPS) / 10000;
        uint256 net = amount - fee;

        (bool success1,) = treasury.call{value: fee}("");
        require(success1, "Fee transfer failed");

        (bool success2,) = to.call{value: net}("");
        require(success2, "ETH transfer failed");

        emit AgentAction(msg.sender, "sendETH", amount, fee);
    }

    function agentSwapETHForTokens(
        uint256 amountOutMin,
        address tokenOut,
        uint24 fee, // Uniswap fee tier, e.g., 3000 for 0.3%
        uint256 deadline
    ) external payable onlyOwnerOrAgent nonReentrant {
        // TODO: Implement Uniswap V3 swap
        revert("Swap not implemented yet");
    }

    function transferERC20(address token, address to, uint256 amount) external onlyOwnerOrAgent nonReentrant {
        require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient token balance");
        uint256 fee = (amount * PROTOCOL_FEE_BPS) / 10000;
        uint256 net = amount - fee;

        // Transfer fee to treasury
        IERC20(token).safeTransfer(treasury, fee);

        // Transfer net to recipient
        IERC20(token).safeTransfer(to, net);

        emit AgentAction(msg.sender, "transferERC20", amount, fee);
    }

    // View functions
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getERC20Balance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    // Admin functions
    function emergencyWithdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = owner().call{value: balance}("");
        require(success, "Emergency withdraw failed");
        emit EmergencyWithdraw(address(0), balance);
    }

    function emergencyWithdrawToken(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransfer(owner(), balance);
        emit EmergencyWithdraw(token, balance);
    }
}