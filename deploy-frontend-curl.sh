#!/bin/bash
set -e

# Configuration
BUCKET_URL="https://eu2.contabostorage.com/a253a9e59f414e2597c72a983cf85c9b:staticfiles"
FRONTEND_DIR="./frontend"
DIST_DIR="$FRONTEND_DIR/dist"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=== Frontend Deployment to Contabo Object Storage (via Web UI) ==="
echo ""

# Step 1: Build frontend
echo -e "${YELLOW}Step 1: Building frontend...${NC}"
cd $FRONTEND_DIR
npm run build
cd ..
echo -e "${GREEN}✓ Frontend build completed!${NC}"
echo ""

echo -e "${YELLOW}Step 2: Upload instructions${NC}"
echo ""
echo "Your built files are ready in: $DIST_DIR"
echo ""
echo "To upload to Contabo:"
echo "1. Go to your Contabo Object Storage panel"
echo "2. Open the 'staticfiles' bucket"
echo "3. Upload ALL files from: $DIST_DIR"
echo "   - index.html (to root)"
echo "   - assets/ folder (entire folder)"
echo ""
echo "Bucket URL: $BUCKET_URL"
echo ""
echo -e "${GREEN}Build completed! Ready for manual upload.${NC}"
