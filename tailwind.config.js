/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A889F',
        'primary-light': '#E0F4F8',
        'primary-dark': '#09436B',
        secondary: '#159E3A',
        'secondary-light': '#E8F5E5',
        danger: '#FF3B30',
        'danger-light': '#FFE5E5',
        warning: '#FF9500',
        'warning-light': '#FFF4E5',
        success: '#159E3A',
        'success-light': '#E8F5E5',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '40px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'xxl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'lg': '0 4px 8px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
