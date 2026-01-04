#!/bin/bash

# BaseAgentWallet Deployment Script
# Deploys BaseAgentWallet to Base Sepolia testnet

set -e

echo "🚀 Deploying BaseAgentWallet to Base Sepolia..."

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "❌ .env file not found. Please create one with your keys."
    exit 1
fi

# Check required environment variables
if [ -z "$BASE_SEPOLIA_RPC_URL" ]; then
    echo "❌ BASE_SEPOLIA_RPC_URL not set in .env"
    exit 1
fi

if [ -z "$BASESCAN_API_KEY" ]; then
    echo "❌ BASESCAN_API_KEY not set in .env"
    exit 1
fi

# Build contracts
echo "🔨 Building contracts..."
forge build

# Run tests
echo "🧪 Running tests..."
forge test

# Deploy to Base Sepolia
echo "📡 Deploying to Base Sepolia..."
forge script script/DeployAgentWallet.s.sol \
  --rpc-url "$BASE_SEPOLIA_RPC_URL" \
  --account defaultKey \
  --broadcast \
  --verify \
  --etherscan-api-key "$BASESCAN_API_KEY"

echo "✅ Deployment complete!"
echo "📋 Check the output above for the deployed contract address."