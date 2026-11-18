---
name: Iquitos Glamour Discovery
colors:
  surface: '#fff7fc'
  surface-dim: '#e0d8de'
  surface-bright: '#fff7fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf1f8'
  surface-container: '#f4ebf2'
  surface-container-high: '#eee6ec'
  surface-container-highest: '#e9e0e7'
  on-surface: '#1e1a1f'
  on-surface-variant: '#514347'
  inverse-surface: '#332f34'
  inverse-on-surface: '#f7eef5'
  outline: '#847377'
  outline-variant: '#d6c1c6'
  surface-tint: '#8b4a60'
  primary: '#8b4a60'
  on-primary: '#ffffff'
  primary-container: '#d98da5'
  on-primary-container: '#5e263b'
  inverse-primary: '#ffb0c8'
  secondary: '#874c63'
  on-secondary: '#ffffff'
  secondary-container: '#ffb4ce'
  on-secondary-container: '#7b4259'
  tertiary: '#1b6d24'
  on-tertiary: '#ffffff'
  tertiary-container: '#65b562'
  on-tertiary-container: '#00440d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e2'
  primary-fixed-dim: '#ffb0c8'
  on-primary-fixed: '#39081d'
  on-primary-fixed-variant: '#6f3349'
  secondary-fixed: '#ffd9e4'
  secondary-fixed-dim: '#fcb2cc'
  on-secondary-fixed: '#370a1f'
  on-secondary-fixed-variant: '#6c354b'
  tertiary-fixed: '#a3f69c'
  tertiary-fixed-dim: '#88d982'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005312'
  background: '#fff7fc'
  on-background: '#1e1a1f'
  surface-variant: '#e9e0e7'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system caters to modern local discovery and curated self-care within Iquitos, Peru—blending tropical vibrance with high-end editorial pampering. The interface balances cartographic clarity with tactile, sophisticated salon editorial aesthetics.

- **Target Audience:** Urban trendsetters, busy professionals, and visitors seeking premier nail, hair, and spa services in Iquitos.
- **Emotional Response:** Trustworthy, serene, indulgence-oriented, clear, and effortless under direct sun or humid twilight settings.
- **Aesthetic Direction:** Modern Minimalist Cartography combined with Soft Editorial Luxury. Crisp geometric layout structures frame floating semi-translucent glass panels, delicate rose-tinted interactive nodes, and authoritative deep-wine typography.

## Colors

The color palette captures the elegance of beauty rituals alongside crisp cartographic contrast suitable for mobile navigation through Amazonian city streets.

- **Primary Rose (`#D98DA5`):** Primary interactions, floating action accents, active tab bars, and highlight rings.
- **Deep Wine (`#8E5269`):** High-priority callouts, critical filter badges, active map marker silhouettes, and headline anchors.
- **Soft Rose (`#F4DDE4`):** Passive fills, chip backgrounds, soft hover states, and card header washes.
- **Background Light (`#FFFDFB`):** Warm, porcelain canvas preventing cold screen glare.
- **Light Neutral (`#F5F3F4`):** Map base canvas, secondary pill fills, and panel surface-containers.
- **Text Dark (`#29252A`):** Core typography, high-contrast street labels, and crisp icon outlines.
- **Accent Emerald (`#2E7D32`):** Verified salon authentications, real-time availability badges, and confirmed booking statuses.

Cartographic features utilize muted desaturated base tiles (`#F5F3F4` ground, `#EBE7E8` roads, `#E3ECF0` Amazon riverfront accents) to let vibrant salon pins take center stage.

## Typography

The type system blends the high-fashion, editorial flair of **Playfair Display** with the geometric legibility and friendly openness of **Plus Jakarta Sans**.

- **Editorial Headings (Playfair Display):** Used selectively for salon titles, feature curations, and promotional callouts to instill luxury and craftsmanship.
- **Interface & Cartographic Data (Plus Jakarta Sans):** Handles maps, schedules, category filter tabs, pricing, and directions. Its optical clarity guarantees readability even on small screens under intense equatorial light.
- **Casing & Hierarchy:** Micro-labels and verification badges use uppercase styling with slight positive letter spacing (`letterSpacing: 0.04em`) to maintain legibility at tiny scale.

## Layout & Spacing

The application operates as a **Map-First Fluid Canvas** overlaid with modular sliding sheets, bottom cards, and floating floating toolbars.

- **Mobile Canvas:** Map fills 100% viewport. Overlays adhere to a three-tier sheet layout: collapsed peek (110px, showcasing nearest salon), half-screen discovery scroll (45vh), and full-screen detailed profile.
- **Desktop & Tablet Canvas:** 12-column responsive layout with fluid map background. The left quadrant reserves a 400px–460px fixed discovery sidebar for listing, search, and service filters, leaving the remainder unobstructed for interactive navigation.
- **Rhythm:** Spacing follows a predictable 4px/8px modular base, standardizing gaps within lists, chips, and booking flow dialogs.

## Elevation & Depth

Visual hierarchy achieves depth through soft, tinted ambient shadows and frosted surface containment rather than heavy borders or dark drop shadows:

- **Level 0 (Map Canvas):** Base cartography layer, completely flat.
- **Level 1 (Inline Elements & List Cards):** Background `#FFFDFB` with a subtle 1px border of `#F4DDE4` and an ambient tint shadow: `0px 2px 8px rgba(142, 82, 105, 0.04)`.
- **Level 2 (Floating Action Buttons & Search Bars):** Frosted glass styling (`background: rgba(255, 253, 251, 0.88)`, `backdrop-filter: blur(12px)`) with `0px 4px 20px rgba(41, 37, 42, 0.08)`.
- **Level 3 (Interactive Map Pins & Salon Highlight Sheets):** `0px 12px 32px rgba(142, 82, 105, 0.16)` paired with crisp `#FFFDFB` edge rings.
- **Level 4 (Modals & Gallery Lightboxes):** Ambient dim overlay of `rgba(41, 37, 42, 0.40)` with sheet elevation: `0px 24px 48px rgba(41, 37, 42, 0.20)`.

## Shapes

The interface embraces a gentle, welcoming contour standard (`roundedness: 2` = 0.5rem / 8px default, scaled to 1rem / 16px on larger panels and modals) to reflect the organic, fluid essence of self-care and nail artistry.

- **Interactive Filters & Badges:** Full-pill radiuses (9999px) for tactile, touch-friendly tapping.
- **Cards, Sheets & Carousels:** 16px (`rounded-lg`) curvature along mobile upper sheet corners and desktop cards.
- **Map Pins:** Custom drop pin featuring an inverted teardrop with a perfectly circular 28px inner showcase displaying custom mini-icons (scissors, nail polish bottles, facial treatment icons).

## Components

### Buttons
- **Primary:** Solid `#D98DA5` fill with `#FFFDFB` text. On hover, shifts to `#8E5269`. Height: 48px on mobile, 44px on desktop. Fully rounded pill or 8px corners with smooth 150ms transitions.
- **Secondary / Outline:** 1.5px border of `#8E5269` with `#8E5269` text and transparent background. Hover state fills with `#F4DDE4` at 50% opacity.
- **Floating Map Triggers:** Circular 48x48px white surface container with centered Deep Wine icons, elevated at Level 2.

### Map Pins & Markers
- **Standard Pin:** Deep Wine `#8E5269` droplet base with a Soft Rose `#F4DDE4` core badge.
- **Selected / Featured Pin:** Scaled up 1.25x with Primary Rose `#D98DA5` ring, pulsing ambient halo, and an attached price or rating tooltip pill.
- **Verified Cluster Badge:** `#2E7D32` emerald micro-check anchored at the top-right corner.

### Chips & Filter Pills
- **Inactive:** `#F5F3F4` fill with `#29252A` text; subtle hover fill of `#F4DDE4`.
- **Active:** `#8E5269` solid fill with `#FFFDFB` bold text and an optional cross icon for quick removal. Height: 34px.

### Cards (Salon Preview & Booking Cards)
- **Compact Sheet Card:** Horizontal layout with a 72x72px rounded image thumbnail, salon title in `headline-sm`, distance rating indicator, and direct "Book" button.
- **Featured Card:** Full-bleed image header with a Soft Rose price tag overlay, verified emerald seal, and instant appointment slot chips along the bottom.

### Inputs & Search Bars
- Floating pill-shaped bar with integrated search icon, clear-text button, and quick-filter trigger.
- Text inputs utilize `#FFFDFB` background, an inset border of `#F4DDE4`, and an active focus outline of 2px `#D98DA5` with zero offset.

### Checkboxes & Radio Buttons
- Rounded check containers with `#D98DA5` active fills and crisp white check icons. Unchecked borders set in `#8E5269` at 40% opacity.