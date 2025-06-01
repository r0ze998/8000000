#!/usr/bin/env node

// Performance audit script for Vercel optimization

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

const AUDIT_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4
    },
    emulatedUserAgent: 'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.101 Mobile Safari/537.36'
  }
};

async function runAudit(url) {
  console.log(`🚀 Starting performance audit for: ${url}`);
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
  });
  
  try {
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      ...AUDIT_CONFIG
    });
    
    await chrome.kill();
    
    return runnerResult;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

function analyzeResults(result) {
  const { lhr } = result;
  const scores = lhr.categories;
  
  console.log('\n📊 Performance Scores:');
  console.log(`Performance: ${Math.round(scores.performance.score * 100)}/100`);
  console.log(`Accessibility: ${Math.round(scores.accessibility.score * 100)}/100`);
  console.log(`Best Practices: ${Math.round(scores['best-practices'].score * 100)}/100`);
  console.log(`SEO: ${Math.round(scores.seo.score * 100)}/100`);
  
  // Core Web Vitals
  const audits = lhr.audits;
  console.log('\n⚡ Core Web Vitals:');
  
  if (audits['largest-contentful-paint']) {
    const lcp = audits['largest-contentful-paint'].numericValue;
    console.log(`LCP: ${(lcp / 1000).toFixed(2)}s ${lcp < 2500 ? '✅' : lcp < 4000 ? '⚠️' : '❌'}`);
  }
  
  if (audits['first-input-delay']) {
    const fid = audits['first-input-delay'].numericValue;
    console.log(`FID: ${fid.toFixed(0)}ms ${fid < 100 ? '✅' : fid < 300 ? '⚠️' : '❌'}`);
  }
  
  if (audits['cumulative-layout-shift']) {
    const cls = audits['cumulative-layout-shift'].numericValue;
    console.log(`CLS: ${cls.toFixed(3)} ${cls < 0.1 ? '✅' : cls < 0.25 ? '⚠️' : '❌'}`);
  }
  
  // Bundle size analysis
  console.log('\n📦 Bundle Analysis:');
  
  if (audits['total-byte-weight']) {
    const totalBytes = audits['total-byte-weight'].numericValue;
    console.log(`Total Bundle: ${(totalBytes / 1024).toFixed(0)} KB`);
  }
  
  if (audits['unused-javascript']) {
    const unusedJS = audits['unused-javascript'].details?.items || [];
    const unusedBytes = unusedJS.reduce((total, item) => total + item.wastedBytes, 0);
    console.log(`Unused JS: ${(unusedBytes / 1024).toFixed(0)} KB`);
  }
  
  // Opportunities for improvement
  console.log('\n🔧 Improvement Opportunities:');
  
  const opportunities = [
    'render-blocking-resources',
    'unused-css-rules',
    'unused-javascript',
    'modern-image-formats',
    'offscreen-images',
    'unminified-css',
    'unminified-javascript'
  ];
  
  opportunities.forEach(audit => {
    if (audits[audit] && audits[audit].score < 1) {
      const savings = audits[audit].details?.overallSavingsMs || 0;
      console.log(`- ${audit}: ${savings}ms potential savings`);
    }
  });
  
  // Accessibility issues
  console.log('\n♿ Accessibility Issues:');
  
  const a11yAudits = [
    'color-contrast',
    'link-name',
    'button-name',
    'image-alt',
    'label',
    'aria-labels'
  ];
  
  a11yAudits.forEach(audit => {
    if (audits[audit] && audits[audit].score < 1) {
      console.log(`- ${audit}: ${audits[audit].title}`);
    }
  });
}

async function checkBundleSize() {
  console.log('\n📦 Checking bundle sizes...');
  
  try {
    const buildManifest = require('../.next/build-manifest.json');
    
    for (const [page, files] of Object.entries(buildManifest.pages)) {
      let totalSize = 0;
      
      for (const file of files) {
        try {
          const filePath = path.join(process.cwd(), '.next', file);
          const stats = await fs.stat(filePath);
          totalSize += stats.size;
        } catch (error) {
          // File might not exist
        }
      }
      
      const sizeKB = totalSize / 1024;
      const status = sizeKB > 100 ? '❌' : sizeKB > 70 ? '⚠️' : '✅';
      console.log(`${page}: ${sizeKB.toFixed(1)} KB ${status}`);
    }
  } catch (error) {
    console.log('Could not analyze bundle sizes. Run `npm run build` first.');
  }
}

async function generateReport(result, outputPath) {
  const reportHtml = result.report;
  await fs.writeFile(outputPath, reportHtml);
  console.log(`\n📄 Full report saved to: ${outputPath}`);
}

async function main() {
  const args = process.argv.slice(2);
  const url = args[0] || 'http://localhost:3000';
  const outputDir = args[1] || './reports';
  
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Run bundle size check
    await checkBundleSize();
    
    // Run Lighthouse audit
    const result = await runAudit(url);
    
    // Analyze results
    analyzeResults(result);
    
    // Generate report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(outputDir, `lighthouse-${timestamp}.html`);
    await generateReport(result, reportPath);
    
    // Check if all targets are met
    const { lhr } = result;
    const performanceScore = lhr.categories.performance.score * 100;
    const accessibilityScore = lhr.categories.accessibility.score * 100;
    
    const meetsTargets = performanceScore >= 90 && accessibilityScore >= 90;
    
    console.log(`\n${meetsTargets ? '🎉' : '❌'} Performance targets ${meetsTargets ? 'MET' : 'NOT MET'}`);
    console.log('Targets: Performance ≥90, Accessibility ≥90, LCP <2.5s, FID <100ms, CLS <0.1');
    
    process.exit(meetsTargets ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runAudit, analyzeResults, checkBundleSize };