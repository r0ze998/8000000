#!/bin/bash

# Script to remove old deployment scripts after migrating to unified deployment

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Cleanup Old Deployment Scripts ===${NC}"
echo ""
echo "This script will remove the following deprecated deployment scripts:"
echo ""

# List of scripts to remove
OLD_SCRIPTS=(
    "deploy-testnet.sh"
    "deploy-with-argentx.sh"
    "deploy-contracts.sh"
    "deploy-direct.sh"
    "deploy-setup.sh"
    "deploy-simple.sh"
    "deploy-with-keystore.sh"
    "deploy-with-pk.sh"
    "deploy.sh"
    "frontend/testflight-deploy.sh"
)

# Show files that will be removed
for script in "${OLD_SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        echo "  - $script"
    fi
done

echo ""
echo -e "${YELLOW}The new unified deployment script (deploy-unified.sh) replaces all of these.${NC}"
echo ""
read -p "Are you sure you want to remove these scripts? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Create backup directory
    BACKUP_DIR="old-deploy-scripts-backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    echo -e "${GREEN}Creating backup in $BACKUP_DIR${NC}"
    
    # Backup and remove each script
    for script in "${OLD_SCRIPTS[@]}"; do
        if [ -f "$script" ]; then
            cp "$script" "$BACKUP_DIR/"
            rm "$script"
            echo -e "${GREEN}✓ Removed: $script${NC}"
        fi
    done
    
    echo ""
    echo -e "${GREEN}Cleanup completed!${NC}"
    echo -e "${YELLOW}Backup created in: $BACKUP_DIR${NC}"
    echo ""
    echo "You can now use the unified deployment script:"
    echo "  ./deploy-unified.sh --help"
else
    echo -e "${YELLOW}Cleanup cancelled. No files were removed.${NC}"
fi