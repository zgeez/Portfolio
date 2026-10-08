import type { Config } from 'tailwindcss';

// Colours resolve to the RGB-triplet tokens in src/app/globals.css.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        bg: { DEFAULT: token('bg'), elevated: token('bg-elevated') },
        panel: { DEFAULT: token('panel'), 2: token('panel-2') },
        fg: token('text'),
        muted: token('text-muted'),
        dim: token('text-dim'),
        line: { DEFAULT: token('line'), strong: token('line-strong') },
        accent: {
          DEFAULT: token('accent'),
          strong: token('accent-strong'),
          blue: token('accent-blue'),
        },
        warning: token('warning'),
        danger: token('danger'),
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
} satisfies Config;
