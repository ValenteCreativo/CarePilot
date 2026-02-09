/**
 * Unit tests for authentication form glassmorphism
 * Tests auth-form.tsx glassmorphism styling implementation
 */

import { readFileSync } from 'fs';

// Test auth form glassmorphism implementation
export function testAuthFormGlassmorphism(): {
  hasCorrectBackground: boolean;
  hasCorrectBlur: boolean;
  hasCorrectBorder: boolean;
  hasCorrectHover: boolean;
  hasCorrectTransition: boolean;
  hasCorrectShadow: boolean;
  maintainsFunctionality: boolean;
  issues: string[];
} {
  console.log('🔍 Auth Form Glassmorphism Unit Tests');
  console.log('====================================\n');
  
  // Read the auth form component
  const authFormContent = readFileSync('./src/components/auth/auth-form.tsx', 'utf8');
  
  const issues: string[] = [];
  
  // Test 1: Background opacity (bg-card/70)
  const hasCorrectBackground = authFormContent.includes('bg-card/70 backdrop-blur-md');
  if (!hasCorrectBackground) {
    issues.push('Missing bg-card/70 backdrop-blur-md');
  }
  
  // Test 1b: Blur effect
  const hasCorrectBlur = authFormContent.includes('backdrop-blur-md') || authFormContent.includes('backdrop-blur-lg');
  if (!hasCorrectBlur) {
    issues.push('Missing backdrop blur effect');
  }
  
  // Test 2: Border styling (border-white/20)
  const hasCorrectBorder = authFormContent.includes('border-white/20');
  if (!hasCorrectBorder) {
    issues.push('Missing border-white/20');
  }
  
  // Test 3: Hover effect (hover:bg-card/75)
  const hasCorrectHover = authFormContent.includes('hover:bg-card/75');
  if (!hasCorrectHover) {
    issues.push('Missing hover:bg-card/75');
  }
  
  // Test 4: Transition duration (transition-all duration-300)
  const hasCorrectTransition = authFormContent.includes('transition-all duration-300');
  if (!hasCorrectTransition) {
    issues.push('Missing transition-all duration-300');
  }
  
  // Test 5: Shadow presence (shadow-xl)
  const hasCorrectShadow = authFormContent.includes('shadow-xl');
  if (!hasCorrectShadow) {
    issues.push('Missing shadow-xl');
  }
  
  // Test 6: Form inputs visibility and accessibility
  const hasFormInputs = authFormContent.includes('<Input');
  const hasLabels = authFormContent.includes('<Label');
  const hasButton = authFormContent.includes('<Button');
  const maintainsFunctionality = hasFormInputs && hasLabels && hasButton;
  
  if (!maintainsFunctionality) {
    issues.push('Form functionality not maintained');
  }
  
  // Test 7: No @apply directives (Tailwind v4 compliance)
  const hasNoApply = !authFormContent.includes('@apply');
  if (!hasNoApply) {
    issues.push('Contains @apply directive (not Tailwind v4 compliant)');
  }
  
  // Results summary
  const allTestsPassed = issues.length === 0;
  
  console.log('Test Results:');
  console.log('--------------');
  console.log(`✅ Background (bg-card/70): ${hasCorrectBackground ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Border (border-white/20): ${hasCorrectBorder ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Hover (hover:bg-card/75): ${hasCorrectHover ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Transition (duration-300): ${hasCorrectTransition ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Shadow (shadow-xl): ${hasCorrectShadow ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Form Functionality: ${maintainsFunctionality ? 'PASS' : 'FAIL'}`);
  console.log(`✅ No @apply directives: ${hasNoApply ? 'PASS' : 'FAIL'}`);
  
  console.log(`\n📊 Overall: ${allTestsPassed ? 'ALL TESTS PASS' : `${issues.length} TESTS FAIL`}`);
  
  if (issues.length > 0) {
    console.log('\n❌ Issues Found:');
    issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue}`);
    });
  }
  
  return {
    hasCorrectBackground,
    hasCorrectBlur,
    hasCorrectBorder,
    hasCorrectHover,
    hasCorrectTransition,
    hasCorrectShadow,
    maintainsFunctionality,
    issues
  };
}

// Test specific requirements
export function testAuthFormRequirements(): {
  requirement_5_1: boolean; // bg-card/70 backdrop-blur
  requirement_5_2: boolean; // border-white/20  
  requirement_5_3: boolean; // hover:bg-card/75
  allRequirementsMet: boolean;
} {
  const test = testAuthFormGlassmorphism();
  
  return {
    requirement_5_1: test.hasCorrectBackground && test.hasCorrectBlur,
    requirement_5_2: test.hasCorrectBorder,
    requirement_5_3: test.hasCorrectHover,
    allRequirementsMet: test.hasCorrectBackground && test.hasCorrectBlur && 
                     test.hasCorrectBorder && test.hasCorrectHover
  };
}


// Run if called directly
if (typeof require !== 'undefined' && require.main === module) {
  testAuthFormGlassmorphism();
  
  console.log('\n📋 Requirements Validation:');
  console.log('------------------------');
  const reqTest = testAuthFormRequirements();
  console.log(`Requirement 5.1 (bg-card/70 backdrop-blur): ${reqTest.requirement_5_1 ? '✅' : '❌'}`);
  console.log(`Requirement 5.2 (border-white/20): ${reqTest.requirement_5_2 ? '✅' : '❌'}`);
  console.log(`Requirement 5.3 (hover:bg-card/75): ${reqTest.requirement_5_3 ? '✅' : '❌'}`);
  console.log(`\nAll Requirements Met: ${reqTest.allRequirementsMet ? '✅' : '❌'}`);
}
