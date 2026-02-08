# Requirements Document

## Introduction

CarePilot is a Next.js 15 application that provides AI-powered care coordination for caregivers through WhatsApp. The application currently uses Tailwind CSS v4 with a distinctive color palette of Sky Blue (#aee4ff) and Cream Yellow (#fff8d7). While some components already implement partial glassmorphism effects (auth forms with `bg-card/70 backdrop-blur` and benefit cards with `bg-card/60`), the implementation is inconsistent and incomplete across the application.

This feature will establish a comprehensive glassmorphism design system that creates a modern, premium "frosted glass" aesthetic throughout the entire application. The system will provide reusable utility classes, consistent styling patterns, and enhanced visual hierarchy while maintaining accessibility standards and optimal performance.

## Glossary

- **Glassmorphism**: A design style that creates a "frosted glass" effect using transparency, backdrop blur, and subtle borders to create depth and visual hierarchy
- **Design_System**: The complete set of reusable utility classes, patterns, and guidelines for implementing glassmorphism across the application
- **Utility_Class**: A reusable CSS class defined in globals.css that encapsulates glassmorphism styling patterns
- **Backdrop_Blur**: A CSS filter effect that blurs the content behind an element, creating the frosted glass appearance
- **Opacity_Value**: The transparency level of a background color, expressed as a percentage (e.g., /40 = 40%, /70 = 70%)
- **Hover_Effect**: Visual feedback when a user interacts with an element, including opacity changes, transforms, and shadow enhancements
- **Accessibility_Compliance**: Meeting WCAG AA standards, including minimum 4.5:1 text contrast ratio
- **Performance_Optimization**: Techniques to ensure smooth rendering, including blur limits and hardware acceleration hints
- **Landing_Page**: The marketing page at src/app/(marketing)/page.tsx containing hero, value props, how it works, pricing, and trust sections
- **Dashboard_Components**: Interactive components in the authenticated area including analytics widgets and kanban cards
- **Auth_Components**: Authentication forms for login and signup at src/components/auth/auth-form.tsx
- **Tailwind_v4**: The CSS framework version used, which requires specific syntax (RGB with opacity, no @apply directive)
- **Color_Palette**: The application's color scheme including Sky Blue (#aee4ff), Cream Yellow (#fff8d7), and Primary (#0097b2)

## Requirements

### Requirement 1: Glassmorphism Utility Classes System

**User Story:** As a developer, I want reusable glassmorphism utility classes in globals.css, so that I can consistently apply frosted glass effects across all components without duplicating code.

#### Acceptance Criteria

1. WHEN the globals.css file is updated, THE Design_System SHALL define a `.glass` utility class with 60% opacity background, medium backdrop blur, subtle border, and soft shadow
2. WHEN the globals.css file is updated, THE Design_System SHALL define a `.glass-cream` utility class using the Cream Yellow color with 60% opacity and medium backdrop blur
3. WHEN the globals.css file is updated, THE Design_System SHALL define a `.glass-dark` utility class for dark mode with adjusted opacity values
4. WHEN the globals.css file is updated, THE Design_System SHALL define a `.glass-hover` utility class that increases opacity, adds vertical lift, and enhances shadow on hover
5. THE Design_System SHALL use Tailwind v4 compatible syntax with RGB color values and opacity modifiers
6. THE Design_System SHALL NOT use the @apply directive as it is not supported in Tailwind v4
7. WHEN dark mode is active, THE Design_System SHALL apply adjusted opacity values to maintain visual hierarchy

### Requirement 2: Landing Page Value Proposition Cards Enhancement

**User Story:** As a visitor, I want the benefit cards on the landing page to have a premium frosted glass appearance with smooth hover effects, so that the interface feels modern and engaging.

#### Acceptance Criteria

1. WHEN a user views the landing page, THE Landing_Page SHALL display value proposition cards with 60% opacity cream background and medium backdrop blur
2. WHEN a user views the landing page, THE Landing_Page SHALL display value proposition cards with subtle borders at 10% primary color opacity
3. WHEN a user hovers over a value proposition card, THE Landing_Page SHALL increase the card opacity to 70%
4. WHEN a user hovers over a value proposition card, THE Landing_Page SHALL translate the card upward by 2 pixels
5. WHEN a user hovers over a value proposition card, THE Landing_Page SHALL enhance the shadow to create depth
6. THE Landing_Page SHALL apply transitions smoothly over 300 milliseconds for all hover effects

### Requirement 3: Landing Page "How It Works" Section Enhancement

**User Story:** As a visitor, I want the "How It Works" step cards to have consistent glassmorphism styling, so that the visual design is cohesive and the information hierarchy is clear.

#### Acceptance Criteria

1. WHEN a user views the "How It Works" section, THE Landing_Page SHALL display step cards with 70% opacity cream background and medium backdrop blur
2. WHEN a user views the "How It Works" section, THE Landing_Page SHALL display step cards with borders at 10% primary color opacity
3. WHEN a user hovers over a step card, THE Landing_Page SHALL increase backdrop blur to large (16px)
4. WHEN a user hovers over a step card, THE Landing_Page SHALL translate the card upward by 4 pixels
5. THE Landing_Page SHALL maintain the existing step number badges and icon styling while applying glassmorphism to the card container

### Requirement 4: Landing Page Pricing Card Enhancement

**User Story:** As a visitor, I want the pricing card to stand out with enhanced glassmorphism effects, so that the subscription offering is visually prominent and appealing.

#### Acceptance Criteria

1. WHEN a user views the pricing section, THE Landing_Page SHALL display the pricing card with 60% opacity cream background and large backdrop blur (16px)
2. WHEN a user views the pricing section, THE Landing_Page SHALL display the pricing card with a 20% opacity border
3. WHEN a user hovers over the pricing card, THE Landing_Page SHALL increase backdrop blur intensity
4. WHEN a user hovers over the pricing card, THE Landing_Page SHALL enhance the shadow to create premium depth
5. THE Landing_Page SHALL maintain all existing pricing content and layout while applying glassmorphism effects

### Requirement 5: Authentication Form Enhancement

**User Story:** As a user, I want the authentication forms to have refined glassmorphism styling with subtle hover effects, so that the login and signup experience feels polished and modern.

#### Acceptance Criteria

1. WHEN a user views the auth form, THE Auth_Components SHALL display the form card with 70% opacity background and backdrop blur
2. WHEN a user views the auth form, THE Auth_Components SHALL display the form card with a refined border at 20% opacity
3. WHEN a user hovers over the auth form card, THE Auth_Components SHALL apply subtle visual feedback with increased opacity
4. THE Auth_Components SHALL maintain the existing bg-card/70 backdrop-blur base while adding border and hover enhancements
5. THE Auth_Components SHALL ensure form inputs remain clearly visible and accessible against the glassmorphism background

### Requirement 6: Dashboard Analytics Widgets Enhancement

**User Story:** As a logged-in user, I want the analytics dashboard widgets to use glassmorphism styling, so that the dashboard has a modern, cohesive appearance.

#### Acceptance Criteria

1. WHEN a user views the analytics dashboard, THE Dashboard_Components SHALL display metric cards with 60% opacity card background and medium backdrop blur
2. WHEN a user views the analytics dashboard, THE Dashboard_Components SHALL display metric cards with borders at 10% primary color opacity
3. WHEN a user views the analytics dashboard, THE Dashboard_Components SHALL display the message volume chart card with the same glassmorphism treatment
4. WHEN a user views the analytics dashboard, THE Dashboard_Components SHALL replace solid bg-background/80 with glassmorphism utility classes
5. THE Dashboard_Components SHALL maintain all existing chart functionality and data visualization while applying glassmorphism effects

### Requirement 7: Dashboard Actions Kanban Cards Enhancement

**User Story:** As a logged-in user, I want the kanban action cards to have glassmorphism styling, so that the task management interface feels modern and visually organized.

#### Acceptance Criteria

1. WHEN a user views the actions kanban, THE Dashboard_Components SHALL display action cards with 60% opacity card background and medium backdrop blur
2. WHEN a user views the actions kanban, THE Dashboard_Components SHALL display action cards with borders at 10% primary color opacity
3. WHEN a user views the actions kanban, THE Dashboard_Components SHALL display empty state cards with dashed borders and glassmorphism effects
4. WHEN a user views the actions kanban, THE Dashboard_Components SHALL replace solid bg-background/80 with glassmorphism utility classes
5. THE Dashboard_Components SHALL maintain all existing kanban functionality including drag-drop interactions while applying glassmorphism effects

### Requirement 8: Accessibility Compliance

**User Story:** As a user with visual impairments, I want all glassmorphism elements to maintain sufficient text contrast, so that I can read and interact with the application effectively.

#### Acceptance Criteria

1. WHEN glassmorphism effects are applied, THE Design_System SHALL ensure text contrast ratio meets WCAG AA standard of 4.5:1 minimum
2. WHEN glassmorphism effects are applied, THE Design_System SHALL ensure interactive elements have clearly visible focus states
3. WHEN glassmorphism effects are applied, THE Design_System SHALL ensure borders and shadows provide sufficient visual separation
4. THE Design_System SHALL test all color combinations against the Color_Palette to verify accessibility compliance
5. WHEN dark mode is active, THE Design_System SHALL maintain accessibility standards with adjusted contrast ratios

### Requirement 9: Performance Optimization

**User Story:** As a mobile user, I want glassmorphism effects to render smoothly without lag, so that the application remains responsive and performant on my device.

#### Acceptance Criteria

1. WHEN backdrop blur is applied, THE Design_System SHALL limit blur radius to maximum 16px to maintain performance
2. WHEN hover effects include transforms, THE Design_System SHALL add will-change: backdrop-filter to animated elements
3. WHEN a user has motion sensitivity preferences, THE Design_System SHALL respect prefers-reduced-motion and disable animations
4. THE Design_System SHALL use hardware-accelerated CSS properties (transform, opacity) for animations
5. WHEN glassmorphism effects are applied, THE Design_System SHALL avoid layout shifts and repaints during interactions

### Requirement 10: Dark Mode Support

**User Story:** As a user who prefers dark mode, I want glassmorphism effects to adapt appropriately, so that the frosted glass aesthetic works well in both light and dark themes.

#### Acceptance Criteria

1. WHEN dark mode is active, THE Design_System SHALL adjust glassmorphism opacity values to maintain visual hierarchy
2. WHEN dark mode is active, THE Design_System SHALL use appropriate border colors with adjusted opacity
3. WHEN dark mode is active, THE Design_System SHALL ensure text contrast remains WCAG AA compliant
4. THE Design_System SHALL define dark mode variants for all glassmorphism utility classes
5. WHEN a user toggles between light and dark mode, THE Design_System SHALL transition smoothly without visual jarring

### Requirement 11: Responsive Design Compatibility

**User Story:** As a mobile user, I want glassmorphism effects to work correctly on small screens, so that the application looks professional on all devices.

#### Acceptance Criteria

1. WHEN the application is viewed on mobile devices, THE Design_System SHALL maintain glassmorphism effects without performance degradation
2. WHEN the application is viewed on mobile devices, THE Design_System SHALL ensure touch targets remain accessible with glassmorphism styling
3. WHEN the application is viewed on mobile devices, THE Design_System SHALL adjust blur intensity if needed for performance
4. THE Design_System SHALL test glassmorphism effects on viewport widths from 320px to 1920px
5. WHEN the viewport size changes, THE Design_System SHALL maintain visual consistency across breakpoints

### Requirement 12: Hover Effect Consistency

**User Story:** As a user, I want all interactive glassmorphism elements to have consistent hover feedback, so that the interface feels cohesive and predictable.

#### Acceptance Criteria

1. WHEN a user hovers over any glassmorphism card, THE Design_System SHALL apply consistent opacity increase patterns
2. WHEN a user hovers over any glassmorphism card, THE Design_System SHALL apply consistent transform patterns (translate Y -2px or -4px)
3. WHEN a user hovers over any glassmorphism card, THE Design_System SHALL apply consistent shadow enhancement patterns
4. THE Design_System SHALL use consistent transition timing (300ms) across all hover effects
5. WHEN a user hovers over non-interactive glassmorphism elements, THE Design_System SHALL NOT apply hover effects
