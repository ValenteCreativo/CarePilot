"use strict";
/**
 * Dark mode validation for glassmorphism design system
 * Tests dark mode variants and smooth transitions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDarkModeClasses = validateDarkModeClasses;
exports.validateDarkModeColors = validateDarkModeColors;
exports.validateDarkModeTransitions = validateDarkModeTransitions;
exports.runDarkModeValidation = runDarkModeValidation;
const fs_1 = require("fs");
// Expected dark mode glassmorphism properties
const EXPECTED_DARK_MODE_CLASSES = [
    '.dark .glass',
    '.dark .glass-cream',
    '.dark .glass-dark',
    '.dark .glass-hover:hover'
];
// Expected dark mode color values
const EXPECTED_COLORS = {
    background: 'rgb(0 77 109 / 0.7)', // Darker blue at 70%
    border: 'rgb(174 228 255 / 0.15)', // Light blue at 15%
    shadow: 'rgb(0 0 0 / 0.3)' // Black shadow
};
// Validate dark mode classes exist
function validateDarkModeClasses(cssContent) {
    const missingClasses = [];
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
function validateDarkModeColors(cssContent) {
    const missingColors = [];
    const incorrectColors = [];
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
function validateDarkModeTransitions(cssContent) {
    const transitionProperties = [];
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
function runDarkModeValidation(cssContent) {
    const classes = validateDarkModeClasses(cssContent);
    const colors = validateDarkModeColors(cssContent);
    const transitions = validateDarkModeTransitions(cssContent);
    const issues = [];
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
    const cssContent = (0, fs_1.readFileSync)('./src/app/globals.css', 'utf8');
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
    }
    else {
        console.log('🎉 Dark mode support fully implemented!');
    }
}
