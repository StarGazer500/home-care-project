#!/bin/bash
set -e

# Configuration
BUCKET_NAME="staticfiles"
S3_ENDPOINT="eu2.contabostorage.com"
FRONTEND_DIR="./frontend"
DIST_DIR="$FRONTEND_DIR/dist"
S3CFG_FILE="./.s3cfg"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=== Frontend Deployment to Contabo Object Storage ==="
echo ""

# Check if s3cmd is installed
if ! command -v s3cmd &> /dev/null; then
    echo -e "${RED}Error: s3cmd is not installed${NC}"
    echo "Please install it with: sudo apt-get install s3cmd"
    exit 1
fi

# Check if s3cmd is configured
if [ ! -f "$S3CFG_FILE" ]; then
    echo -e "${RED}Error: s3cmd is not configured${NC}"
    echo "Please rename .s3cfg.template to .s3cfg and add your Contabo credentials"
    exit 1
fi

# Step 1: Build frontend
echo -e "${YELLOW}Step 1: Building frontend...${NC}"
cd $FRONTEND_DIR
npm run build
cd ..
echo -e "${GREEN}✓ Frontend build completed!${NC}"
echo ""

# Step 2: Upload to S3
echo -e "${YELLOW}Step 2: Uploading to Contabo Object Storage...${NC}"

# Upload HTML files
echo "Uploading HTML files..."
s3cmd -c "$S3CFG_FILE" put \
  --acl-public \
  --mime-type="text/html" \
  --add-header="Cache-Control:public, max-age=3600" \
  $DIST_DIR/*.html \
  s3://$BUCKET_NAME/

# Upload JavaScript files
echo "Uploading JavaScript files..."
s3cmd -c "$S3CFG_FILE" sync \
  --acl-public \
  --delete-removed \
  --mime-type="application/javascript" \
  --add-header="Cache-Control:public, max-age=31536000" \
  --include="*.js" \
  --exclude="*" \
  $DIST_DIR/assets/ \
  s3://$BUCKET_NAME/assets/

# Upload CSS files
echo "Uploading CSS files..."
s3cmd -c "$S3CFG_FILE" sync \
  --acl-public \
  --delete-removed \
  --mime-type="text/css" \
  --add-header="Cache-Control:public, max-age=31536000" \
  --include="*.css" \
  --exclude="*" \
  $DIST_DIR/assets/ \
  s3://$BUCKET_NAME/assets/

# Upload other asset files (images, fonts, etc.)
echo "Uploading other assets..."
s3cmd -c "$S3CFG_FILE" sync \
  --acl-public \
  --delete-removed \
  --add-header="Cache-Control:public, max-age=31536000" \
  --exclude="*.js" \
  --exclude="*.css" \
  $DIST_DIR/assets/ \
  s3://$BUCKET_NAME/assets/

echo ""
echo -e "${GREEN}✓ Upload completed successfully!${NC}"
echo ""
echo "Frontend is now available at:"
echo "https://$BUCKET_NAME.$S3_ENDPOINT/index.html"
echo ""
echo "Your site will be accessible via nginx at: http://37.60.240.194"
