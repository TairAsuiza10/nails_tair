/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ---- Identidad GLOWLY · Modern Blush ---- */
        porcelain: '#FFF7F8', // fondo principal
        nude: '#F4DDE5', // fondos secundarios
        blush: '#E6A8BE', // detalles y elementos visuales
        berry: '#C66D91', // acentos y acciones
        plum: '#633B53', // textos, isotipo y elementos principales

        /* Alias del sistema anterior: ya apuntan a Modern Blush */
        wine: {
          DEFAULT: '#633B53',
          deep: '#4E2D41', // ciruela oscurecida para hover (uso funcional)
          soft: '#F4DDE5',
        },
        rose: {
          DEFAULT: '#E6A8BE',
          soft: '#F4DDE5',
          wash: '#FFF7F8',
        },
        canvas: '#FFF7F8',
        neutral: '#F4DDE5',
        ink: '#633B53',
        emerald: {
          DEFAULT: '#3F6B52', // solo estados abierto / verificado (uso funcional)
        },
        map: {
          ground: '#FFF7F8',
          road: '#F4DDE5',
          water: '#E9DCE3',
        },

        /* ---- Superficies: tintes de Porcelana y Rosa nude ---- */
        background: '#FFF7F8',
        'on-background': '#633B53',
        surface: '#FFF7F8',
        'surface-dim': '#EFD8E1',
        'surface-bright': '#FFF7F8',
        'surface-container-lowest': '#FFFCFD',
        'surface-container-low': '#FDF3F6',
        'surface-container': '#F9E9EE',
        'surface-container-high': '#F4DDE5',
        'surface-container-highest': '#EFD2DD',
        'surface-variant': '#F4DDE5',
        'surface-tint': '#C66D91',
        'on-surface': '#633B53',
        'on-surface-variant': '#7A5A6C',
        'inverse-surface': '#633B53',
        'inverse-on-surface': '#FFF7F8',
        outline: '#8A6577',
        'outline-variant': '#E9CFD8',
        primary: '#633B53',
        'on-primary': '#FFF7F8',
        'primary-container': '#E6A8BE',
        'on-primary-container': '#633B53',
        'primary-fixed': '#F4DDE5',
        'primary-fixed-dim': '#E6A8BE',
        'on-primary-fixed': '#633B53',
        'on-primary-fixed-variant': '#4E2D41',
        'inverse-primary': '#E6A8BE',
        secondary: '#C66D91',
        'on-secondary': '#FFF7F8',
        'secondary-container': '#F4DDE5',
        'on-secondary-container': '#633B53',
        'secondary-fixed': '#F4DDE5',
        'secondary-fixed-dim': '#E6A8BE',
        'on-secondary-fixed': '#633B53',
        'on-secondary-fixed-variant': '#4E2D41',
        tertiary: '#3F6B52',
        'on-tertiary': '#FFF7F8',
        'tertiary-container': '#DCEBE1',
        'on-tertiary-container': '#24402F',
        'tertiary-fixed': '#DCEBE1',
        'tertiary-fixed-dim': '#B9D4C3',
        'on-tertiary-fixed': '#1B3223',
        'on-tertiary-fixed-variant': '#2F523C',
        error: '#A33B4E',
        'on-error': '#FFF7F8',
        'error-container': '#F9E3E6',
        'on-error-container': '#6E2432',
      },

      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        'display-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-lg-mobile': ['30px', { lineHeight: '38px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['22px', { lineHeight: '30px', fontWeight: '500' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '18px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-sm': ['10px', { lineHeight: '14px', letterSpacing: '0.04em', fontWeight: '700' }],
      },

      /* DESIGN.md: sm 4 · DEFAULT 8 · md 12 · lg 16 · xl 24 · full */
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },

      spacing: {
        gutter: '1rem',
        'gutter-mobile': '0.75rem',
        margin: '2rem',
        'margin-mobile': '1rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
      },

      maxWidth: {
        sidebar: '460px',
        'sidebar-min': '400px',
      },

      boxShadow: {
        /* Nivel 1 — tarjetas en lista */
        e1: '0px 2px 8px rgba(99, 59, 83, 0.05)',
        /* Nivel 2 — barras flotantes, búsqueda, FAB */
        e2: '0px 4px 20px rgba(99, 59, 83, 0.10)',
        /* Nivel 3 — pines del mapa y hoja destacada */
        e3: '0px 12px 32px rgba(198, 109, 145, 0.18)',
        /* Nivel 4 — modales y lightbox */
        e4: '0px 24px 48px rgba(99, 59, 83, 0.22)',
      },

      backdropBlur: {
        panel: '12px',
      },

      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },

      keyframes: {
        'pin-pop': {
          '0%': { transform: 'translateY(4px) scale(0.92)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'halo-pulse': {
          '0%': { transform: 'scale(0.9)', opacity: '0.55' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'sheet-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },

      animation: {
        'pin-pop': 'pin-pop 220ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'halo-pulse': 'halo-pulse 2.4s cubic-bezier(0.22, 0.61, 0.36, 1) infinite',
        'sheet-up': 'sheet-up 260ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
