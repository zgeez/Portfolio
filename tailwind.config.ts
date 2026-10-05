import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

// Colours resolve to the RGB-triplet tokens in src/app/globals.css.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1240px' },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        bg: { DEFAULT: token('bg'), elevated: token('bg-elevated') },
        panel: { DEFAULT: token('panel'), 2: token('panel-2') },
        fg: token('text'),
        muted: { DEFAULT: token('text-muted'), foreground: token('text-muted') },
        dim: token('text-dim'),
        line: { DEFAULT: token('line'), strong: token('line-strong') },
        accent: {
          DEFAULT: token('accent'),
          strong: token('accent-strong'),
          blue: token('accent-blue'),
          foreground: token('bg'),
        },
        warning: token('warning'),
        danger: token('danger'),

        // shadcn/ui compatibility names
        background: token('bg'),
        foreground: token('text'),
        border: token('line'),
        input: token('line'),
        ring: token('accent'),
        primary: { DEFAULT: token('text'), foreground: token('bg') },
        secondary: { DEFAULT: token('panel-2'), foreground: token('text') },
        card: { DEFAULT: token('panel'), foreground: token('text') },
        popover: { DEFAULT: token('panel'), foreground: token('text') },
        destructive: { DEFAULT: token('danger'), foreground: token('text') },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
