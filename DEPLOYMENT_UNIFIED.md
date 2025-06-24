# Unified Deployment Guide

This project now uses a single unified deployment script (`deploy-unified.sh`) that consolidates all deployment workflows.

## Overview

The unified deployment script supports:
- **Smart Contract Deployment** (Starknet)
- **Web Frontend Deployment** (Vercel/Netlify)
- **iOS App Deployment** (TestFlight preparation)

## Usage

```bash
./deploy-unified.sh [target] [environment] [options]
```

### Targets

- `contract` - Deploy smart contracts to Starknet
- `web` - Deploy frontend to Vercel or Netlify
- `ios` - Build and prepare for TestFlight
- `all` - Deploy everything

### Environments

- `dev` - Development environment
- `staging` - Staging environment
- `production` - Production environment

### Options

- `--platform [vercel|netlify]` - Web deployment platform (default: vercel)
- `--network [sepolia|mainnet]` - Blockchain network (default: sepolia)
- `--skip-build` - Skip build step
- `--verbose` - Verbose output
- `--help` - Show help message

## Examples

### Deploy Contracts

```bash
# Deploy to Sepolia testnet (development)
./deploy-unified.sh contract dev

# Deploy to mainnet (production)
./deploy-unified.sh contract production --network mainnet
```

### Deploy Web Frontend

```bash
# Deploy to Vercel (production)
./deploy-unified.sh web production

# Deploy to Netlify (staging)
./deploy-unified.sh web staging --platform netlify

# Skip build if already built
./deploy-unified.sh web production --skip-build
```

### Build for iOS/TestFlight

```bash
# Prepare iOS build for staging
./deploy-unified.sh ios staging

# Prepare iOS build for production
./deploy-unified.sh ios production
```

### Deploy Everything

```bash
# Deploy all components to production
./deploy-unified.sh all production
```

## Prerequisites

### For Contract Deployment
- `starkli` - Starknet CLI tool
- `scarb` - Cairo package manager
- Configured Starknet account in `~/.starkli-wallets/deployer/`
- Either keystore file or `STARKNET_PRIVATE_KEY` environment variable

### For Web Deployment
- Node.js 18+
- npm or yarn
- Vercel CLI (installed automatically if needed)
- Netlify CLI (installed automatically if needed)

### For iOS Deployment
- macOS with Xcode installed
- Apple Developer account
- Capacitor configured in the project

## Environment Variables

The script automatically sets appropriate environment variables based on the deployment environment:

| Variable | Development | Staging | Production |
|----------|------------|---------|------------|
| NODE_ENV | development | production | production |
| REACT_APP_ENV | development | staging | production |
| STARKNET_NETWORK | sepolia | sepolia | mainnet |

## Migration from Old Scripts

The following scripts have been consolidated into `deploy-unified.sh`:

| Old Script | New Command |
|------------|-------------|
| `deploy-testnet.sh` | `./deploy-unified.sh contract dev` |
| `deploy-with-argentx.sh` | `./deploy-unified.sh contract dev` |
| `deploy-contracts.sh` | `./deploy-unified.sh contract production` |
| `deploy-simple.sh` | `./deploy-unified.sh contract dev` |
| `deploy-with-keystore.sh` | `./deploy-unified.sh contract dev` |
| `deploy-with-pk.sh` | `./deploy-unified.sh contract dev` |
| `frontend/testflight-deploy.sh` | `./deploy-unified.sh ios production` |

## Removing Old Scripts

To clean up the old deployment scripts, run:

```bash
# Remove old contract deployment scripts
rm deploy-testnet.sh deploy-with-argentx.sh deploy-contracts.sh deploy-direct.sh deploy-setup.sh deploy-simple.sh deploy-with-keystore.sh deploy-with-pk.sh deploy.sh

# Remove old iOS deployment script
rm frontend/testflight-deploy.sh
```

## Troubleshooting

### Contract Deployment Issues
- Ensure your Starknet account is properly configured
- Check that you have sufficient ETH in your account for gas fees
- Verify the RPC endpoint is accessible

### Web Deployment Issues
- Make sure you're logged into Vercel/Netlify CLI
- Check that the build completes successfully
- Verify environment variables are set correctly

### iOS Build Issues
- Ensure Xcode is installed and up to date
- Check that Capacitor is properly configured
- Verify iOS certificates and provisioning profiles

## Support

For issues or questions:
1. Run with `--verbose` flag for detailed output
2. Check the deployment logs
3. Verify all prerequisites are installed