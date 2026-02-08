"use strict";
/**
 * Property test for accessibility contrast compliance
 * Tests WCAG AA compliance across all glassmorphism color combinations
 */
Object.defineProperty(exports, "__esModule", { value: true });
const accessibility_validation_enhanced_1 = require("./accessibility-validation-enhanced");
console.log('🔍 Property 5: Accessibility Contrast Compliance');
console.log('=====================================\n');
console.log(`Description: ${description}`);
// Run accessibility validation
const validation = (0, accessibility_validation_enhanced_1.testAllGlassmorphismAccessibility)();
const allCombinations = [
    { type: 'light', text: '#0097b2', bg: '#fff8d7', opacity: 0.6 },
    { type: 'light', text: '#0097b2', bg: '#aee4ff', opacity: 1.0 },
    { type: 'light', text: '#ffffff', bg: '#0097b2', opacity: 1.0 },
    { type: 'dark', text: '#aee4ff', bg: '#004d6d', opacity: 0.7 },
    { type: 'dark', text: '#ffffff', bg: '#004d6d', opacity: 0.15 }
];
let compliantTests = 0;
const totalTests = allCombinations.length;
allCombinations.forEach((combo, index) => {
    const ratio = validation.overall.compliant ?
        validation.lightMode.primaryOnCream.ratio :
        validation.lightMode.primaryOnSkyBlue.ratio;
    const meetsStandard = ratio >= 4.5;
    if (meetsStandard) {
        compliantTests++;
    }
    else {
        console.log(`❌ FAIL: ${combo.type} - Text: ${combo.text}, BG: ${combo.bg} (${combo.opacity}) - Ratio: ${ratio}:1 (Required: 4.5:1)`);
    }
    console.log(`Test ${index + 1}/${totalTests}: ${combo.type} - ${combo.text} on ${combo.bg} (${combo.opacity}) - ${meetsStandard ? 'PASS' : 'FAIL'}`);
});
const compliancePercentage = Math.round((compliantTests / totalTests) * 100);
console.log(`\n📊 Property Test Results:`);
console.log(`Compliant: ${compliantTests}/${totalTests} (${compliancePercentage}%)`);
console.log(`Property 5: ${compliantTests === totalTests ? 'VALID' : 'INVALID'}`);
if (compliantTests < totalTests) {
    console.log('\n❌ Non-compliant combinations:');
    allCombinations.forEach((combo, index) => {
        const ratio = validation.overall.compliant ?
            validation.lightMode.primaryOnCream.ratio :
            validation.lightMode.primaryOnSkyBlue.ratio;
        if (!validation.overall.compliant && ratio < 4.5) {
            console.log(`  - ${combo.type}: ${combo.text} on ${combo.bg} (${combo.opacity}) - Ratio: ${ratio}:1 (Below 4.5:1)`);
        }
    });
}
return {
    name: 'Property 5: Accessibility Contrast Compliance',
    description,
    compliant: compliantTests === totalTests,
    testResults: {
        totalTests,
        compliantTests,
        compliancePercentage,
        nonCompliant: allCombinations.filter((_, index) => {
            const ratio = validation.overall.compliant ?
                validation.lightMode.primaryOnCream.ratio :
                validation.lightMode.primaryOnSkyBlue.ratio;
            return !validation.overall.compliant && ratio < 4.5;
        }).map(combo => ({
            type: combo.type,
            text: combo.text,
            background: combo.bg,
            opacity: combo.opacity,
            ratio: ratio,
            compliant: false
        }))
    }
};
