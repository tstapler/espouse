/**
 * Node.js PWA Icon Generator for Espouse Theme
 * Alternative to shell script using sharp for high-quality PNG generation
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Sharp not found. Install with: npm install sharp');
  process.exit(1);
}

// Configuration
const CONFIG = {
  templatesDir: './static/icons',
  outputDir: './static/icons',
  themeColor: '#2185d0',
  foregroundColor: '#ffffff',
  sizes: {
    regular: [72, 96, 128, 144, 152, 192, 384, 512],
    maskable: [192, 512],
    special: {
      'apple-touch-icon': 180,
      'favicon': [16, 32, 48, 64]
    },
    shortcuts: {
      'blog': 96,
      'photo': 96
    }
  }
};

// Generate SVG content programmatically
function generateSVG(size, type = 'regular') {
  const viewBox = `0 0 ${size} ${size}`;
  const borderRadius = type === 'rounded' ? size * 0.23 : 0;
  const safeMargin = type === 'maskable' ? size * 0.1 : 0;
  
  // Calculate letter dimensions
  const innerSize = size - (safeMargin * 2);
  const strokeWidth = Math.max(innerSize * 0.08, 2);
  const borderRadiusLetter = strokeWidth * 0.8;
  
  // Letter E dimensions (proportional)
  const stemWidth = strokeWidth;
  const stemHeight = innerSize * 0.6;
  const barHeight = strokeWidth;
  const longBarWidth = innerSize * 0.6;
  const shortBarWidth = innerSize * 0.48;
  
  const x = safeMargin;
  const y = safeMargin;
  
  // Position letter centered in safe area
  const letterX = x + (innerSize - longBarWidth) / 2;
  const letterY = y + (innerSize - stemHeight) / 2;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`;
  svg += `<rect width="${size}" height="${size}" fill="${CONFIG.themeColor}" rx="${borderRadius}"/>`;
  
  // Letter E parts
  svg += `<g fill="${CONFIG.foregroundColor}">`;
  // Main stem
  svg += `<rect x="${letterX}" y="${letterY}" width="${stemWidth}" height="${stemHeight}" rx="${borderRadiusLetter}"/>`;
  // Top bar
  svg += `<rect x="${letterX}" y="${letterY}" width="${longBarWidth}" height="${barHeight}" rx="${borderRadiusLetter}"/>`;
  // Middle bar
  svg += `<rect x="${letterX}" y="${letterY + (stemHeight - barHeight) / 2}" width="${shortBarWidth}" height="${barHeight}" rx="${borderRadiusLetter}"/>`;
  // Bottom bar
  svg += `<rect x="${letterX}" y="${letterY + stemHeight - barHeight}" width="${longBarWidth}" height="${barHeight}" rx="${borderRadiusLetter}"/>`;
  svg += `</g>`;
  
  // Add subtle gradient for rounded style
  if (type === 'rounded') {
    svg += `<defs>`;
    svg += `<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">`;
    svg += `<stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.1" />`;
    svg += `<stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />`;
    svg += `</linearGradient>`;
    svg += `</defs>`;
    svg += `<rect width="${size}" height="${size}" fill="url(#grad)" rx="${borderRadius}"/>`;
  }
  
  svg += '</svg>';
  
  return svg;
}

// Convert SVG to PNG using Sharp
async function svgToPng(svgContent, outputPath, size) {
  return sharp(Buffer.from(svgContent))
    .resize(size, size)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);
}

// Generate regular icons
async function generateRegularIcons() {
  console.log('🔷 Generating regular icons...');
  
  for (const size of CONFIG.sizes.regular) {
    const svg = generateSVG(size, 'regular');
    const outputPath = path.join(CONFIG.outputDir, `icon-${size}x${size}.png`);
    
    await svgToPng(svg, outputPath, size);
    console.log(`  ✅ icon-${size}x${size}.png`);
  }
}

// Generate maskable icons
async function generateMaskableIcons() {
  console.log('🎭 Generating maskable icons...');
  
  for (const size of CONFIG.sizes.maskable) {
    const svg = generateSVG(size, 'maskable');
    const outputPath = path.join(CONFIG.outputDir, `maskable-icon-${size}x${size}.png`);
    
    await svgToPng(svg, outputPath, size);
    console.log(`  ✅ maskable-icon-${size}x${size}.png`);
  }
}

// Generate special icons
async function generateSpecialIcons() {
  console.log('⭐ Generating special icons...');
  
  // Apple touch icon
  const appleSvg = generateSVG(180, 'rounded');
  await svgToPng(appleSvg, path.join(CONFIG.outputDir, 'apple-touch-icon.png'), 180);
  console.log('  ✅ apple-touch-icon.png');
  
  // Favicon variants
  for (const size of CONFIG.sizes.special.favicon) {
    const svg = generateSVG(size, 'regular');
    const outputPath = path.join(CONFIG.outputDir, `favicon-${size}.png`);
    await svgToPng(svg, outputPath, size);
    console.log(`  ✅ favicon-${size}.png`);
  }
  
  // Save favicon SVG
  const faviconSvg = generateSVG(32, 'rounded');
  fs.writeFileSync(path.join(CONFIG.outputDir, 'favicon.svg'), faviconSvg);
  console.log('  ✅ favicon.svg');
}

// Generate shortcut icons
async function generateShortcutIcons() {
  console.log('🔗 Generating shortcut icons...');
  
  for (const [name, size] of Object.entries(CONFIG.sizes.shortcuts)) {
    const svg = generateSVG(size, 'regular');
    const outputPath = path.join(CONFIG.outputDir, `${name}-${size}.png`);
    
    await svgToPng(svg, outputPath, size);
    console.log(`  ✅ ${name}-${size}.png`);
  }
}

// Generate report
function generateReport() {
  console.log('📊 Generating report...');
  
  const report = `# PWA Icons Generation Report
**Theme:** Espouse  
**Generated:** ${new Date().toISOString()}  
**Method:** Node.js + Sharp SVG to PNG conversion  

## Generated Icons

### Regular Icons
${CONFIG.sizes.regular.map(size => `- icon-${size}x${size}.png (${size}x${size})`).join('\n')}

### Maskable Icons
${CONFIG.sizes.maskable.map(size => `- maskable-icon-${size}x${size}.png (${size}x${size})`).join('\n')}

### Special Icons
- apple-touch-icon.png (180x180)
- favicon.svg (vector)
${CONFIG.sizes.special.favicon.map(size => `- favicon-${size}.png (${size}x${size})`).join('\n')}

### Shortcut Icons
${Object.entries(CONFIG.sizes.shortcuts).map(([name, size]) => `- ${name}-${size}.png (${size}x${size})`).join('\n')}

## Design Specifications

- **Primary Color:** ${CONFIG.themeColor} (Semantic UI Blue)
- **Secondary Color:** ${CONFIG.foregroundColor} (White)
- **Design:** Letter "E" with geometric styling
- **Style:** Modern, clean, professional
- **Safe Zone:** 80% for maskable icons
- **Engine:** Sharp (high-quality PNG generation)

## File Sizes
${fs.readdirSync(CONFIG.outputDir)
  .filter(file => file.endsWith('.png'))
  .map(file => {
    const filePath = path.join(CONFIG.outputDir, file);
    const size = fs.statSync(filePath).size;
    return `- ${file}: ${size} bytes`;
  }).join('\n')}
`;

  fs.writeFileSync(path.join(CONFIG.outputDir, 'icon-report.md'), report);
  console.log('  ✅ icon-report.md');
}

// Main execution
async function main() {
  console.log('🚀 === Espouse PWA Icon Generator (Node.js) ===');
  console.log('Generating comprehensive PWA icon set...\n');
  
  try {
    await generateRegularIcons();
    await generateMaskableIcons();
    await generateSpecialIcons();
    await generateShortcutIcons();
    generateReport();
    
    console.log('\n✅ === Icon Generation Complete ===');
    console.log(`All icons generated successfully in: ${CONFIG.outputDir}`);
    console.log('\n📋 Next steps:');
    console.log('1. Test the icons on different devices');
    console.log('2. Verify the PWA manifest references');
    console.log('3. Check favicon rendering in browsers');
    console.log('4. Update any hardcoded icon references');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateSVG, svgToPng, CONFIG };