/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:'#EFF6FF', 100:'#DBEAFE', 200:'#BFDBFE', 300:'#93C5FD',
          400:'#60A5FA', 500:'#3B82F6', 600:'#2563EB', 700:'#1D4ED8',
          800:'#1E40AF', 900:'#1E3A8A', 950:'#172554',
        },
        surface: {
          DEFAULT:'#FFFFFF', secondary:'#F8FAFC', tertiary:'#F1F5F9', inverse:'#0F172A',
        },
        content: {
          DEFAULT:'#0F172A', secondary:'#475569', tertiary:'#94A3B8',
          inverse:'#F8FAFC', disabled:'#CBD5E1', link:'#2563EB',
        },
        border: {
          DEFAULT:'#E2E8F0', secondary:'#CBD5E1', tertiary:'#94A3B8', focus:'#3B82F6',
        },
        status: {
          success:'#16A34A', 'success-bg':'#F0FDF4', 'success-border':'#86EFAC',
          error:'#DC2626',   'error-bg':'#FEF2F2',   'error-border':'#FECACA',
          warning:'#D97706', 'warning-bg':'#FFFBEB',  'warning-border':'#FDE68A',
          info:'#2563EB',    'info-bg':'#EFF6FF',     'info-border':'#BFDBFE',
        },
      },
      fontFamily: {
        sans: ['Noto Sans Bengali','Inter','Segoe UI','system-ui','-apple-system','sans-serif'],
        mono: ['JetBrains Mono','Fira Code','Consolas','monospace'],
      },
      borderRadius: {
        sm:'4px', DEFAULT:'6px', md:'8px', lg:'10px', xl:'12px', '2xl':'16px', full:'9999px',
      },
      boxShadow: {
        xs:'0 1px 2px 0 rgb(0 0 0/0.04)',
        sm:'0 1px 3px 0 rgb(0 0 0/0.07)',
        DEFAULT:'0 2px 4px -1px rgb(0 0 0/0.08)',
        md:'0 4px 8px -2px rgb(0 0 0/0.10)',
        lg:'0 10px 20px -4px rgb(0 0 0/0.10)',
        xl:'0 20px 40px -8px rgb(0 0 0/0.12)',
        focus:'0 0 0 3px rgb(59 130 246/0.40)',
        'focus-error':'0 0 0 3px rgb(220 38 38/0.25)',
        'focus-success':'0 0 0 3px rgb(22 163 74/0.25)',
      },
      keyframes: {
        shimmer:{'0%':{backgroundPosition:'-800px 0'},'100%':{backgroundPosition:'800px 0'}},
        'fade-in':{'0%':{opacity:'0'},'100%':{opacity:'1'}},
        'slide-up':{'0%':{opacity:'0',transform:'translateY(8px)'},'100%':{opacity:'1',transform:'translateY(0)'}},
        'scale-in':{'0%':{opacity:'0',transform:'scale(0.95)'},'100%':{opacity:'1',transform:'scale(1)'}},
      },
      animation: {
        shimmer:'shimmer 1.6s infinite linear',
        'fade-in':'fade-in 0.15s ease-out',
        'slide-up':'slide-up 0.2s ease-out',
        'scale-in':'scale-in 0.15s ease-out',
      },
      screens: { xs:'380px', sm:'640px', md:'768px', lg:'1024px', xl:'1280px', '2xl':'1536px' },
    },
  },
  plugins: [],
};
