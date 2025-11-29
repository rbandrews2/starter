# Tailwind Config for Work Zone OS

## Complete Configuration

Replace your `tailwind.config.ts` with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Work Zone OS Custom Colors
        wz: {
          yellow: '#FFB300',
          glass: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.12)',
          glow: 'rgba(255, 179, 0, 0.1)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
```

## Usage Examples

### Using Custom Colors

```tsx
// Amber/Yellow accent
<button className="bg-wz-yellow text-black">Click Me</button>

// Glass card
<div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.12)]">
  Content
</div>
```

### Common Patterns

```tsx
// Primary button with glow
className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold 
           hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(255,179,0,0.5)] 
           transition-all"

// Glass card with hover effect
className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md 
           border border-[rgba(255,255,255,0.12)] rounded-xl p-6 
           shadow-[0_0_15px_rgba(255,179,0,0.10)] 
           hover:shadow-[0_0_25px_rgba(255,179,0,0.2)] 
           transition-all hover:border-amber-500/30"
```

## Dark Theme

The app uses a dark theme by default. Set in `globals.css`:

```css
body {
  background: #000;
  color: #fff;
}
```
