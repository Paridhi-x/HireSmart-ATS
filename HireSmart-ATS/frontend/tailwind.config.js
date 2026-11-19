/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B3A57',
          hover: '#132B41',
        },
        accent: '#D9622B',
        bg: '#F6F5F2',
        card: '#FFFFFF',
        border: '#E4E1DA',
        ink: '#1F2933',
        muted: '#6B7280',
        status: {
          applied: '#64748B',
          shortlisted: '#2F7D5B',
          interview: '#C98A1B',
          hired: '#1E5E43',
          rejected: '#B84A4A',
        }
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
      }
    },
  },
  plugins: [],
}
