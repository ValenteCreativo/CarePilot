/**
 * Performance test script for glassmorphism design system
 * Validates blur limits, hardware acceleration, and reduced motion support
 */

import { runPerformanceValidation } from './performance-validation';
import { readFileSync } from 'fs';

// Read globals.css content
const cssContent = readFileSync('./src/app/globals.css', 'utf8');

console.log('⚡ Glassmorphism Performance Validation');
console.log('=====================================\n');

// Run performance validation
const results = runPerformanceValidation(cssContent);

// Blur performance results
console.log('🔍 Blur Performance Tests:');
console.log('---------------------------');
if (results.blurPerformance.valid) {
  console.log('✅ All blur values within performance limits (≤16px)');
} else {
  console.log('❌ Blur performance violations found:');
  results.blurPerformance.violations.forEach(violation => {
    console.log(`  • ${violation.class}: ${violation.blurValue} - ${violation.recommendation}`);
  });
}

// Hardware acceleration results
console.log('\n🚀 Hardware Acceleration Tests:');
console.log('------------------------------');
console.log(`Has will-change property: ${results.hardwareAcceleration.hasWillChange ? '✅' : '❌'}`);
console.log(`Uses transform/opacity only: ${results.hardwareAcceleration.hasTransformOnly ? '✅' : '❌'}`);
console.log(`Uses hardware-accelerated props: ${results.hardwareAcceleration.usesHardwareAcceleratedProps ? '✅' : '❌'}`);

// Reduced motion results
console.log('\n🌊 Reduced Motion Tests:');
console.log('-------------------------');
console.log(`Has reduced motion support: ${results.reducedMotion.hasReducedMotion ? '✅' : '❌'}`);
console.log(`Disables animations for reduced motion: ${results.reducedMotion.hasMotionDisabled ? '✅' : '❌'}`);

// Overall summary
console.log('\n📊 Performance Summary:');
console.log('----------------------');
console.log(`Overall compliance: ${results.overall.compliant ? '✅' : '❌'}`);

if (results.overall.issues.length > 0) {
  console.log('\nIssues found:');
  results.overall.issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });
} else {
  console.log('🎉 All performance optimizations implemented correctly!');
}

// Specific blur value verification
console.log('\n🔢 Current Blur Values Used:');
console.log('----------------------------');
const blurMatches = cssContent.match(/backdrop-blur-[a-z0-9-]+/g) || [];
const uniqueBlurValues = [...new Set(blurMatches)];
uniqueBlurValues.forEach(blurValue => {
  const pxValue = blurValue.replace('backdrop-blur-', '');
  console.log(`• ${blurValue} (${getPxValue(pxValue)})`);
});

function getPxValue(tailwindClass: string): string {
  const mapping: Record<string, string> = {
    'sm': '4px',
    'md': '8px', 
    'lg': '16px',
    'xl': '24px',
    '2xl': '40px'
  };
  return mapping[tailwindClass] || 'unknown';
}
