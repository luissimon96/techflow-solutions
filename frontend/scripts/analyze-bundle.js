#!/usr/bin/env node

// 📊 Bundle Analysis Script - Performance Monitoring
// ✅ Automated bundle size analysis
// ✅ Performance threshold validation
// ✅ Bundle composition insights
// ✅ Optimization recommendations

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${COLORS.cyan}ℹ️  ${msg}${COLORS.reset}`),
  success: (msg) => console.log(`${COLORS.green}✅ ${msg}${COLORS.reset}`),
  warning: (msg) => console.log(`${COLORS.yellow}⚠️  ${msg}${COLORS.reset}`),
  error: (msg) => console.log(`${COLORS.red}❌ ${msg}${COLORS.reset}`),
  header: (msg) => console.log(`\n${COLORS.bright}${COLORS.blue}${msg}${COLORS.reset}\n`),
};

class BundleAnalyzer {
  constructor() {
    this.distPath = path.join(__dirname, '../dist');
    this.thresholds = {
      totalSize: 2 * 1024 * 1024, // 2MB total
      chunkSize: 1024 * 1024,     // 1MB per chunk
      vendorSize: 800 * 1024,     // 800KB for vendor
    };
  }

  async analyze() {
    log.header('📊 BUNDLE ANALYSIS REPORT');
    
    try {
      // Build project first
      log.info('Building project for analysis...');
      execSync('npm run build', { stdio: 'inherit' });
      
      // Analyze bundle
      const analysis = this.analyzeBundleFiles();
      this.printSizeReport(analysis);
      this.validateThresholds(analysis);
      this.printRecommendations(analysis);
      
      // Open visualization if available
      const visualizationPath = path.join(this.distPath, 'bundle-analysis.html');
      if (fs.existsSync(visualizationPath)) {
        log.success('Bundle visualization generated: dist/bundle-analysis.html');
      }
      
    } catch (error) {
      log.error(`Analysis failed: ${error.message}`);
      process.exit(1);
    }
  }

  analyzeBundleFiles() {
    const files = this.getDistFiles();
    const analysis = {
      total: 0,
      chunks: [],
      assets: [],
      largest: null,
    };

    files.forEach(file => {
      const stats = fs.statSync(file.path);
      const size = stats.size;
      const gzipSize = this.estimateGzipSize(size);
      
      const fileInfo = {
        name: file.name,
        path: file.path,
        size,
        gzipSize,
        type: this.getFileType(file.name),
      };
      
      analysis.total += size;
      
      if (fileInfo.type === 'js') {
        analysis.chunks.push(fileInfo);
      } else {
        analysis.assets.push(fileInfo);
      }
      
      if (!analysis.largest || size > analysis.largest.size) {
        analysis.largest = fileInfo;
      }
    });
    
    // Sort by size
    analysis.chunks.sort((a, b) => b.size - a.size);
    analysis.assets.sort((a, b) => b.size - a.size);
    
    return analysis;
  }

  getDistFiles() {
    const files = [];
    
    const scanDirectory = (dir) => {
      const entries = fs.readdirSync(dir);
      
      entries.forEach(entry => {
        const fullPath = path.join(dir, entry);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          scanDirectory(fullPath);
        } else {
          files.push({
            name: entry,
            path: fullPath,
            relativePath: path.relative(this.distPath, fullPath),
          });
        }
      });
    };
    
    scanDirectory(this.distPath);
    return files;
  }

  getFileType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    if (ext === '.js') return 'js';
    if (ext === '.css') return 'css';
    if (['.png', '.jpg', '.jpeg', '.svg', '.gif'].includes(ext)) return 'image';
    if (['.woff', '.woff2', '.ttf', '.eot'].includes(ext)) return 'font';
    return 'other';
  }

  estimateGzipSize(size) {
    // Rough estimation: gzip typically reduces JS/CSS by 60-70%
    return Math.round(size * 0.35);
  }

  formatSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  printSizeReport(analysis) {
    log.header('📈 SIZE ANALYSIS');
    
    console.log(`Total Bundle Size: ${COLORS.bright}${this.formatSize(analysis.total)}${COLORS.reset}`);
    console.log(`Estimated Gzipped: ${COLORS.bright}${this.formatSize(analysis.total * 0.35)}${COLORS.reset}`);
    console.log(`Largest File: ${COLORS.bright}${analysis.largest.name}${COLORS.reset} (${this.formatSize(analysis.largest.size)})`);
    
    console.log('\n📦 JavaScript Chunks:');
    analysis.chunks.forEach(chunk => {
      const sizeColor = chunk.size > this.thresholds.chunkSize ? COLORS.red : COLORS.green;
      console.log(`  ${chunk.name.padEnd(30)} ${sizeColor}${this.formatSize(chunk.size)}${COLORS.reset} (gzip: ${this.formatSize(chunk.gzipSize)})`);
    });
    
    if (analysis.assets.length > 0) {
      console.log('\n🎨 Assets:');
      analysis.assets.slice(0, 5).forEach(asset => {
        console.log(`  ${asset.name.padEnd(30)} ${this.formatSize(asset.size)}`);
      });
      
      if (analysis.assets.length > 5) {
        console.log(`  ... and ${analysis.assets.length - 5} more assets`);
      }
    }
  }

  validateThresholds(analysis) {
    log.header('⚖️ THRESHOLD VALIDATION');
    
    let allPassed = true;
    
    // Total size check
    if (analysis.total > this.thresholds.totalSize) {
      log.warning(`Total bundle size (${this.formatSize(analysis.total)}) exceeds threshold (${this.formatSize(this.thresholds.totalSize)})`);
      allPassed = false;
    } else {
      log.success(`Total bundle size within threshold`);
    }
    
    // Individual chunk checks
    const oversizedChunks = analysis.chunks.filter(chunk => chunk.size > this.thresholds.chunkSize);
    if (oversizedChunks.length > 0) {
      log.warning(`${oversizedChunks.length} chunks exceed size threshold:`);
      oversizedChunks.forEach(chunk => {
        console.log(`    ${chunk.name}: ${this.formatSize(chunk.size)}`);
      });
      allPassed = false;
    } else {
      log.success('All chunks within size thresholds');
    }
    
    if (allPassed) {
      log.success('All performance thresholds passed! 🎉');
    }
  }

  printRecommendations(analysis) {
    log.header('💡 OPTIMIZATION RECOMMENDATIONS');
    
    const recommendations = [];
    
    // Check for large chunks
    const largeChunks = analysis.chunks.filter(chunk => chunk.size > 500 * 1024);
    if (largeChunks.length > 0) {
      recommendations.push('• Consider further code splitting for large chunks');
    }
    
    // Check vendor chunk
    const vendorChunk = analysis.chunks.find(chunk => chunk.name.includes('vendor'));
    if (vendorChunk && vendorChunk.size > this.thresholds.vendorSize) {
      recommendations.push('• Vendor chunk is large - consider splitting into smaller vendor chunks');
    }
    
    // Check for unused chunks
    const totalJs = analysis.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (totalJs / analysis.total > 0.8) {
      recommendations.push('• JavaScript makes up >80% of bundle - review asset optimization');
    }
    
    // Asset recommendations
    const largeAssets = analysis.assets.filter(asset => asset.size > 100 * 1024);
    if (largeAssets.length > 0) {
      recommendations.push('• Optimize large assets (images/fonts) for better loading performance');
    }
    
    if (recommendations.length === 0) {
      log.success('Bundle is well optimized! No recommendations at this time.');
    } else {
      recommendations.forEach(rec => console.log(rec));
    }
    
    console.log('\n🔗 Next steps:');
    console.log('• Run `npm run build` to regenerate bundle');
    console.log('• Open dist/bundle-analysis.html to explore bundle composition');
    console.log('• Use `npm run preview` to test the production build locally');
  }
}

// Run analysis
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze().catch(error => {
    console.error('Bundle analysis failed:', error);
    process.exit(1);
  });
}

module.exports = BundleAnalyzer;