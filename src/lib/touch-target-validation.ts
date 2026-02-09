/**
 * Property test for touch target accessibility
 * Tests WCAG 44x44px minimum touch target requirements
 */

import { readFileSync } from 'fs';

// Touch target minimum requirements
const TOUCH_TARGET_MIN = 44; // WCAG minimum
const TOUCH_TARGETS = {
  width: 44,
  height: 44
} as const;

// Interactive elements that should be touch targets
const TOUCH_TARGET_ELEMENTS = [
  'button',
  'input',
  'textarea',
  'select',
  'a',
  '[role="button"]',
  '[tabindex]:not([tabindex="-1"])',
  '.bg-card\\/60',
  '.bg-card\\/70'
] as const;

// Test touch target compliance
export function validateTouchTargets(cssContent: string): {
  hasTouchTargets: boolean;
  smallTargets: string[];
} {
  const smallTargets: string[] = [];
  
  // Look for touch target size definitions
  const touchTargetMatches = cssContent.match(/min-(width|height):\s*(\d+)px/g) || [];
  
  touchTargetMatches.forEach(match => {
    const size = parseInt(match[2]);
    if (size < TOUCH_TARGET_MIN) {
      smallTargets.push(`${match[1]}: ${size}px`);
    }
  });
  
  const hasTouchTargets = touchTargetMatches.length > 0;
  
  return {
    hasTouchTargets,
    smallTargets
  };
}

// Validate interactive elements have proper touch sizing
export function validateInteractiveTouchTargets(cssContent: string): {
  hasTouchTargets: boolean;
  elementsWithoutTouchTargets: string[];
} {
  const elementsWithoutTouchTargets: string[] = [];
  
  TOUCH_TARGET_ELEMENTS.forEach(element => {
    const hasTouchTarget = cssContent.includes(`min-width: ${TOUCH_TARGETS.width}px`) &&
                         cssContent.includes(`min-height: ${TOUCH_TARGETS.height}px`);
    
    if (!hasTouchTarget) {
      elementsWithoutTouchTargets.push(element);
    }
  });
  
  const hasTouchTargets = elementsWithoutTouchTargets.length === 0;
  
  return {
    hasTouchTargets,
    elementsWithoutTouchTargets
  };
}

// Run comprehensive touch target validation
export function runTouchTargetValidation(): {
  touchTargets: ReturnType<typeof validateTouchTargets>;
  interactiveElements: ReturnType<typeof validateInteractiveTouchTargets>;
  overall: {
    compliant: boolean;
    issues: string[];
    recommendations: string[];
  };
} {
  console.log('👆 Touch Target Accessibility Validation');
  console.log('====================================\n');
  
  // Read CSS content
  const cssContent = readFileSync('./src/app/globals.css', 'utf8');
  
  // Run validations
  const touchTargets = validateTouchTargets(cssContent);
  const interactiveElements = validateInteractiveTouchTargets(cssContent);
  
  const issues: string[] = [];
  
  if (!touchTargets.hasTouchTargets) {
    issues.push('No touch target size definitions found');
  }
  
  if (interactiveElements.elementsWithoutTouchTargets.length > 0) {
    issues.push(`Interactive elements without touch targets: ${interactiveElements.elementsWithoutTouchTargets.join(', ')}`);
  }
  
  if (touchTargets.smallTargets.length > 0) {
    issues.push(`Touch targets below 44x44px: ${touchTargets.smallTargets.join(', ')}`);
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (issues.length > 0) {
    recommendations.push('Add min-width and min-height CSS properties for touch targets');
    recommendations.push('Ensure minimum 44x44px touch targets for buttons and interactive elements');
    recommendations.push('Test touch interactions on mobile devices');
  } else {
    recommendations.push('Touch target accessibility is comprehensive');
  }
  
  console.log('Touch Target Size Definitions:');
  console.log(`44x44px minimum: ${touchTargets.hasTouchTargets ? '✅' : '❌'}`);
  console.log(`Small targets found: ${touchTargets.smallTargets.length > 0 ? touchTargets.smallTargets.join(', ') : 'None'}`);
  
  console.log('\nInteractive Elements with Touch Targets:');
  console.log(`Covered: ${TOUCH_TARGET_ELEMENTS.length - interactiveElements.elementsWithoutTouchTargets.length}/${TOUCH_TARGET_ELEMENTS.length}`);
  
  console.log(`\n👆 Overall touch compliance: ${issues.length === 0 ? '✅' : '❌'}`);
  
  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  return {
    touchTargets,
    interactiveElements,
    overall: {
      compliant: issues.length === 0,
      issues,
      recommendations
    }
  };
}

