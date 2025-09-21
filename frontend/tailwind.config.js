/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neo-brutalist color palette
        bg: '#F6F7F8',        // Very light concrete
        panel: '#E6E8EA',      // Card panels
        ink: '#0B0D0F',        // Near black for text
        muted: '#7B7F84',      // Secondary text
        accent: '#FF4B3E',     // Emergency / primary CTA - vivid coral
        'accent-2': '#00B37E', // Success/impact/green
        'accent-3': '#1E90FF', // Info/links/secondary CTA
        slab: '#2B2F33',       // Deep slab color for large blocks
        glass: 'rgba(11,13,15,0.04)', // Subtle overlay panels
      },
      fontFamily: {
        display: ['Anton', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.5rem',       // 24px
        '2xl': '2.25rem',     // 36px - section headings
        '3xl': '3.5rem',      // 56px - hero
        '4xl': '5rem',        // 80px - promo slabs
      },
      spacing: {
        '18': '4.5rem',
        '28': '7rem',
        '72': '18rem',
      },
      borderRadius: {
        'md': '8px',
      },
      boxShadow: {
        'slab': '0 2px 0 0 rgba(11,13,15,0.12)',
        'slab-hover': '0 4px 0 0 rgba(11,13,15,0.12)',
        'brutal': '2px 2px 0 0 rgba(11,13,15,0.12)',
        'brutal-hover': '4px 4px 0 0 rgba(11,13,15,0.12)',
      },
      animation: {
        'lift': 'lift 140ms cubic-bezier(0.2,0.9,0.25,1)',
        'pulse-urgent': 'pulse-urgent 220ms cubic-bezier(0.2,0.9,0.25,1)',
        'progress-fill': 'progress-fill 900ms linear',
        'badge-mint': 'badge-mint 360ms cubic-bezier(0.2,0.9,0.25,1)',
        'slide-in': 'slide-in 220ms cubic-bezier(0.2,0.9,0.25,1)',
        'slide-out': 'slide-out 160ms cubic-bezier(0.2,0.9,0.25,1)',
        'flip': 'flip 220ms cubic-bezier(0.2,0.9,0.25,1)',
        'ticker': 'ticker 20s linear infinite',
      },
      keyframes: {
        lift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
        'pulse-urgent': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        'badge-mint': {
          '0%': { transform: 'scale(0.7) rotate(0deg)' },
          '50%': { transform: 'scale(1.08) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'flip': {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(20deg)' },
        },
        'ticker': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      transitionTimingFunction: {
        'brutal': 'cubic-bezier(0.2,0.9,0.25,1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
