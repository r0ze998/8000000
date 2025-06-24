#!/bin/bash

# Cultural Shrine Unified Deployment Script
# Supports multiple targets: contracts, web (Vercel/Netlify), iOS (TestFlight)
# Usage: ./deploy-unified.sh [target] [environment] [options]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Function to display usage
show_usage() {
    echo -e "${GREEN}Cultural Shrine Unified Deployment Script${NC}"
    echo ""
    echo "Usage: $0 [target] [environment] [options]"
    echo ""
    echo "Targets:"
    echo "  contract    - Deploy smart contracts to Starknet"
    echo "  web         - Deploy frontend to Vercel or Netlify"
    echo "  ios         - Build and prepare for TestFlight"
    echo "  all         - Deploy everything"
    echo ""
    echo "Environments:"
    echo "  dev         - Development environment"
    echo "  staging     - Staging environment"
    echo "  production  - Production environment"
    echo ""
    echo "Options:"
    echo "  --platform [vercel|netlify]  - Web deployment platform (default: vercel)"
    echo "  --network [sepolia|mainnet]   - Blockchain network (default: sepolia)"
    echo "  --skip-build                  - Skip build step"
    echo "  --verbose                     - Verbose output"
    echo "  --help                        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 contract dev"
    echo "  $0 web production --platform netlify"
    echo "  $0 ios staging"
    echo "  $0 all production"
}

# Parse command line arguments
TARGET=${1:-""}
ENVIRONMENT=${2:-"dev"}
PLATFORM="vercel"
NETWORK="sepolia"
SKIP_BUILD=false
VERBOSE=false

# Process additional options
shift 2
while [[ $# -gt 0 ]]; do
    case $1 in
        --platform)
            PLATFORM="$2"
            shift 2
            ;;
        --network)
            NETWORK="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_usage
            exit 1
            ;;
    esac
done

# Validate inputs
if [ -z "$TARGET" ]; then
    echo -e "${RED}Error: No target specified${NC}"
    show_usage
    exit 1
fi

if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|production)$ ]]; then
    echo -e "${RED}Error: Invalid environment: $ENVIRONMENT${NC}"
    show_usage
    exit 1
fi

# Environment-specific configurations
set_environment_config() {
    case $ENVIRONMENT in
        dev)
            export NODE_ENV="development"
            export REACT_APP_ENV="development"
            export STARKNET_NETWORK="sepolia"
            export VERCEL_ENV="preview"
            ;;
        staging)
            export NODE_ENV="production"
            export REACT_APP_ENV="staging"
            export STARKNET_NETWORK="sepolia"
            export VERCEL_ENV="preview"
            ;;
        production)
            export NODE_ENV="production"
            export REACT_APP_ENV="production"
            export STARKNET_NETWORK="mainnet"
            export VERCEL_ENV="production"
            ;;
    esac
    
    if [ "$VERBOSE" = true ]; then
        echo -e "${BLUE}Environment Configuration:${NC}"
        echo "  NODE_ENV: $NODE_ENV"
        echo "  REACT_APP_ENV: $REACT_APP_ENV"
        echo "  STARKNET_NETWORK: $STARKNET_NETWORK"
    fi
}

# Contract deployment function
deploy_contracts() {
    echo -e "${GREEN}=== Deploying Smart Contracts ===${NC}"
    echo "Network: $NETWORK"
    echo "Environment: $ENVIRONMENT"
    
    # Check dependencies
    if ! command -v starkli &> /dev/null; then
        echo -e "${RED}Error: starkli is not installed${NC}"
        echo "Run: curl https://get.starkli.sh | sh"
        exit 1
    fi
    
    if ! command -v scarb &> /dev/null; then
        echo -e "${RED}Error: scarb is not installed${NC}"
        exit 1
    fi
    
    # Set RPC endpoint based on network
    case $NETWORK in
        sepolia)
            export STARKNET_RPC="https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
            ;;
        mainnet)
            export STARKNET_RPC="https://starknet-mainnet.public.blastapi.io/rpc/v0_7"
            ;;
        *)
            echo -e "${RED}Error: Invalid network: $NETWORK${NC}"
            exit 1
            ;;
    esac
    
    # Check for account configuration
    ACCOUNT_FILE="$HOME/.starkli-wallets/deployer/account.json"
    KEYSTORE_FILE="$HOME/.starkli-wallets/deployer/keystore.json"
    
    if [ ! -f "$ACCOUNT_FILE" ]; then
        echo -e "${YELLOW}Account file not found at $ACCOUNT_FILE${NC}"
        echo "Please set up your account first"
        exit 1
    fi
    
    # Build contracts
    if [ "$SKIP_BUILD" = false ]; then
        echo -e "${GREEN}Building contracts...${NC}"
        scarb build
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}Build failed!${NC}"
            exit 1
        fi
    fi
    
    # Deploy SimpleShrine contract
    CONTRACT_CLASS="target/dev/cultural_shrine_contracts_SimpleShrine.contract_class.json"
    
    if [ ! -f "$CONTRACT_CLASS" ]; then
        echo -e "${RED}Contract class file not found: $CONTRACT_CLASS${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Declaring contract class...${NC}"
    
    # Use keystore or private key based on what's available
    if [ -f "$KEYSTORE_FILE" ]; then
        DECLARE_OUTPUT=$(starkli declare "$CONTRACT_CLASS" \
            --account "$ACCOUNT_FILE" \
            --keystore "$KEYSTORE_FILE" \
            --rpc "$STARKNET_RPC" 2>&1)
    elif [ -n "$STARKNET_PRIVATE_KEY" ]; then
        DECLARE_OUTPUT=$(starkli declare "$CONTRACT_CLASS" \
            --account "$ACCOUNT_FILE" \
            --rpc "$STARKNET_RPC" 2>&1)
    else
        echo -e "${RED}Error: No keystore or private key found${NC}"
        exit 1
    fi
    
    # Extract class hash
    if echo "$DECLARE_OUTPUT" | grep -q "already been declared"; then
        CLASS_HASH=$(echo "$DECLARE_OUTPUT" | grep -oE "0x[a-fA-F0-9]{64}")
        echo -e "${YELLOW}Contract already declared: $CLASS_HASH${NC}"
    else
        CLASS_HASH=$(echo "$DECLARE_OUTPUT" | grep -oE "0x[a-fA-F0-9]{64}" | head -1)
        echo -e "${GREEN}Contract declared: $CLASS_HASH${NC}"
    fi
    
    # Generate deployment config
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    DEPLOY_CONFIG="deployed_contracts_${ENVIRONMENT}.json"
    
    cat > "$DEPLOY_CONFIG" << EOF
{
  "network": "$NETWORK",
  "environment": "$ENVIRONMENT",
  "deployed_at": "$TIMESTAMP",
  "contracts": {
    "simple_shrine": {
      "class_hash": "$CLASS_HASH"
    }
  }
}
EOF
    
    echo -e "${GREEN}Contract deployment configuration saved to $DEPLOY_CONFIG${NC}"
    echo -e "${YELLOW}To deploy the contract, run:${NC}"
    echo "starkli deploy $CLASS_HASH <ADMIN_ADDRESS> --account $ACCOUNT_FILE --keystore $KEYSTORE_FILE --rpc $STARKNET_RPC"
}

# Web deployment function
deploy_web() {
    echo -e "${GREEN}=== Deploying Web Frontend ===${NC}"
    echo "Platform: $PLATFORM"
    echo "Environment: $ENVIRONMENT"
    
    # Check if we're in the right directory
    if [ -d "frontend" ]; then
        cd frontend
    elif [ ! -f "package.json" ]; then
        echo -e "${RED}Error: Not in a valid frontend directory${NC}"
        exit 1
    fi
    
    # Install dependencies
    if [ "$SKIP_BUILD" = false ]; then
        echo -e "${GREEN}Installing dependencies...${NC}"
        npm install
        
        # Build the application
        echo -e "${GREEN}Building application...${NC}"
        if [ "$ENVIRONMENT" = "production" ]; then
            export GENERATE_SOURCEMAP=false
            npm run build:production || npm run build
        else
            npm run build
        fi
        
        if [ ! -d "build" ] && [ ! -d ".next" ]; then
            echo -e "${RED}Build failed!${NC}"
            exit 1
        fi
    fi
    
    # Deploy based on platform
    case $PLATFORM in
        vercel)
            deploy_to_vercel
            ;;
        netlify)
            deploy_to_netlify
            ;;
        *)
            echo -e "${RED}Error: Invalid platform: $PLATFORM${NC}"
            exit 1
            ;;
    esac
}

# Vercel deployment
deploy_to_vercel() {
    echo -e "${GREEN}Deploying to Vercel...${NC}"
    
    # Check if vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}Installing Vercel CLI...${NC}"
        npm i -g vercel
    fi
    
    # Deploy based on environment
    case $ENVIRONMENT in
        production)
            vercel --prod
            ;;
        *)
            vercel
            ;;
    esac
}

# Netlify deployment
deploy_to_netlify() {
    echo -e "${GREEN}Deploying to Netlify...${NC}"
    
    # Check if netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        echo -e "${YELLOW}Installing Netlify CLI...${NC}"
        npm i -g netlify-cli
    fi
    
    # Deploy based on environment
    case $ENVIRONMENT in
        production)
            netlify deploy --prod
            ;;
        *)
            netlify deploy
            ;;
    esac
}

# iOS deployment function
deploy_ios() {
    echo -e "${GREEN}=== Building for iOS/TestFlight ===${NC}"
    echo "Environment: $ENVIRONMENT"
    
    # Check if we're in the frontend directory
    if [ -d "frontend" ]; then
        cd frontend
    elif [ ! -f "package.json" ] || [ ! -f "capacitor.config.ts" ]; then
        echo -e "${RED}Error: Not in a valid frontend directory with Capacitor${NC}"
        exit 1
    fi
    
    # Check dependencies
    if ! command -v npx &> /dev/null; then
        echo -e "${RED}Error: npx is not available${NC}"
        exit 1
    fi
    
    # Build the application
    if [ "$SKIP_BUILD" = false ]; then
        echo -e "${GREEN}Building application...${NC}"
        export GENERATE_SOURCEMAP=false
        npm run build:production || npm run build
        
        if [ ! -d "build" ]; then
            echo -e "${RED}Build failed!${NC}"
            exit 1
        fi
    fi
    
    # Sync with iOS
    echo -e "${GREEN}Syncing with iOS project...${NC}"
    npx cap sync ios
    
    # Update Info.plist
    INFO_PLIST="ios/App/App/Info.plist"
    if [ -f "$INFO_PLIST" ]; then
        echo -e "${GREEN}Updating iOS permissions...${NC}"
        
        # Add camera permission
        /usr/libexec/PlistBuddy -c "Add :NSCameraUsageDescription string 'For shrine visit photo verification'" "$INFO_PLIST" 2>/dev/null || true
        
        # Add location permission
        /usr/libexec/PlistBuddy -c "Add :NSLocationWhenInUseUsageDescription string 'For shrine visit GPS verification'" "$INFO_PLIST" 2>/dev/null || true
    fi
    
    # Open Xcode
    echo -e "${GREEN}Opening Xcode...${NC}"
    npx cap open ios
    
    echo -e "${GREEN}iOS build prepared!${NC}"
    echo ""
    echo "Next steps in Xcode:"
    echo "1. Select your development team"
    echo "2. Update bundle identifier if needed"
    echo "3. Product → Archive"
    echo "4. Distribute App → App Store Connect"
}

# Deploy all targets
deploy_all() {
    echo -e "${GREEN}=== Deploying All Targets ===${NC}"
    
    # Deploy contracts first
    deploy_contracts
    
    # Deploy web frontend
    cd "$PROJECT_ROOT"
    deploy_web
    
    # Prepare iOS build
    cd "$PROJECT_ROOT"
    deploy_ios
}

# Main execution
set_environment_config

case $TARGET in
    contract)
        deploy_contracts
        ;;
    web)
        deploy_web
        ;;
    ios)
        deploy_ios
        ;;
    all)
        deploy_all
        ;;
    *)
        echo -e "${RED}Error: Invalid target: $TARGET${NC}"
        show_usage
        exit 1
        ;;
esac

echo -e "${GREEN}Deployment completed successfully!${NC}"