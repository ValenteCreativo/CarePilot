/**
 * Performance validation for glassmorphism design system
 * Ensures blur limits and hardware acceleration compliance
 */

// Tailwind blur value mappings
const TAILWIND_BLUR_VALUES = {
  'backdrop-blur-sm': '4px',   // 4px - Subtle blur
  'backdrop-blur-md': '8px',   // 8px - Medium blur (default)
  'backdrop-blur-lg': '16px',  // 16px - Large blur (maximum)
  'backdrop-blur-xl': '24px',  // 24px - Extra large (use sparingly)
  'backdrop-blur-2xl': '40px', // 40px - Very large (avoid)
} as const;

// Maximum allowed blur for performance
const MAX_BLUR_PX = 16;

// Validate blur values don't exceed performance limits
export function validateBlurPerformance(cssString: string): {
  valid: boolean;
  violations: Array<{ class: string; blurValue: string; recommendation: string }>;
} {
  const violations: Array<{ class: string; blurValue: string; recommendation: string }> = [];
  
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
function getRecommendedClass(currentBlurPx: number): string {
  if (currentBlurPx <= 4) return 'backdrop-blur-sm';
  if (currentBlurPx <= 8) return 'backdrop-blur-md';
  if (currentBlurPx <= 16) return 'backdrop-blur-lg';
  return 'backdrop-blur-lg'; // Force to maximum allowed
}

// Check hardware acceleration properties
export function validateHardwareAcceleration(cssString: string): {
  hasWillChange: boolean;
  hasTransformOnly: boolean;
  usesHardwareAcceleratedProps: boolean;
} {
  const hasWillChange = cssString.includes('will-change');
  const transformProps = ['transform', 'opacity'];
  const hasTransformOnly = cssString.includes('transform') && 
    !cssString.includes('animation') && 
    !cssString.includes('transition');
  
  // Check if only hardware-accelerated properties are used
  const hardwareAcceleratedProps = ['transform', 'opacity', 'will-change'];
  const usesHardwareAcceleratedProps = hardwareAcceleratedProps.some(prop => 
    cssString.includes(prop)
  );
  
  return {
    hasWillChange,
    hasTransformOnly,
    usesHardwareAcceleratedProps
  };
}

// Check reduced motion support
export function validateReducedMotion(cssString: string): {
  hasReducedMotion: boolean;
  hasMotionDisabled: boolean;
} {
  const hasReducedMotion = cssString.includes('prefers-reduced-motion');
  const hasMotionDisabled = cssString.includes('transition: none') || 
    cssString.includes('transform: none');
  
  return {
    hasReducedMotion,
    hasMotionDisabled
  };
}

// Run complete performance validation
export function runPerformanceValidation(cssContent: string): {
  blurPerformance: ReturnType<typeof validateBlurPerformance>;
  hardwareAcceleration: ReturnType<typeof validateHardwareAcceleration>;
  reducedMotion: ReturnType<typeof validateReducedMotion>;
  overall: {
    compliant: boolean;
    issues: string[];
  };
} {
  const blurPerformance = validateBlurPerformance(cssContent);
  const hardwareAcceleration = validateHardwareAcceleration(cssContent);
  const reducedMotion = validateReducedMotion(cssContent);
  
  const issues: string[] = [];
  
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
