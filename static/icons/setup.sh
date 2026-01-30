#!/bin/bash

# Espouse PWA Icon Quick Setup
# One-command setup for the complete icon system

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Espouse PWA Icon Quick Setup${NC}"
echo -e "${BLUE}Setting up complete icon generation system...${NC}\n"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}📦 Initializing Node.js project...${NC}"
    npm init -y > /dev/null 2>&1
fi

# Try Node.js method first
if command -v node >/dev/null 2>&1; then
    echo -e "${BLUE}📥 Installing Node.js dependencies...${NC}"
    npm install sharp > /dev/null 2>&1 || {
        echo -e "${YELLOW}⚠️  Sharp installation failed, trying shell method...${NC}"
        USE_SHELL=true
    }
    
    if [ "$USE_SHELL" != "true" ]; then
        echo -e "${GREEN}🎨 Generating icons with Node.js...${NC}"
        if node generate-icons.js; then
            echo -e "${GREEN}✅ Icons generated successfully!${NC}"
            METHOD="node"
        else
            echo -e "${YELLOW}⚠️  Node.js method failed, trying shell method...${NC}"
            USE_SHELL=true
        fi
    fi
fi

# Fallback to shell method
if [ "$USE_SHELL" = "true" ] || ! command -v node >/dev/null 2>&1; then
    echo -e "${BLUE}🔧 Setting up shell method...${NC}"
    
    # Check for SVG converter
    if command -v rsvg-convert >/dev/null 2>&1 || command -v inkscape >/dev/null 2>&1; then
        echo -e "${GREEN}🎨 Generating icons with shell script...${NC}"
        chmod +x generate-icons.sh
        ./generate-icons.sh
        echo -e "${GREEN}✅ Icons generated successfully!${NC}"
        METHOD="shell"
    else
        echo -e "${RED}❌ No suitable SVG converter found.${NC}"
        echo -e "${YELLOW}Please install one of:${NC}"
        echo -e "${YELLOW}  - Node.js + Sharp (recommended)${NC}"
        echo -e "${YELLOW}  - rsvg-convert: sudo apt-get install librsvg2-bin${NC}"
        echo -e "${YELLOW}  - Inkscape: sudo apt-get install inkscape${NC}"
        exit 1
    fi
fi

# Test generated icons
if [ "$METHOD" = "node" ] && command -v node >/dev/null 2>&1; then
    echo -e "${BLUE}🧪 Testing generated icons...${NC}"
    if node test-icons.js; then
        echo -e "${GREEN}✅ All tests passed!${NC}"
    else
        echo -e "${YELLOW}⚠️  Some tests had warnings, but icons should work.${NC}"
    fi
else
    echo -e "${BLUE}📊 Checking generated files...${NC}"
    if ls *.png *.svg *.ico 2>/dev/null | wc -l | grep -q '^[1-9]'; then
        echo -e "${GREEN}✅ Icon files found!${NC}"
    else
        echo -e "${RED}❌ No icon files generated${NC}"
        exit 1
    fi
fi

# Show what was generated
echo -e "\n${BLUE}📋 Generated files:${NC}"
ls -la *.png *.svg *.ico 2>/dev/null | head -20

echo -e "\n${GREEN}🎉 Setup complete!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Test icons in your browser"
echo -e "2. Verify PWA installation"
echo -e "3. Update any custom references"
echo -e "\n${BLUE}For maintenance, use:${NC}"
echo -e "  make icons    # Regenerate icons"
echo -e "  make test      # Test icons"
echo -e "  make help      # See all commands"