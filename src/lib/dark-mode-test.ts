/**
 * Dark mode validation for glassmorphism design system
 * Tests dark mode variants and smooth transitions
 */

import { readFileSync } from 'fs';

// Expected dark mode glassmorphism properties
const EXPECTED_DARK_MODE_CLASSES = [
  '.dark .glass',
  '.dark .glass-cream', 
  '.dark .glass-dark',
  '.dark .glass-hover:hover'
] as const;

// Expected dark mode color values
const EXPECTED_COLORS = {
  background: 'rgb(0 77 109 / 0.7)', // Darker blue at 70%
  border: 'rgb(174 228 255 / 0.15)', // Light blue at 15%
  shadow: 'rgb(0 0 0 / 0.3)' // Black shadow
} as const;

// Validate dark mode classes exist
export function validateDarkModeClasses(cssContent: string): {
  hasAllClasses: boolean;
  missingClasses: string[];
} {
  const missingClasses: string[] = [];
  
  EXPECTED_DARK_MODE_CLASSES.forEach(expectedClass => {
    if (!cssContent.includes(expectedClass)) {
      missingClasses.push(expectedClass);
    }
  });
  
  return {
    hasAllClasses: missingClasses.length === 0,
    missingClasses
  };
}

// Validate dark mode color values
export function validateDarkModeColors(cssContent: string): {
  hasCorrectColors: boolean;
  missingColors: string[];
  incorrectColors: string[];
} {
  const missingColors: string[] = [];
  const incorrectColors: string[] = [];
  
  Object.entries(EXPECTED_COLORS).forEach(([colorName, expectedValue]) => {
    if (!cssContent.includes(expectedValue)) {
      missingColors.push(`${colorName}: ${expectedValue}`);
    }
  });
  
  return {
    hasCorrectColors: missingColors.length === 0 && incorrectColors.length === 0,
    missingColors,
    incorrectColors
  };
}

// Check for smooth transitions
export function validateDarkModeTransitions(cssContent: string): {
  hasTransitions: boolean;
  transitionProperties: string[];
} {
  const transitionProperties: string[] = [];
  
  // Look for transition properties in all dark mode classes
  const darkModeClasses = cssContent.match(/\.dark\s+\.glass[^{]*\{([^}]+)\}/gs) || [];
  
  darkModeClasses.forEach((match) => {
    const darkModeCSS = match[1];
    
    // Check for transition properties
    const transitions = darkModeCSS.match(/transition:\s*([^;]+)/);
    if (transitions) {
      transitionProperties.push(transitions[1].trim());
    }
  });
  
  return {
    hasTransitions: transitionProperties.length > 0,
    transitionProperties
  };
}

// Run complete dark mode validation
export function runDarkModeValidation(cssContent: string): {
  classes: ReturnType<typeof validateDarkModeClasses>;
  colors: ReturnType<typeof validateDarkModeColors>;
  transitions: ReturnType<typeof validateDarkModeTransitions>;
  overall: {
    compliant: boolean;
    issues: string[];
  };
} {
  const classes = validateDarkModeClasses(cssContent);
  const colors = validateDarkModeColors(cssContent);
  const transitions = validateDarkModeTransitions(cssContent);
  
  const issues: string[] = [];
  
  if (!classes.hasAllClasses) {
    issues.push(`Missing dark mode classes: ${classes.missingClasses.join(', ')}`);
  }
  
  if (!colors.hasCorrectColors) {
    issues.push(`Missing or incorrect dark mode colors: ${colors.missingColors.join(', ')}`);
  }
  
  if (!transitions.hasTransitions) {
    issues.push('Dark mode transitions not found');
  }
  
  return {
    classes,
    colors,
    transitions,
    overall: {
      compliant: issues.length === 0,
      issues
    }
  };
}

// Run if called directly
if (typeof require !== 'undefined' && require.main === module) {
  const cssContent = readFileSync('./src/app/globals.css', 'utf8');
  const validation = runDarkModeValidation(cssContent);
  
  console.log('🌙 Dark Mode Validation');
  console.log('========================\n');
  
  console.log('Dark Mode Classes:');
  console.log('-------------------');
  console.log(`All required classes present: ${validation.classes.hasAllClasses ? '✅' : '❌'}`);
  if (!validation.classes.hasAllClasses) {
    console.log(`Missing: ${validation.classes.missingClasses.join(', ')}`);
  }
  
  console.log('\nDark Mode Colors:');
  console.log('------------------');
  console.log(`Correct color values: ${validation.colors.hasCorrectColors ? '✅' : '❌'}`);
  if (!validation.colors.hasCorrectColors) {
    console.log(`Issues: ${validation.colors.missingColors.join(', ')}`);
  }
  
  console.log('\nDark Mode Transitions:');
  console.log('-----------------------');
  console.log(`Smooth transitions present: ${validation.transitions.hasTransitions ? '✅' : '❌'}`);
  if (validation.transitions.hasTransitions) {
    console.log(`Transition properties: ${validation.transitions.transitionProperties.join(', ')}`);
  }
  
  console.log(`\nOverall dark mode compliance: ${validation.overall.compliant ? '✅' : '❌'}`);
  
  if (validation.overall.issues.length > 0) {
    console.log('\nIssues found:');
    validation.overall.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  } else {
    console.log('🎉 Dark mode support fully implemented!');
  }
}
