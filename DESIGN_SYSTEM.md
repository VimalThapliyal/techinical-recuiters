# Design System - World-Class UI/UX Standards

## Design Principles

### 1. **Simplicity First**
- Clean, uncluttered interfaces
- Clear visual hierarchy
- Minimal cognitive load
- Purposeful whitespace

### 2. **Performance**
- Fast loading times
- Smooth 60fps animations
- Optimized images
- Lazy loading where appropriate

### 3. **Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast ratios
- Focus indicators

### 4. **Mobile-First**
- Touch-friendly targets (min 44x44px)
- Responsive typography
- Optimized layouts for all screen sizes
- Gesture-friendly interactions

### 5. **Visual Polish**
- Consistent spacing system
- Refined typography scale
- Subtle shadows and borders
- Smooth transitions (200-300ms)
- Micro-interactions

## Spacing System

Based on 4px grid:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

## Typography Scale

- `text-xs`: 12px (0.75rem)
- `text-sm`: 14px (0.875rem)
- `text-base`: 16px (1rem)
- `text-lg`: 18px (1.125rem)
- `text-xl`: 20px (1.25rem)
- `text-2xl`: 24px (1.5rem)
- `text-3xl`: 30px (1.875rem)
- `text-4xl`: 36px (2.25rem)

## Color System

### Primary
- `primary`: #0077b5 (LinkedIn Blue)
- `primary-hover`: #004182
- `primary-light`: #e7f3f8

### Neutrals
- `background`: #ffffff
- `surface`: #f9fafb
- `border`: #e5e7eb
- `text-primary`: #111827
- `text-secondary`: #6b7280
- `text-muted`: #9ca3af

## Animation Principles

- **Duration**: 150-300ms for interactions
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)
- **Stagger**: 50-100ms between items
- **Hover**: Subtle scale (1.02-1.05) or color shift
- **Focus**: Clear ring indicators

## Component Standards

### Buttons
- Minimum touch target: 44x44px
- Clear visual feedback
- Loading states
- Disabled states

### Cards
- Subtle shadows (0 1px 3px rgba(0,0,0,0.1))
- Rounded corners (8-12px)
- Hover: slight elevation increase
- Consistent padding

### Forms
- Clear labels
- Helpful error messages
- Focus states
- Validation feedback

## Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Alt text for images
- [ ] ARIA labels where needed
- [ ] Semantic HTML
- [ ] Screen reader friendly

