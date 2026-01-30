#!/bin/bash

# PWA Icon Generator for Espouse Theme
# This script generates all required PWA icons from SVG templates

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
STATIC_DIR="static/icons"
TEMPLATES_DIR="$STATIC_DIR"
OUTPUT_DIR="$STATIC_DIR"

# Check if required tools are available
check_dependencies() {
    echo -e "${BLUE}Checking dependencies...${NC}"
    
    if ! command -v inkscape &> /dev/null && ! command -v rsvg-convert &> /dev/null; then
        echo -e "${RED}Error: Neither inkscape nor rsvg-convert found.${NC}"
        echo -e "${YELLOW}Please install one of the following:${NC}"
        echo -e "${YELLOW}  - On Ubuntu/Debian: sudo apt-get install inkscape or librsvg2-bin${NC}"
        echo -e "${YELLOW}  - On macOS: brew install inkscape or librsvg${NC}"
        echo -e "${YELLOW}  - On Windows: Install Inkscape from https://inkscape.org/${NC}"
        exit 1
    fi
    
    # Use rsvg-convert if available (faster), otherwise inkscape
    if command -v rsvg-convert &> /dev/null; then
        SVG_CONVERTER="rsvg-convert"
        echo -e "${GREEN}Using rsvg-convert for SVG to PNG conversion${NC}"
    else
        SVG_CONVERTER="inkscape"
        echo -e "${GREEN}Using Inkscape for SVG to PNG conversion${NC}"
    fi
}

# Convert SVG to PNG
svg_to_png() {
    local input_svg="$1"
    local output_png="$2"
    local size="$3"
    
    if [ "$SVG_CONVERTER" = "rsvg-convert" ]; then
        rsvg-convert -w "$size" -h "$size" "$input_svg" -o "$output_png"
    else
        inkscape -w "$size" -h "$size" --export-filename="$output_png" "$input_svg" 2>/dev/null
    fi
}

# Generate regular icons
generate_regular_icons() {
    echo -e "${BLUE}Generating regular icons...${NC}"
    
    local sizes=(72 96 128 144 152 192 384 512)
    local template="$TEMPLATES_DIR/icon-template.svg"
    
    for size in "${sizes[@]}"; do
        echo -e "  Generating ${size}x${size}..."
        svg_to_png "$template" "$OUTPUT_DIR/icon-${size}x${size}.png" "$size"
    done
}

# Generate maskable icons
generate_maskable_icons() {
    echo -e "${BLUE}Generating maskable icons...${NC}"
    
    local sizes=(192 512)
    local template="$TEMPLATES_DIR/icon-template-maskable.svg"
    
    for size in "${sizes[@]}"; do
        echo -e "  Generating maskable ${size}x${size}..."
        svg_to_png "$template" "$OUTPUT_DIR/maskable-icon-${size}x${size}.png" "$size"
    done
}

# Generate special icons
generate_special_icons() {
    echo -e "${BLUE}Generating special icons...${NC}"
    
    # Apple Touch Icon
    echo -e "  Generating Apple Touch Icon (180x180)..."
    svg_to_png "$TEMPLATES_DIR/icon-template-rounded.svg" "$OUTPUT_DIR/apple-touch-icon.png" 180
    
    # Favicon ICO (requires imagemagick or additional tools)
    echo -e "  Generating favicon variants..."
    
    # Generate multiple sizes for favicon.ico
    local favicon_sizes=(16 32 48 64)
    for size in "${favicon_sizes[@]}"; do
        svg_to_png "$TEMPLATES_DIR/favicon.svg" "$OUTPUT_DIR/favicon-${size}.png" "$size"
    done
    
    # Try to create favicon.ico if imagemagick is available
    if command -v convert &> /dev/null; then
        convert "$OUTPUT_DIR/favicon-16.png" "$OUTPUT_DIR/favicon-32.png" "$OUTPUT_DIR/favicon-48.png" "$OUTPUT_DIR/favicon-64.png" "$OUTPUT_DIR/favicon.ico"
        echo -e "${GREEN}✓ Generated favicon.ico${NC}"
    else
        echo -e "${YELLOW}⚠ ImageMagick not found. Please manually create favicon.ico from the generated PNG files${NC}"
    fi
}

# Generate shortcut icons
generate_shortcut_icons() {
    echo -e "${BLUE}Generating shortcut icons...${NC}"
    
    # Blog icon (using same design with slight variation)
    echo -e "  Generating blog icon..."
    svg_to_png "$TEMPLATES_DIR/icon-template.svg" "$OUTPUT_DIR/blog-96.png" 96
    
    # Photo icon (using same design)
    echo -e "  Generating photo icon..."
    svg_to_png "$TEMPLATES_DIR/icon-template.svg" "$OUTPUT_DIR/photo-96.png" 96
}

# Optimize PNG files if optipng is available
optimize_icons() {
    if command -v optipng &> /dev/null; then
        echo -e "${BLUE}Optimizing PNG files...${NC}"
        find "$OUTPUT_DIR" -name "*.png" -exec optipng -o7 -silent {} \;
        echo -e "${GREEN}✓ Optimized PNG files${NC}"
    else
        echo -e "${YELLOW}⚠ optipng not found. Skipping optimization${NC}"
    fi
}

# Generate verification report
generate_report() {
    echo -e "${BLUE}Generating verification report...${NC}"
    
    cat > "$OUTPUT_DIR/icon-report.md" << EOF
# PWA Icons Generation Report
**Theme:** Espouse  
**Generated:** $(date)  
**Method:** SVG to PNG conversion  

## Generated Icons

### Regular Icons
EOF
    
    local sizes=(72 96 128 144 152 192 384 512)
    for size in "${sizes[@]}"; do
        echo "- icon-${size}x${size}.png (${size}x${size})" >> "$OUTPUT_DIR/icon-report.md"
    done
    
    cat >> "$OUTPUT_DIR/icon-report.md" << EOF

### Maskable Icons
- maskable-icon-192x192.png (192x192)
- maskable-icon-512x512.png (512x512)

### Special Icons
- apple-touch-icon.png (180x180)
- favicon.svg (vector)
EOF
    
    if [ -f "$OUTPUT_DIR/favicon.ico" ]; then
        echo "- favicon.ico (multi-size)" >> "$OUTPUT_DIR/icon-report.md"
    fi
    
    cat >> "$OUTPUT_DIR/icon-report.md" << EOF

### Shortcut Icons
- blog-96.png (96x96)
- photo-96.png (96x96)

## Design Specifications

- **Primary Color:** #2185d0 (Semantic UI Blue)
- **Secondary Color:** #ffffff (White)
- **Design:** Letter "E" with geometric styling
- **Style:** Modern, clean, professional
- **Safe Zone:** 80% for maskable icons

## File Sizes
EOF
    
    # Add file sizes to report
    for file in "$OUTPUT_DIR"/*.png; do
        if [ -f "$file" ]; then
            local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "unknown")
            echo "- $(basename "$file"): ${size} bytes" >> "$OUTPUT_DIR/icon-report.md"
        fi
    done
    
    echo -e "${GREEN}✓ Report generated: $OUTPUT_DIR/icon-report.md${NC}"
}

# Main execution
main() {
    echo -e "${GREEN}=== Espouse PWA Icon Generator ===${NC}"
    echo -e "${BLUE}Generating comprehensive PWA icon set...${NC}\n"
    
    check_dependencies
    generate_regular_icons
    generate_maskable_icons
    generate_special_icons
    generate_shortcut_icons
    optimize_icons
    generate_report
    
    echo -e "\n${GREEN}=== Icon Generation Complete ===${NC}"
    echo -e "${BLUE}All icons generated successfully in: $OUTPUT_DIR${NC}"
    echo -e "${YELLOW}Remember to:${NC}"
    echo -e "1. Test the icons on different devices"
    echo -e "2. Verify the PWA manifest references"
    echo -e "3. Check favicon rendering in browsers"
    echo -e "4. Update any hardcoded icon references"
}

# Run the script
main "$@"