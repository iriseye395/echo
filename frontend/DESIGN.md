# Design System Specification: Editorial Sonic Immersive

## 1. Overview & Creative North Star
**Creative North Star: "The Obsidian Stage"**

This design system rejects the "utility-first" clutter of standard streaming platforms. Instead, it adopts an editorial, cinematic approach where the interface recedes to allow the music and artist imagery to take center stage. 

The aesthetic is built on **Tonal Depth** and **Intentional Asymmetry**. We break the "grid-box" monotony by using overlapping elements, staggered card layouts, and dramatic typography scales. The goal is to move the user from "managing a library" to "experiencing a performance."

---

## 2. Colors: The Depth of Sound
The palette is rooted in the absence of light, using deep charcoal and midnight tones to create a sense of infinite space.

### The "No-Line" Rule
**Explicit Instruction:** Solid 1px borders are prohibited for sectioning or containment. Boundaries are defined exclusively through background shifts (e.g., a `surface-container-low` component resting on a `surface` background) or subtle tonal transitions.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tokens to "stack" depth:
- **Base Level:** `surface` (#0e0e0e) for the main application background.
- **Secondary Level:** `surface-container-low` (#131313) for large navigation or sidebar areas.
- **Tertiary Level:** `surface-container-highest` (#262626) for active or focused elements like cards.

### The Glass & Gradient Rule
Floating elements (modals, player bars, popovers) must utilize **Glassmorphism**. 
- **Recipe:** Apply `surface-container` colors at 70-80% opacity with a `backdrop-filter: blur(24px)`.
- **Signature Textures:** For high-engagement moments (e.g., "Play" buttons or "Live" indicators), use a linear gradient from `primary` (#ba9eff) to `primary-dim` (#8455ef) at a 135° angle.

---

## 3. Typography: Editorial Authority
We utilize a pairing of **Plus Jakarta Sans** for expressive moments and **Inter** for functional clarity.

| Level | Token | Font Family | Size | Weight | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Plus Jakarta Sans | 3.5rem | 700 | Hero artist names, immersive headers. |
| **Headline** | `headline-md` | Plus Jakarta Sans | 1.75rem | 600 | Album titles, section categories. |
| **Title** | `title-lg` | Inter | 1.375rem | 500 | Playlist titles, modal headers. |
| **Body** | `body-md` | Inter | 0.875rem | 400 | Metadata, descriptions, bios. |
| **Label** | `label-sm` | Inter | 0.6875rem | 600 | Uppercase timestamps, small tags. |

**Hierarchy Note:** Use wide letter-spacing (0.05em) for `label` styles and tight letter-spacing (-0.02em) for `display` styles to create a premium, "custom-type" feel.

---

## 4. Elevation & Depth
In this design system, light does not "hit" the surface; it "glows" from within.

- **The Layering Principle:** Depth is achieved by placing a `surface-container-lowest` (#000000) card on a `surface-container-low` (#131313) section. This creates a "recessed" or "carved" look rather than a shadow-heavy "lifted" look.
- **Ambient Shadows:** For elements that must float (e.g., Context Menus), use a shadow: `0 20px 40px rgba(0, 0, 0, 0.4)`. Never use pure black shadows; tint them with the `primary` color at 4% opacity to mimic the bounce of an electric accent color.
- **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility, use the `outline-variant` token (#494847) at **15% opacity**. 

---

## 5. Components

### Buttons & Sliders
- **Primary Button:** Large, pill-shaped (`full` roundedness). Use the `primary` gradient. No border. Text color: `on_primary` (#39008c).
- **Secondary Button:** `surface-container-highest` background with a subtle "Ghost Border."
- **Audio Sliders:** The track (unplayed) uses `surface-variant`. The progress (played) uses the `secondary` (#5af8fb) accent. The thumb should only appear on hover, using the `secondary_fixed` glow.

### Immersive Cards
- **Construction:** Radius: `xl` (1.5rem). Use `surface-container-highest` for the base.
- **The "No-Divider" Rule:** In tracklists, never use lines. Use a `12px` vertical gap. On hover, the entire row should shift to `surface-bright` (#2c2c2c) with a subtle `4px` left-padding transition.

### Playback Controls
- **Glass Player Bar:** A full-width container at the bottom. Use `surface-container-low` at 80% opacity with a `40px` backdrop-blur. This allows the album art of the "Up Next" queue to bleed through the player bar as the user scrolls.

### Responsive Chips
- **Style:** Pill-shaped, using `surface-container-high` for inactive states and `secondary_container` (#00696b) with `on_secondary_container` (#d9ffff) text for active states.

---

## 6. Do's and Don'ts

### Do
- **Do** use intentional white space. Allow "Display" typography to have at least 64px of breathing room from the nearest element.
- **Do** use the `secondary` (#5af8fb) teal for functional success states and the `tertiary` (#ff97b5) pink for emotional/favorite states.
- **Do** ensure all interactive icons have a minimum touch target of 44x44px, even if the icon itself is only 20px.

### Don't
- **Don't** use 100% white (#FFFFFF) for body text. Use `on_surface_variant` (#adaaaa) to reduce eye strain and maintain the premium dark aesthetic.
- **Don't** use sharp corners. Every element, including input fields and tooltips, must follow the `md` (0.75rem) to `xl` (1.5rem) roundedness scale.
- **Don't** use standard "Drop Shadows." If an element needs to stand out, use Tonal Layering or Glassmorphism.