/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Manrope"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        paper: '#ffffff',
        surface: '#f4f4f4',
        ink: '#111111',
        muted: '#6b6b6b',
        action: '#1a4be0',
        'action-hover': '#163fc0',
        sand: {
          bg: '#d9ccb7',
          surface: '#e9e0d2',
          ink: '#2a2622',
          accent: '#a8794a',
        },
        sky: {
          bg: '#c6d3df',
          surface: '#d6e0e9',
          ink: '#25303a',
          accent: '#3f6a92',
        },
        sage: {
          bg: '#cdd6c6',
          surface: '#dce3d6',
          ink: '#262d24',
          accent: '#6c8e63',
        },
      },
      borderRadius: {
        'taste-lg': '20px',
        'taste-md': '12px',
        'taste-sm': '8px',
      },
      transitionTimingFunction: {
        'taste': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
