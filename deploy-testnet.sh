#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Starknet Sepolia Testnet Deployment ===${NC}"

# Check if starkli is installed
if ! command -v starkli &> /dev/null; then
    echo -e "${RED}Error: starkli is not installed. Please run: curl https://get.starkli.sh | sh${NC}"
    exit 1
fi

# Check if scarb is installed
if ! command -v scarb &> /dev/null; then
    echo -e "${RED}Error: scarb is not installed. Please install it first.${NC}"
    exit 1
fi

# Set RPC endpoint
export STARKNET_RPC="https://starknet-sepolia.public.blastapi.io/rpc/v0_7"

# Check for account files
ACCOUNT_FILE="$HOME/.starkli-wallets/deployer/account.json"
KEYSTORE_FILE="$HOME/.starkli-wallets/deployer/keystore.json"

if [ ! -f "$ACCOUNT_FILE" ]; then
    echo -e "${YELLOW}Account file not found at $ACCOUNT_FILE${NC}"
    echo "Please set up your account first:"
    echo "1. Export your wallet address from ArgentX/Braavos"
    echo "2. Run: starkli account fetch YOUR_WALLET_ADDRESS --output $ACCOUNT_FILE --rpc $STARKNET_RPC"
    exit 1
fi

if [ ! -f "$KEYSTORE_FILE" ]; then
    echo -e "${YELLOW}Keystore file not found at $KEYSTORE_FILE${NC}"
    echo "Please create your keystore:"
    echo "1. Export your private key from ArgentX/Braavos"
    echo "2. Run: starkli signer keystore from-key $KEYSTORE_FILE"
    exit 1
fi

# Build the contract
echo -e "${GREEN}Building contract...${NC}"
scarb build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

# Get the contract class file
CONTRACT_CLASS="target/dev/focus_tree_HabitTracker.contract_class.json"

if [ ! -f "$CONTRACT_CLASS" ]; then
    echo -e "${RED}Contract class file not found: $CONTRACT_CLASS${NC}"
    exit 1
fi

# Declare the contract
echo -e "${GREEN}Declaring contract class...${NC}"
echo "This may take a few minutes..."

DECLARE_OUTPUT=$(starkli declare "$CONTRACT_CLASS" \
    --account "$ACCOUNT_FILE" \
    --keystore "$KEYSTORE_FILE" \
    --rpc "$STARKNET_RPC" 2>&1)

if echo "$DECLARE_OUTPUT" | grep -q "already been declared"; then
    echo -e "${YELLOW}Contract class already declared. Extracting class hash...${NC}"
    CLASS_HASH=$(echo "$DECLARE_OUTPUT" | grep -oE "0x[a-fA-F0-9]{64}")
elif echo "$DECLARE_OUTPUT" | grep -q "Class hash declared"; then
    echo -e "${GREEN}Contract class declared successfully!${NC}"
    CLASS_HASH=$(echo "$DECLARE_OUTPUT" | grep -oE "0x[a-fA-F0-9]{64}" | head -1)
else
    echo -e "${RED}Failed to declare contract:${NC}"
    echo "$DECLARE_OUTPUT"
    exit 1
fi

echo -e "${GREEN}Class hash: $CLASS_HASH${NC}"

# Generate a random salt
SALT="0x$(openssl rand -hex 32)"

# Deploy the contract
echo -e "${GREEN}Deploying contract...${NC}"
echo "Using salt: $SALT"

DEPLOY_OUTPUT=$(starkli deploy "$CLASS_HASH" \
    --salt "$SALT" \
    --account "$ACCOUNT_FILE" \
    --keystore "$KEYSTORE_FILE" \
    --rpc "$STARKNET_RPC" 2>&1)

if echo "$DEPLOY_OUTPUT" | grep -q "Transaction accepted"; then
    echo -e "${GREEN}Contract deployed successfully!${NC}"
    CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oE "0x[a-fA-F0-9]{64}" | tail -1)
    echo -e "${GREEN}Contract address: $CONTRACT_ADDRESS${NC}"
    
    # Update frontend config
    echo -e "${GREEN}Updating frontend configuration...${NC}"
    sed -i.bak "s/YOUR_CONTRACT_ADDRESS_HERE/$CONTRACT_ADDRESS/g" frontend/src/App.js
    
    echo -e "${GREEN}=== Deployment Complete ===${NC}"
    echo "Contract Address: $CONTRACT_ADDRESS"
    echo "Class Hash: $CLASS_HASH"
    echo ""
    echo "Next steps:"
    echo "1. The frontend has been automatically updated with the contract address"
    echo "2. Run 'cd frontend && npm start' to test your dApp"
    echo "3. View your contract on StarkScan: https://sepolia.starkscan.co/contract/$CONTRACT_ADDRESS"
else
    echo -e "${RED}Failed to deploy contract:${NC}"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi