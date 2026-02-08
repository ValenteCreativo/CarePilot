/**
 * Property test for blur performance limits
 * Validates that all blur values respect 16px maximum requirement
 */

import { readFileSync } from 'fs';

// Blur value mappings (Tailwind CSS v4)
const BLUR_VALUES = {
  'backdrop-blur-sm': '4px',   // Subtle blur
  'backdrop-blur-md': '8px',   // Medium blur (default)
  'backdrop-blur-lg': '16px',  // Large blur (maximum)
  'backdrop-blur-xl': '24px',  // Extra large (use sparingly)
  'backdrop-blur-2xl': '40px'  // Very large (avoid)
} as const;

// Maximum allowed blur for performance
const MAX_BLUR_PX = 16;

// Validate blur performance limits
export function validateBlurPerformance(cssContent: string): {
  hasValidBlurValues: boolean;
  violations: Array<{
    class: string;
    blurValue: string;
    recommendation: string;
  }>;
  hasExcessiveBlur: boolean;
} {
  const violations: Array<{
    class: string;
    blurValue: string;
    recommendation: string;
  }> = [];
  
  // Check each blur value in the CSS
  Object.entries(BLUR_VALUES).forEach(([className, blurValue]) => {
    if (cssContent.includes(className)) {
      const blurPx = parseInt(blurValue.replace('px', ''));
      
      if (blurPx > MAX_BLUR_PX) {
        violations.push({
          class: className,
          blurValue: blurValue,
          recommendation: `Use ${MAX_BLUR_PX}px maximum (${getRecommendedClass(blurPx)})`
        });
      }
    }
  });
  
  const hasValidBlurValues = violations.length === 0;
  const hasExcessiveBlur = violations.some(v => v.blurValue === '40px');
  
  return {
    hasValidBlurValues,
    violations,
    hasExcessiveBlur
  };
}

// Get recommended blur class for performance
function getRecommendedClass(currentBlurPx: number): string {
  if (currentBlurPx <= 4) return 'backdrop-blur-sm';
  if (currentBlurPx <= 8) return 'backdrop-blur-md';
  if (currentBlurPx <= 16) return 'backdrop-blur-lg';
  return 'backdrop-blur-lg'; // Force to maximum allowed
}

// Run comprehensive blur performance validation
export function runBlurPerformanceValidation(): {
  validation: ReturnType<typeof validateBlurPerformance>;
  overall: {
    compliant: boolean;
    message: string;
    recommendations: string[];
  };
} {
  console.log('⚡ Blur Performance Validation');
  console.log('====================================\n');
  
  // Read CSS content
  const cssContent = readFileSync('./src/app/globals.css', 'utf8');
  
  // Run validation
  const validation = validateBlurPerformance(cssContent);
  
  const issues: string[] = [];
  
  if (!validation.hasValidBlurValues) {
    validation.violations.forEach(violation => {
      issues.push(`${violation.class}: ${violation.blurValue} - ${violation.recommendation}`);
    });
  }
  
  if (validation.hasExcessiveBlur) {
    issues.push('Contains excessive blur values (40px) - performance impact');
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (!validation.hasValidBlurValues) {
    recommendations.push('Fix blur performance violations');
    recommendations.push('Ensure all blur values are within 16px limit');
  }
  
  if (validation.hasValidBlurValues && !validation.hasExcessiveBlur) {
    recommendations.push('Blur performance optimization is excellent');
  }
  
  console.log('Blur Value Analysis:');
  console.log('-----------------------');
  Object.entries(BLUR_VALUES).forEach(([className, blurValue]) => {
    const found = cssContent.includes(className);
    console.log(`  ${className}: ${found ? '✅' : '❌'} (${blurValue})`);
  });
  
  console.log('\nPerformance Limits:');
  console.log(`Maximum allowed: ${MAX_BLUR_PX}px`);
  console.log(`All values within limits: ${validation.hasValidBlurValues ? '✅' : '❌'}`);
  
  console.log(`\n⚡ Overall Performance Compliance: ${validation.hasValidBlurValues && !validation.hasExcessiveBlur ? '✅' : '❌'}`);
  
  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  return {
    validation,
    overall: {
      compliant: validation.hasValidBlurValues && !validation.hasExcessiveBlur,
      message: validation.hasValidBlurValues && !validation.hasExcessiveBlur 
        ? 'All blur values respect performance limits'
        : 'Performance issues need attention',
      recommendations
    }
  };
}

// Export for use in tests
export { 
  validateBlurPerformance, 
  getRecommendedClass
};
