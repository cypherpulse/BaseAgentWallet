# BaseAgentWallet

The first AI Agent-controlled wallet on Base (chainId 8453). A simple smart wallet that allows users to deposit funds and grant permissions to AI agents to trade, swap, and send on their behalf, with a 0.5% protocol fee on all agent actions.

## Features

- **Deposit Funds**: Users can deposit ETH and ERC20 tokens
- **Agent Permissions**: Owners can grant/revoke agent permissions
- **Agent Actions**:
  - Send ETH with 0.5% fee
  - Swap ETH for tokens via Uniswap V3 with 0.5% fee
  - Transfer ERC20 tokens with 0.5% fee
- **Security**: ReentrancyGuard, SafeERC20, deadline checks
- **Admin Functions**: Emergency withdraw for ETH and tokens

## How Agents Use It

1. **Grant Permission**: Owner calls `grantAgent(agentAddress)` to authorize an AI agent
2. **Deposit Funds**: User deposits ETH or ERC20 tokens to the wallet
3. **Agent Actions**:
   - `agentSendETH(to, amount)`: Send ETH to recipient, 0.5% fee to treasury
   - `agentSwapETHForTokens(amountOutMin, tokenOut, fee, to, deadline)`: Swap ETH for tokens via Uniswap V3, 0.5% fee
   - `agentTransferERC20(token, to, amount)`: Transfer ERC20 tokens, 0.5% fee in the same token
4. **Revoke Permission**: Owner can revoke agent access anytime with `revokeAgent(agentAddress)`

## Leaderboard Strategy

With AI agents trading 100x/day, this generates:
- 1000s of transactions daily
- 0.5% fees on all agent-initiated value transfers
- Massive volume driving Base ecosystem growth
- Top 10 contender in 2026 DeFi leaderboards

## Deployment

### Base Sepolia Testnet
```bash
forge script script/DeployAgentWallet.s.sol --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY --broadcast
```

### Base Mainnet
```bash
forge script script/DeployAgentWallet.s.sol --rpc-url https://mainnet.base.org --private-key $PRIVATE_KEY --broadcast --verify
```

## Testing

```bash
forge test
```

## Security Considerations

- Only authorized agents can perform actions
- 0.5% protocol fee on all value transfers
- Reentrancy protection
- SafeERC20 for token transfers
- Deadline checks for swaps
- Emergency withdraw functions for admin

## Addresses

- **Base Mainnet Uniswap V3 Router**: 0x2626664c2603336E57B271c5C0b26F421741e4815
- **WETH on Base**: 0x4200000000000000000000000000000000000006

## License

MIT