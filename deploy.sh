#!/bin/bash

# Starknet Goerli testnet deployment script

echo "Building contract..."
scarb build

echo "Declaring contract..."
# You'll need to have starkli installed and configured with your account
# starkli declare target/dev/focus_tree_HabitTracker.contract_class.json --account ~/.starkli-wallets/deployer/account.json --keystore ~/.starkli-wallets/deployer/keystore.json

echo "Deploying contract..."
# starkli deploy <CLASS_HASH> --account ~/.starkli-wallets/deployer/account.json --keystore ~/.starkli-wallets/deployer/keystore.json

echo "Contract deployed!"