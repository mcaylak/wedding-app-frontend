/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blush-rose': '#F8E8E8',
        'champagne-gold': '#E8D5B7',
        'pearl-white': '#FEFEFE',
        'sage-green': '#E8F5E8',
        'lavender-mist': '#F0E6FF',
        'warm-gray': '#8B7D7D',
        'rose-gold': '#E8B4B8',
        'sunset-orange': '#FFB5A3',
        'soft-cream': '#F7F3F0',
        'dusty-rose': '#D4A5A5',
        'champagne': '#F7E7CE',
        'mint-green': '#E0F2E7',
        'coral': '#FF8A80',
        'ivory': '#FFFFF0',
        'taupe': '#8B7765',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'dancing': ['Dancing Script', 'cursive'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(232, 180, 184, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(232, 180, 184, 0.8)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}