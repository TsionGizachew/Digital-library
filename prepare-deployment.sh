#!/bin/bash

echo "🚀 Yeka Library - Deployment Preparation Script"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"

# Check if MongoDB URI is set
if grep -q "MONGODB_URI=mongodb+srv://" .env; then
    echo -e "${GREEN}✅ MongoDB Atlas URI configured${NC}"
else
    echo -e "${RED}❌ MongoDB URI not configured${NC}"
fi

# Check if Cloudinary is configured
if grep -q "CLOUDINARY_CLOUD_NAME=" .env; then
    echo -e "${GREEN}✅ Cloudinary configured${NC}"
else
    echo -e "${YELLOW}⚠️  Cloudinary not configured${NC}"
fi

echo ""
echo "📦 Installing backend dependencies..."
npm install

echo ""
echo "🔨 Building backend..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo ""
echo "🔨 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

cd ..

echo ""
echo "================================================"
echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Push code to GitHub"
echo "2. Deploy backend to Railway/Render"
echo "3. Update frontend/.env with backend URL"
echo "4. Rebuild frontend: cd frontend && npm run build"
echo "5. Upload frontend/build/* to ET hosting public_html/"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
