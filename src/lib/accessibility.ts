/**
 * Accessibility utilities for glassmorphism design system
 * Implements WCAG AA contrast ratio validation (4.5:1 minimum)
 */

// RGB to hex conversion
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Hex to RGB conversion
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// Calculate effective background color with opacity
export function getEffectiveBackgroundColor(
  backgroundColor: string,
  overlayColor: string,
  opacity: number
): string {
  const bgRgb = hexToRgb(backgroundColor);
  const overlayRgb = hexToRgb(overlayColor);
  
  if (!bgRgb || !overlayRgb) return backgroundColor;
  
  const r = Math.round(bgRgb.r * (1 - opacity) + overlayRgb.r * opacity);
  const g = Math.round(bgRgb.g * (1 - opacity) + overlayRgb.g * opacity);
  const b = Math.round(bgRgb.b * (1 - opacity) + overlayRgb.b * opacity);
  
  return rgbToHex(r, g, b);
}

// Test WCAG AA compliance
export function testWCAGCompliance(
  textColor: string,
  backgroundColor: string,
  overlayColor?: string,
  overlayOpacity?: number
): { compliant: boolean; ratio: number; minimum: number } {
  const effectiveBg = overlayColor && overlayOpacity !== undefined
    ? getEffectiveBackgroundColor(backgroundColor, overlayColor, overlayOpacity)
    : backgroundColor;
    
  const ratio = getContrastRatio(textColor, effectiveBg);
  const minimum = 4.5; // WCAG AA standard
  
  return {
    compliant: ratio >= minimum,
    ratio: Math.round(ratio * 100) / 100,
    minimum
  };
}

// Test all glassmorphism color combinations
export function validateGlassmorphismAccessibility(): {
  primaryOnCream: ReturnType<typeof testWCAGCompliance>;
  primaryOnSkyBlue: ReturnType<typeof testWCAGCompliance>;
  whiteOnPrimary: ReturnType<typeof testWCAGCompliance>;
  darkModeVariants: {
    primaryOnDarkBlue: ReturnType<typeof testWCAGCompliance>;
    whiteOnLightBlue: ReturnType<typeof testWCAGCompliance>;
  };
} {
  // Light mode tests
  const primaryOnCream = testWCAGCompliance(
    '#0097b2', // Primary blue text
    '#aee4ff', // Sky blue background
    '#fff8d7', // Cream overlay
    0.6 // 60% opacity
  );
  
  const primaryOnSkyBlue = testWCAGCompliance(
    '#0097b2', // Primary blue text
    '#aee4ff'  // Sky blue background
  );
  
  const whiteOnPrimary = testWCAGCompliance(
    '#ffffff', // White text
    '#0097b2'  // Primary blue background
  );
  
  // Dark mode tests
  const primaryOnDarkBlue = testWCAGCompliance(
    '#aee4ff', // Light blue text
    '#003d5c', // Dark blue background
    '#004d6d', // Medium blue overlay
    0.7 // 70% opacity
  );
  
  const whiteOnLightBlue = testWCAGCompliance(
    '#ffffff', // White text
    '#004d6d', // Medium blue background
    '#aee4ff', // Light blue overlay
    0.15 // 15% opacity
  );
  
  return {
    primaryOnCream,
    primaryOnSkyBlue,
    whiteOnPrimary,
    darkModeVariants: {
      primaryOnDarkBlue,
      whiteOnLightBlue
    }
  };
}
