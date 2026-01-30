# Espouse PWA Icon System

This directory contains a complete Progressive Web App (PWA) icon system for the Espouse Hugo theme.

## Quick Start

### Automated Generation (Recommended)

#### Option 1: Shell Script (Linux/macOS)
```bash
cd static/icons
./generate-icons.sh
```

#### Option 2: Node.js (Cross-platform)
```bash
cd static/icons
npm install sharp
node generate-icons.js
```

### Manual Generation
If you prefer to create icons manually or need custom designs, use the SVG templates provided in this directory.

## Icon Structure

```
static/icons/
├── generate-icons.sh           # Shell script generator
├── generate-icons.js           # Node.js generator  
├── icon-template.svg           # Regular icon template
├── icon-template-rounded.svg    # Rounded icon template
├── icon-template-maskable.svg   # Maskable icon template
├── favicon.svg                 # Favicon template
├── browserconfig.xml           # Windows tile configuration
└── icon-report.md             # Generated file report
```

## Generated Icons

### Regular Icons
- `icon-72x72.png` (72x72)
- `icon-96x96.png` (96x96) 
- `icon-128x128.png` (128x128)
- `icon-144x144.png` (144x144)
- `icon-152x152.png` (152x152)
- `icon-192x192.png` (192x192)
- `icon-384x384.png` (384x384)
- `icon-512x512.png` (512x512)

### Maskable Icons (Adaptive Icons)
- `maskable-icon-192x192.png` (192x192)
- `maskable-icon-512x512.png` (512x512)

### Special Icons
- `apple-touch-icon.png` (180x180)
- `favicon.svg` (vector)
- `favicon.ico` (multi-size: 16x16, 32x32, 48x48, 64x64)

### Shortcut Icons
- `blog-96.png` (96x96)
- `photo-96.png` (96x96)

## Design Specifications

### Colors
- **Primary:** `#2185d0` (Semantic UI Blue)
- **Secondary:** `#ffffff` (White)
- **Contrast Ratio:** 7.9:1 (WCAG AAA compliant)

### Typography
- **Letterform:** Geometric "E" with rounded corners
- **Weight:** Bold/Determined
- **Style:** Modern, professional, minimalist

### Layout
- **Regular Icons:** Letter centered with 10% padding
- **Maskable Icons:** Letter centered in 80% safe zone
- **Rounded Icons:** 23% border radius for friendly appearance

## Platform Compatibility

### iOS (Safari)
- ✅ Home Screen Icons
- ✅ Splash Screens
- ✅ App Store Compatibility

### Android (Chrome)
- ✅ Add to Home Screen
- ✅ Adaptive Icons (maskable)
- ✅ Notification Icons

### Windows (Edge)
- ✅ Start Menu Tiles
- ✅ Taskbar Icons
- ✅ Jump List Integration

### macOS (Safari/Chrome)
- ✅ Touch Bar Icons
- ✅ Dock Icons
- ✅ Spotlight Integration

## File Optimization

### PNG Optimization
The scripts automatically optimize PNG files using:
- **Shell Script:** `optipng` (if available)
- **Node.js:** Sharp's built-in compression (adaptive filtering)

### File Sizes (Typical)
- 72x72: ~1.2KB
- 192x192: ~4.5KB  
- 512x512: ~15KB
- Total package: ~40KB

## Manual Icon Creation

### Using Design Software
1. Open the appropriate SVG template in your design tool
2. Modify as needed (maintain the letter "E" and color scheme)
3. Export at required sizes using PNG-24 format
4. Save using the exact filenames specified above

### Using Online Tools
Recommended online SVG to PNG converters:
- CloudConvert
- Convertio
- SVGOMG (for SVG optimization)

### Favicon Generation
For favicon.ico creation, use:
- RealFaviconGenerator.net (comprehensive)
- Favicon.io (simple)
- ImageMagick (CLI): `convert *.png favicon.ico`

## Testing

### Local Testing
1. Start your Hugo development server
2. Open Chrome DevTools → Application → Manifest
3. Verify all icon sizes are recognized
4. Test on actual devices if possible

### Cross-Browser Testing
Test on:
- Chrome (Desktop/Mobile)
- Safari (iOS/macOS) 
- Edge (Windows)
- Firefox (Desktop/Mobile)

### PWA Installation Testing
1. Navigate to your site
2. Look for "Install App" or "Add to Home Screen"
3. Install and verify icon appearance
4. Test across different screen densities

## Troubleshooting

### Icons Not Showing
1. Verify file paths in manifest.json
2. Check browser cache (clear if needed)
3. Ensure correct MIME types in server config
4. Validate JSON syntax

### Favicon Issues
1. Clear browser cache completely
2. Check in multiple browsers
3. Verify favicon.ico contains multiple sizes
4. Test with and without www subdomain

### Maskable Icon Problems
1. Verify safe zone (80% rule)
2. Test on Android 8.0+ devices
3. Check icon is recognizable when cropped
4. Maintain contrast in safe area

## Maintenance

### Updating Icons
1. Modify SVG templates
2. Regenerate using preferred script
3. Test all icon sizes
4. Update any platform-specific references

### Adding New Sizes
1. Add size to CONFIG in generate-icons.js
2. Update manifest.json if needed
3. Test on target platforms
4. Update documentation

## References

- [PWA Icon Best Practices](https://web.dev/pwa-checklist/#icon)
- [Adaptive Icons Guide](https://web.dev/patterns/pwa/patterns/adaptive-icons/)
- [Favicon Best Practices](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)
- [Semantic UI Color Palette](https://semantic-ui.com/usage/theming.html)