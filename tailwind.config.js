/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#000000',
        'panel-dark': '#1c1c1e',
        'accent-sage': '#B7BF99',
        'accent-light': '#C9D1AA',
        'accent-bright': '#D4DDB8',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#B7BF99",
          "secondary": "#C43302", 
          "accent": "#EDAA25",
          "neutral": "#1c1c1e",
          "base-100": "#000000",
          "base-200": "#1c1c1e",
          "base-300": "#2c2c2e",
          "info": "#5AC8FA",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
  },
}