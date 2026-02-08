"use strict";
/**
 * Performance validation for glassmorphism design system
 * Ensures blur limits and hardware acceleration compliance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlurPerformance = validateBlurPerformance;
exports.validateHardwareAcceleration = validateHardwareAcceleration;
exports.validateReducedMotion = validateReducedMotion;
exports.runPerformanceValidation = runPerformanceValidation;
// Tailwind blur value mappings
const TAILWIND_BLUR_VALUES = {
    'backdrop-blur-sm': '4px', // 4px - Subtle blur
    'backdrop-blur-md': '8px', // 8px - Medium blur (default)
    'backdrop-blur-lg': '16px', // 16px - Large blur (maximum)
    'backdrop-blur-xl': '24px', // 24px - Extra large (use sparingly)
    'backdrop-blur-2xl': '40px', // 40px - Very large (avoid)
};
// Maximum allowed blur for performance
const MAX_BLUR_PX = 16;
// Validate blur values don't exceed performance limits
function validateBlurPerformance(cssString) {
    const violations = [];
    // Check each blur class in the CSS string
    Object.entries(TAILWIND_BLUR_VALUES).forEach(([className, blurValue]) => {
        if (cssString.includes(className)) {
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
    return {
        valid: violations.length === 0,
        violations
    };
}
// Get recommended blur class for performance
function getRecommendedClass(currentBlurPx) {
    if (currentBlurPx <= 4)
        return 'backdrop-blur-sm';
    if (currentBlurPx <= 8)
        return 'backdrop-blur-md';
    if (currentBlurPx <= 16)
        return 'backdrop-blur-lg';
    return 'backdrop-blur-lg'; // Force to maximum allowed
}
// Check hardware acceleration properties
function validateHardwareAcceleration(cssString) {
    const hasWillChange = cssString.includes('will-change');
    const transformProps = ['transform', 'opacity'];
    const hasTransformOnly = cssString.includes('transform') &&
        !cssString.includes('animation') &&
        !cssString.includes('transition');
    // Check if only hardware-accelerated properties are used
    const hardwareAcceleratedProps = ['transform', 'opacity', 'will-change'];
    const usesHardwareAcceleratedProps = hardwareAcceleratedProps.some(prop => cssString.includes(prop));
    return {
        hasWillChange,
        hasTransformOnly,
        usesHardwareAcceleratedProps
    };
}
// Check reduced motion support
function validateReducedMotion(cssString) {
    const hasReducedMotion = cssString.includes('prefers-reduced-motion');
    const hasMotionDisabled = cssString.includes('transition: none') ||
        cssString.includes('transform: none');
    return {
        hasReducedMotion,
        hasMotionDisabled
    };
}
// Run complete performance validation
function runPerformanceValidation(cssContent) {
    const blurPerformance = validateBlurPerformance(cssContent);
    const hardwareAcceleration = validateHardwareAcceleration(cssContent);
    const reducedMotion = validateReducedMotion(cssContent);
    const issues = [];
    if (!blurPerformance.valid) {
        blurPerformance.violations.forEach(violation => {
            issues.push(`Blur violation: ${violation.class} uses ${violation.blurValue} (${violation.recommendation})`);
        });
    }
    if (!hardwareAcceleration.hasWillChange) {
        issues.push('Missing will-change property for hardware acceleration');
    }
    if (!hardwareAcceleration.usesHardwareAcceleratedProps) {
        issues.push('Not using hardware-accelerated properties (transform, opacity)');
    }
    if (!reducedMotion.hasReducedMotion) {
        issues.push('Missing reduced motion support');
    }
    if (!reducedMotion.hasMotionDisabled) {
        issues.push('Reduced motion does not disable animations');
    }
    return {
        blurPerformance,
        hardwareAcceleration,
        reducedMotion,
        overall: {
            compliant: issues.length === 0,
            issues
        }
    };
}
