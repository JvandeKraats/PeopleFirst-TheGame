# PeopleFirst Game - AI Coding Agent Instructions

> **CRITICAL**: This project uses light/dark mode theming. ALWAYS use CSS variables (`var(--pf-*)`) instead of hardcoded colors. See the [Styling & Theming](#styling--theming) section.

## Project Overview

This is a Vue 3 + Vite web application for colleague recognition games. The app includes multiple game modes (easy/hard name guessing, matching, memory, and CAPTCHA-style Jesse finder).

**Tech Stack:**
- Vue 3 (Composition API with `<script setup>`)
- Vue Router (lazy-loaded routes)
- CSS Variables for theming (light/dark mode)
- LocalStorage for score persistence

## Adding New Game Modes

### Required Steps (Execute in Order)

Follow these steps exactly when adding a new game mode:

#### Step 1: Create Game Component (`src/components/`)

**Purpose:** Render UI and handle interactions  
**Must do:**
- Accept props: `collegas` (Array), any game-specific props
- Emit `@submit` event with score object when game completes
- Use CSS variables for all styling (NO hardcoded colors)
- Import photo utilities: `import { getFallbackAvatarUrl } from '../utils/photo'`
- Use computed property for fallback: `fallbackAvatarUrl() { return getFallbackAvatarUrl() }`
- Include error handling for images: `@error="(e) => (e.target.src = fallbackAvatarUrl)"`

```vue
<script>
import { getFallbackAvatarUrl } from '../utils/photo'

export default {
  props: {
    collegas: { type: Array, required: true }
  },
  computed: {
    fallbackAvatarUrl() {
      return getFallbackAvatarUrl()
    }
  },
  methods: {
    handleSubmit() {
      const score = { /* calculate score */ };
      this.$emit('submit', score);
    }
  }
}
</script>
```

#### Step 2: Create View Component (`src/views/`)

**Purpose:** Load data and manage game state  
**Must do:**
- Import from `'../data/people-fallback.json'`
- Add `normalizePhotoUrl` function to handle base URL properly (see pattern below)
- Shuffle data: `people.slice().sort(() => Math.random() - 0.5)`
- Use `normalizePhotoUrl()` for all photo paths from data
- Handle `@submit` event: store score in `localStorage.setItem('gameScore', JSON.stringify(score))`
- Navigate to result page: `this.$router.push('/result')` or custom result route

```vue
<script>
import GameComponent from '../components/YourGameComponent.vue';
import fallbackPeople from '../data/people-fallback.json';

function normalizePhotoUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const base = import.meta.env.BASE_URL
  if (url.startsWith('/')) return `${base}${url.slice(1)}`
  return new URL(url, base).href
}

export default {
  components: { GameComponent },
  data() {
    return { collegas: [] };
  },
  created() {
    const people = fallbackPeople?.value || [];
    this.collegas = this.shuffle(people).slice(0, 10).map(p => ({
      ...p,
      link: normalizePhotoUrl(p.photo || '/fallback-photos/fallback-avatar.png')
    }));
  },
  methods: {
    shuffle(arr) {
      return arr.slice().sort(() => Math.random() - 0.5);
    },
      return arr.slice().sort(() => Math.random() - 0.5);
    },
    handleSubmit(score) {
      localStorage.setItem('gameScore', JSON.stringify(score));
      this.$router.push('/result');
    }
  }
};
</script>
```

#### Step 3: Add Route (`src/router/index.js`)

**Must use lazy loading:**

```javascript
{
  path: '/your-game',
  name: 'yourGame',
  component: () => import('../views/YourGameView.vue')
}
```

#### Step 4: Add Navigation Button (`src/views/StartView.vue`)

**Add function in `<script setup>`:**
```javascript
function goToYourGame() {
  router.push('/your-game')
}
```

**Add button in template:**
```vue
<button class="start-button start-button--secondary" @click="goToYourGame">
  Your Game Mode
</button>
<div class="mode-hint">
  Brief description of the game mechanics.
</div>
```

**Button Style Classes:**
- `start-button` - Default green primary button
- `start-button--secondary` - White/outlined secondary button
- `start-button--danger` - Red danger button
- `start-button--xebia` - Purple Xebia-branded button



## Shared vs. Unique Components

### Shared Components

**`TheResult.vue`** - Used by standard game modes (easy, hard, match, memory)
- Displays score out of 10
- Shows "Missed names" section
- Supports time tracking and close misses
- **Use when:** Your game fits the standard scoring pattern (correct vs. incorrect answers)

### When to Create Unique Components

Create a **dedicated result component** when:
- You need different scoring display (e.g., "8 / 9 correct tiles" instead of "8 / 10")
- You have multiple categories of errors (e.g., "Missed Jesses" vs "Not the Jesse")
- The game mechanics don't fit the standard pattern

**Example:** `FindJesseResult.vue` was created because:
- SResult Components: Shared vs. Unique

### Decision Tree

**Use shared `TheResult.vue` when:**
- ✅ Scoring is X out of 10 questions
- ✅ Single "wrong answers" list is sufficient
- ✅ Standard game flow (10 rounds, right/wrong binary)

**Create unique result component when:**
- ❌ Different total (e.g., 9 tiles instead of 10 questions)
- ❌ Multiple error categories needed (e.g., false positives vs. false negatives)
- ❌ Non-standard scoring display

### Standard Score Object (TheResult.vue)

```javascript
{
  scoreOutOf10: "7.5",        // String with 1 decimal place
  totalGoodAnswers: 7,        // Integer count
  wrongAnswers: [             // Array of objects
    {
      name: "FirstName",      // Required
      imgUrl: "/path.jpg"     // Required (or link/photo)
    }
  ],
  mode: "easy",               // Optional
  elapsed: "01:23"            // Optional (time tracking)
}
```

### Creating a Custom Result Component

**Example:** `FindJesseResult.vue` (reference implementation)
⚠️ CRITICAL: CSS Variables for Light/Dark Mode

**NECSS Variable Reference

**Theme Colors (Always same in light/dark):**
- `--pf-accent` → `#2ea44f` (green) - Primary actions, progress bars
- `--pf-danger` → `#d32f2f` (red) - Errors, delete actions

**Adaptive Colors (Change with theme):**

| Purpose | Variable | Light Value | Dark Value |
|---------|----------|-------------|------------|
| **Page background** | `--pf-bg` | `#f7f8fa` | `#0f1115` |
| **Card/surface** | `--pf-surface` | `#ffffff` | `#161a22` |
| **Subtle surface** | `--pf-surface-2` | `#f6f6f6` | `rgba(255,255,255,0.06)` |
| **Primary text** | `--pf-text` | `#111111` | `rgba(255,255,255,0.92)` |
| **Muted text** | `--pf-muted` | `rgba(0,0,0,0.60)` | `rgba(255,255,255,0.65)` |
| **Less muted** | `--pf-muted-2` | `rgba(0,0,0,0.72)` | `rgba(255,255,255,0.75)` |
| **Placeholder** | `--pf-placeholder` | `rgba(0,0,0,0.45)` | `rgba(255,255,255,0.45)` |
| **Standard border** | `--pf-border` | `rgba(0,0,0,0.12)` | `rgba(255,255,255,0.12)` |
| **Strong border** | `--pf-border-strong` | `rgba(0,0,0,0.18)` | `rgba(255,255,255,0.18)` |
| **Soft border** | `--pf-border-soft` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.10)` |
| **Hover background** | `--pf-hover` | `rgba(0,0,0,0.03)` | `rgba(255,255,255,0.06)` |
| **Shadow** | `--pf-shadow` | `rgba(0,0,0,0.10)` | `rgba(0,0,0,0.45)` |
| **Strong shadow** | `--pf-shadow-strong` | `rgba(0,0,0,0.12)` | `rgba(0,0,0,0.55)` |
| **Input background** | `--pf-input-bg` | `#ffffff` | `rgba(15,19,27,0.92)` |

**Source:** Variables defined in `src/assets/base.css`te category 2
  wrongAnswers: [...]         // Combined (backward compatibility)
}
  background: var(--pf-surface);
  color: var(--pf-text);
  border: 1px solid var(--pf-border);
}
```

### Available CSS Variables

**Colors:**
- `--pf-accent` - Primary green (#2ea44f)
- `--pf-danger` - Error red (#d32f2f)

**Backgrounds:**
- `--pf-bg` - Page background
- `--pf-surface` - Card/component background
- `--pf-surface-2` - Secondary surface (subtle)
- `--pf-hover` - Hover state background
- `--pf-input-bg` - Input field background

**Text:**
- `--pf-text` - Primary text color
- `--pf-muted` - Secondary/muted text
- `--pf-muted-2` - Less muted text
- `--pf-placeholder` - Placeholder text

**Borders:**
- `--pf-border` - Standard border
- `--pf-border-strong` - Emphasized border
- `--pf-border-soft` - Subtle border

**Effects:**
- `--pf-shadow` - Drop shadows
- `--pf-shadow-strong` - Strong shadows
UI Patterns (Copy These)

**Main Container / Shell:**
```css
.game-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--pf-bg);      /* Page background */
  color: var(--pf-text);         /* Text color */
}
```

**Card Container:**
```css
.card {
  width: 100%;
  max-width: 520px;
  background: var(--pf-surface);           /* Card background */
  border: 1px solid var(--pf-border-soft); /* Subtle border */
  border-radius: 16px;                     /* Always 16px for cards */
  padding: 18px;
  box-shadow: 0 10px 28px var(--pf-shadow); /* Drop shadow */
}
```

**Primary Button (Green):**
```css
.btn-primary {
  background: var(--pf-accent);  /* Always green */
  color: #fff;                   /* Always white text on accent */
  border-radius: 12px;           /* Always 12px for buttons */
  padding: 12px 14px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
}
s & Formats

### People Data Format (from `people-fallback.json`)

```javascript
{
  id: "71a6bb31-944f-41d9-a940-d8a0c6d41d02",  // UUID (required)
  displayName: "Jesse Houwing",                 // Full name (required)
  givenName: "Jesse",                           // First name (required)
  photo: "/fallback-photos/71a6bb31-(...).jpg", // Photo path (required)
  // Custom properties:
  isJesse: true  // Example: for filtering specific people
}
```

**Accessing in components:**
```javascript
import fallbackPeople from '@/data/people-fallback.json';
const people = fallbackPeople?.value || [];
```

### Score Object Formats

**Format 1: Standard Games (TheResult.vue)**
```javascript
{
  scoreOutOf10: "7.5",        // MUST be string with 1 decimal
  totalGoodAnswers: 7,        // MUST be integer
  wrongAnswers: [             // MUST be array of objects
    {
      name: "FirstName",      // Person's first name
      imgUrl: "/path.jpg"     // Photo path (or link/photo)
    }
  ],
  mode: "easy",               // Optional: "easy" | "hard"
  elapsed: "01:23"            // Optional: MM:SS format
}
```

**Format 2: Custom Scoring (example: FindJesseResult.vue)**
```javascript
{
  scoreOutOf10: "8.5",        // String with 1 decimal
  totalGoodAnswers: 8,        // True positives + true negatives
  totalTiles: 9,              // Total items (for "8 / 9" display)
  missedJesses: [             // False negatives
    { name: "Jesse", imgUrl: "..." }
  ],
  falsePositives: [           // False positives
    { name: "Sarah", imgUrl: "..." }
  ],
  wrongAnswers: [...]         // Combined (backward compatibility)
}
```

**Storing scores:**
```javascript
localStorage.setItem('gameScore', JSON.stringify(score));
```

**Retrieving scores:**
```javascript
const score = JSON.parse(localStorage.getItem('gameScore')); color: var(--pf-placeholder);
}
```

**ERequired Best Practices

### 1. CSS Variables (CRITICAL)
```css
/* ❌ WRONG - Hardcoded colors */
background: #ffffff;
color: #111111;

/* ✅ CORRECT - CSS variables */
background: var(--pf-surface);
color: var(--pf-text);
```

### 2. Image Error Handling (REQUIRED)
```vue
<script>
import { getFallbackAvatarUrl } from '../utils/photo'

export default {
  computed: {
    fallbackAvatarUrl() {
      return getFallbackAvatarUrl()
    }
  }
}
</script>

<template>
  <img 
    :src="person.photo"
    @error="(e) => (e.target.src = fallbackAvatarUrl)"
    alt="Colleague photo"
  />
</template>
```

### 3. Array Shuffling (REQUIRED)
```javascript
// ❌ WRONG - Mutates original
people.sort(() => Math.random() - 0.5);

// ✅ CORRECT - Creates new array
const shuffled = people.slice().sort(() => Math.random() - 0.5);
```

### 4. Route Lazy Loading (REQUIRED)
```javascript
// ❌ WRONG - Eager loading
import GameView from '../views/GameView.vue';
component: GameView

// ✅ CORRECT - Lazy loading
component: () => import('../views/GameView.vue')
```

### 5. Score Calculation Format (REQUIRED)
```javascript
// scoreOutOf10 MUST be string with 1 decimal
const scoreOutOf10 = ((correct / total) * 10).toFixed(1); // "7.5"

// totalGoodAnswers MUST be integer
const totalGoodAnswers = 7; // Not "7" or 7.0
```

### 6. Props Validation (REQUIRED)
```javascript
export default {
  props: {
    collegas: {
      type: Array,
      required: true
    },
    gridSize: {
      type: Number,
      default: 3
    }
  }
}
```

### 7. Consistent Spacing
- Cards: `border-radius: 16px`, `padding: 18px`
- Buttons: `border-radius: 12px`, `padding: 12px 14px`
- Grid/Flex: Use `gap: 10px` or `gap: 12px` (not margins)

### 8. Accessibility
```vue
<img :alt="`Photo of ${person.name}`" />
<button aria-label="Refresh grid">↻</button>
```

## Reference Implementations

**Study these components for patterns:**

- **Simple game:** `src/views/GameView.vue` + `src/components/TheGame.vue`
- **Custom scoring:** `src/views/FindJesseView.vue` + `src/components/FindJesseGame.vue` + `src/components/FindJesseResult.vue`
- **Grid layout:** `src/components/FindJesseGame.vue` (3×3 grid)
- **Result page:** `src/components/TheResult.vue` (standard) or `src/components/FindJesseResult.vue` (custom)

## Testing Checklist

Before marking work complete, verify:

- [ ] Works in light mode (default)
- [ ] Works in dark mode (toggle in UI or use `@media (prefers-color-scheme: dark)`)
- [ ] No hardcoded colors (use CSS variables)
- [ ] Images have error fallback handlers
- [ ] Route uses lazy loading
- [ ] Score format matches requirements (string with 1 decimal)
- [ ] Navigation button added to StartView
- [ ] Arrays are shuffled correctly (non-mutating)
- [ ] Props are validated with type

@media (min-width: 520px) {
  .grid {
    grid-template-columns: repeat(4, 1fr); /* Responsive */
  }f-border-soft);
  color: var(--pf-muted-2);
}
```

## Data Structure

### People Data Format

```javascript
{
  id: "uuid-string",
  displayName: "Full Name",
  givenName: "FirstName",
  photo: "/fallback-photos/uuid.jpg",
  // Add isJesse: true for special filtering
}
```

### Score Object Format

**Standard Games:**
```javascript
{
  scoreOutOf10: "7.5",        // String with 1 decimal
  totalGoodAnswers: 7,        // Integer
  wrongAnswers: [             // Array of missed items
    {
      name: "FirstName",
      imgUrl: "/path/to/photo.jpg"
    }
  ],
  mode: "easy",               // Optional
  elapsed: "01:23"            // Optional (time tracking)
}
```

**Custom Games (like Find Jesse):**
```javascript
{
  scoreOutOf10: "8.5",
  totalGoodAnswers: 8,        // Correct selections
  totalTiles: 9,              // Total items
  missedJesses: [...],        // False negatives
  falsePositives: [...],      // False positives
  wrongAnswers: [...]         // Combined (for compatibility)
}
```

## File Organization

```
src/
├── views/              # Page-level components
│   ├── StartView.vue   # Homepage with mode selection
│   ├── GameView.vue    # Standard game modes
│   └── YourView.vue    # Your custom game
├── components/         # Reusable components
│   ├── TheGame.vue     # Standard game UI
│   ├── TheResult.vue   # Shared result page
│   └── YourGame.vue    # Your game component
├── data/
│   ├── people-fallback.json  # Colleague data
│   └── inputPeopleData.json  # Source data
├── assets/
│   ├── base.css        # CSS variables & global styles
│   └── main.css        # Component-specific styles
└── router/
    └── index.js        # Route definitions
```

## Best Practices

1. **Use CSS variables** - Ensures dark mode support
2. **Lazy load views** - Use `() => import()` in router
3. **Store in localStorage** - Key: `"gameScore"` for result page
4. **Shuffle arrays** - Use `.slice().sort(() => Math.random() - 0.5)`
5. **Validate props** - Define types and defaults in components
6. **Handle errors** - Add `@error` handlers for images with fallback
7. **Consistent spacing** - Use `gap` for grid/flex layouts
8. **Accessibility** - Include proper `alt` text and ARIA labels

## Tips

- Look at existing game modes for patterns
- Test in both light and dark mode
- Keep game components focused on UI
- Keep view components focused on logic
- Use the Xebia logo SVG consistently (available in StartView.vue)
- Match the existing card-based UI design
- Use 16px border radius for cards, 12px for buttons
- Follow the green accent color (#2ea44f) for primary actions
