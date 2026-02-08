/**
 * Focus state validation for glassmorphism design system
 * Tests interactive elements have proper focus visibility
 */

import { readFileSync } from 'fs';

// Interactive elements that should have focus states
const INTERACTIVE_ELEMENTS = [
  'button',
  'input',
  'textarea', 
  'select',
  'a',
  '[role="button"]',
  '[tabindex]:not([tabindex="-1"])',
  '.glass-hover',
  '.bg-card\\/60',
  '.bg-card\\/70'
] as const;

// Focus state indicators to look for
const FOCUS_INDICATORS = [
  'focus-visible',
  'focus-within',
  ':focus',
  '.focus',
  'outline-color',
  'outline-offset'
] as const;

// Validate focus states exist in CSS
export function validateFocusStates(cssContent: string): {
  hasFocusIndicators: boolean;
  missingIndicators: string[];
  interactiveElementsWithoutFocus: string[];
} {
  const missingIndicators: string[] = [];
  const foundIndicators: string[] = [];
  
  FOCUS_INDICATORS.forEach(indicator => {
    if (cssContent.includes(indicator)) {
      foundIndicators.push(indicator);
    } else {
      missingIndicators.push(indicator);
    }
  });
  
  // Check if interactive elements have focus handling
  const interactiveElementsWithoutFocus: string[] = [];
  
  INTERACTIVE_ELEMENTS.forEach(element => {
    const hasFocusState = FOCUS_INDICATORS.some(indicator => 
      cssContent.includes(`${element}${indicator}`) ||
      cssContent.includes(`${indicator}${element}`)
    );
    
    if (!hasFocusState) {
      interactiveElementsWithoutFocus.push(element);
    }
  });
  
  return {
    hasFocusIndicators: missingIndicators.length === 0,
    missingIndicators,
    interactiveElementsWithoutFocus
  };
}

// Check for proper focus contrast
export function validateFocusContrast(cssContent: string): {
  hasFocusContrast: boolean;
  focusColors: string[];
} {
  const focusColors: string[] = [];
  
  // Look for focus-specific color definitions
  const focusColorMatches = cssContent.match(/(?:focus|focus-visible)[^:]*:\s*([^;]+)/g) || [];
  
  focusColorMatches.forEach(match => {
    const colorValue = match[1].trim();
    if (colorValue) {
      focusColors.push(colorValue);
    }
  });
  
  return {
    hasFocusContrast: focusColors.length > 0,
    focusColors
  };
}

// Validate touch target accessibility
export function validateTouchTargets(cssContent: string): {
  hasTouchTargets: boolean;
  smallTargets: string[];
} {
  const smallTargets: string[] = [];
  
  // Look for touch target size definitions
  const touchTargetMatches = cssContent.match(/min-(width|height):\s*(\d+)px/g) || [];
  
  touchTargetMatches.forEach(match => {
    const size = parseInt(match[2]);
    if (size < 44) { // WCAG minimum is 44x44px
      smallTargets.push(`${match[1]}: ${size}px`);
    }
  });
  
  return {
    hasTouchTargets: touchTargetMatches.length > 0,
    smallTargets
  };
}

// Run comprehensive focus state validation
export function validateGlassmorphismFocusStates(cssContent: string): {
  focusStates: ReturnType<typeof validateFocusStates>;
  focusContrast: ReturnType<typeof validateFocusContrast>;
  touchTargets: ReturnType<typeof validateTouchTargets>;
  overall: {
    compliant: boolean;
    issues: string[];
    recommendations: string[];
  };
} {
  console.log('🎯 Focus State Validation');
  console.log('========================\n');
  
  const focusStates = validateFocusStates(cssContent);
  const focusContrast = validateFocusContrast(cssContent);
  const touchTargets = validateTouchTargets(cssContent);
  
  const issues: string[] = [];
  
  if (!focusStates.hasFocusIndicators) {
    issues.push(`Missing focus indicators: ${focusStates.missingIndicators.join(', ')}`);
  }
  
  if (focusStates.interactiveElementsWithoutFocus.length > 0) {
    issues.push(`Interactive elements without focus states: ${focusStates.interactiveElementsWithoutFocus.join(', ')}`);
  }
  
  if (!focusContrast.hasFocusContrast) {
    issues.push('No focus-specific color definitions found');
  }
  
  if (!touchTargets.hasTouchTargets) {
    issues.push('No touch target size definitions found');
  }
  
  if (touchTargets.smallTargets.length > 0) {
    issues.push(`Touch targets below 44px: ${touchTargets.smallTargets.join(', ')}`);
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (issues.length > 0) {
    recommendations.push('Add focus-visible styles for better accessibility');
    recommendations.push('Implement focus-specific color contrasts');
    recommendations.push('Ensure minimum 44x44px touch targets');
    recommendations.push('Test focus states with keyboard navigation');
  } else {
    recommendations.push('Focus state implementation is comprehensive');
  }
  
  console.log('Focus State Indicators:');
  console.log(`Present: ${focusStates.hasFocusIndicators ? '✅' : '❌'}`);
  console.log(`Missing: ${focusStates.missingIndicators.join(', ') || 'None'}`);
  
  console.log('\nInteractive Elements with Focus:');
  console.log(`Covered: ${INTERACTIVE_ELEMENTS.length - focusStates.interactiveElementsWithoutFocus.length}/${INTERACTIVE_ELEMENTS.length}`);
  
  console.log('\nTouch Target Accessibility:');
  console.log(`44x44px minimum: ${touchTargets.hasTouchTargets ? '✅' : '❌'}`);
  
  console.log(`\nOverall focus compliance: ${issues.length === 0 ? '✅' : '❌'}`);
  
  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  return {
    focusStates,
    focusContrast,
    touchTargets,
    overall: {
      compliant: issues.length === 0,
      issues,
      recommendations
    }
  };
}

// Export for use in tests
export { validateGlassmorphismFocusStates };

// Run if called directly
if (typeof require !== 'undefined' && require.main === module) {
  const cssContent = readFileSync('./src/app/globals.css', 'utf8');
  validateGlassmorphismFocusStates(cssContent);
}
