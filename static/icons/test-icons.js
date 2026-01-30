/**
 * Icon Test Script for Espouse PWA
 * Validates generated icons and checks for common issues
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  iconsDir: './static/icons',
  requiredFiles: [
    'icon-72x72.png',
    'icon-96x96.png', 
    'icon-128x128.png',
    'icon-144x144.png',
    'icon-152x152.png',
    'icon-192x192.png',
    'icon-384x384.png',
    'icon-512x512.png',
    'maskable-icon-192x192.png',
    'maskable-icon-512x512.png',
    'apple-touch-icon.png',
    'favicon.svg',
    'favicon-16.png',
    'favicon-32.png',
    'favicon-48.png',
    'favicon.ico',
    'blog-96.png',
    'photo-96.png'
  ],
  maxFileSize: {
    'icon-512x512.png': 20000, // 20KB
    'icon-384x384.png': 15000, // 15KB
    'icon-192x192.png': 8000,  // 8KB
    'favicon.ico': 10000       // 10KB
  }
};

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

// Helper function to log test results
function logTest(testName, passed, message, details = null) {
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${testName}: ${message}`);
  
  if (details) {
    console.log(`   ${details}`);
  }
  
  testResults.details.push({
    test: testName,
    passed,
    message,
    details
  });
  
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

// Test if all required files exist
function testFileExistence() {
  console.log('\n🔍 Testing file existence...');
  
  const missingFiles = [];
  
  for (const file of TEST_CONFIG.requiredFiles) {
    const filePath = path.join(TEST_CONFIG.iconsDir, file);
    const exists = fs.existsSync(filePath);
    
    if (!exists) {
      missingFiles.push(file);
    }
    
    logTest(
      `File: ${file}`,
      exists,
      exists ? 'Found' : 'Missing'
    );
  }
  
  if (missingFiles.length > 0) {
    console.log(`\n⚠️  Missing ${missingFiles.length} files: ${missingFiles.join(', ')}`);
    testResults.warnings += missingFiles.length;
  }
  
  return missingFiles.length === 0;
}

// Test file sizes
function testFileSizes() {
  console.log('\n📏 Testing file sizes...');
  
  let oversizedFiles = [];
  
  for (const [file, maxSize] of Object.entries(TEST_CONFIG.maxFileSize)) {
    const filePath = path.join(TEST_CONFIG.iconsDir, file);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const size = stats.size;
      const passed = size <= maxSize;
      
      if (!passed) {
        oversizedFiles.push(file);
      }
      
      logTest(
        `Size: ${file}`,
        passed,
        `${(size / 1024).toFixed(1)}KB`,
        passed ? '' : `(max: ${(maxSize / 1024).toFixed(1)}KB)`
      );
    }
  }
  
  if (oversizedFiles.length > 0) {
    console.log(`\n⚠️  ${oversizedFiles.length} files are oversized`);
    testResults.warnings += oversizedFiles.length;
  }
  
  return oversizedFiles.length === 0;
}

// Test SVG validity
function testSVGValidity() {
  console.log('\n🎨 Testing SVG validity...');
  
  const svgFiles = ['favicon.svg', 'icon-template.svg'];
  let validSVGs = 0;
  
  for (const file of svgFiles) {
    const filePath = path.join(TEST_CONFIG.iconsDir, file);
    
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const isValid = content.includes('<svg') && 
                       content.includes('</svg>') && 
                       content.includes('xmlns="http://www.w3.org/2000/svg"');
        
        logTest(
          `SVG: ${file}`,
          isValid,
          isValid ? 'Valid' : 'Invalid structure'
        );
        
        if (isValid) validSVGs++;
      } catch (error) {
        logTest(`SVG: ${file}`, false, 'Read error', error.message);
      }
    }
  }
  
  return validSVGs === svgFiles.length;
}

// Test manifest.json references
function testManifestReferences() {
  console.log('\n📋 Testing manifest.json references...');
  
  const manifestPath = path.join('./static', 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    logTest('Manifest.json', false, 'File not found');
    return false;
  }
  
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const iconReferences = manifest.icons || [];
    
    logTest(
      'Manifest icons',
      iconReferences.length > 0,
      `${iconReferences.length} icon references found`
    );
    
    // Check if all referenced files exist
    let missingReferences = 0;
    for (const icon of iconReferences) {
      const filePath = path.join('.', icon.src);
      if (!fs.existsSync(filePath)) {
        logTest(
          `Reference: ${icon.src}`,
          false,
          'Referenced file missing'
        );
        missingReferences++;
      }
    }
    
    return missingReferences === 0;
    
  } catch (error) {
    logTest('Manifest.json', false, 'Invalid JSON', error.message);
    return false;
  }
}

// Test color consistency
function testColorConsistency() {
  console.log('\n🎨 Testing color consistency...');
  
  const expectedColors = ['#2185d0', '#ffffff'];
  const svgFiles = ['favicon.svg', 'icon-template.svg'];
  let consistentColors = 0;
  
  for (const file of svgFiles) {
    const filePath = path.join(TEST_CONFIG.iconsDir, file);
    
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const hasExpectedColors = expectedColors.every(color => 
          content.includes(color)
        );
        
        logTest(
          `Colors: ${file}`,
          hasExpectedColors,
          hasExpectedColors ? 'Consistent' : 'Missing expected colors'
        );
        
        if (hasExpectedColors) consistentColors++;
      } catch (error) {
        logTest(`Colors: ${file}`, false, 'Read error', error.message);
      }
    }
  }
  
  return consistentColors === svgFiles.length;
}

// Generate test report
function generateTestReport() {
  const report = `# PWA Icons Test Report
**Theme:** Espouse  
**Tested:** ${new Date().toISOString()}  
**Status:** ${testResults.failed === 0 ? 'PASSED' : 'FAILED'}

## Test Summary
- ✅ Passed: ${testResults.passed}
- ❌ Failed: ${testResults.failed}
- ⚠️  Warnings: ${testResults.warnings}

## Test Details
${testResults.details.map(detail => 
  `- **${detail.test}**: ${detail.passed ? '✅' : '❌'} ${detail.message}${detail.details ? `\n  - ${detail.details}` : ''}`
).join('\n')}

## Recommendations
${testResults.failed > 0 ? 
  '❌ Fix failed tests before deploying' : 
  testResults.warnings > 0 ? 
  '⚠️  Address warnings for optimal performance' : 
  '✅ All tests passed! Ready for deployment.'
}

## Next Steps
1. Fix any failed tests
2. Address warnings if present
3. Test on actual devices
4. Verify PWA installation
`;

  fs.writeFileSync(path.join(TEST_CONFIG.iconsDir, 'test-report.md'), report);
  console.log('\n📊 Test report generated: test-report.md');
}

// Main test execution
function runTests() {
  console.log('🧪 === Espouse PWA Icon Tests ===');
  console.log('Testing generated icon system...\n');
  
  const tests = [
    testFileExistence,
    testFileSizes,
    testSVGValidity,
    testManifestReferences,
    testColorConsistency
  ];
  
  let allPassed = true;
  
  for (const test of tests) {
    const result = test();
    allPassed = allPassed && result;
  }
  
  // Generate final report
  generateTestReport();
  
  // Final summary
  console.log('\n🎯 === Test Summary ===');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings}`);
  
  if (allPassed && testResults.warnings === 0) {
    console.log('\n🎉 All tests passed! Icon system is ready for deployment.');
  } else if (allPassed) {
    console.log('\n✅ All critical tests passed. Consider addressing warnings.');
  } else {
    console.log('\n❌ Some tests failed. Please fix issues before deployment.');
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, testResults };