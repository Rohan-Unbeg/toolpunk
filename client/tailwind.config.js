/** @type {import('tailwindcss').Config} */
export const content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
];
export const darkMode = "class";
export const theme = {
    extend: {
        // Minimal custom colors; most are handled by index.css with CSS variables
        colors: {
            error: "var(--color-error)",
            primary: "var(--color-primary)",
            accent: {
                500: "var(--accent-500)",
                600: "var(--accent-600)",
            },
            secondary: {
                600: "var(--secondary-600)",
            },
        },
        stroke: {
            primary: "var(--color-primary)",
        },
        backgroundImage: {
            'grid-indigo': `linear-gradient(to right, var(--grid-indigo), transparent 1px), linear-gradient(to bottom, var(--grid-indigo), transparent 1px)`,
        },
        animation: {
            float: 'float 3s ease-in-out infinite',
            dash: 'dash 1.5s ease-in-out infinite',
            rotate: 'rotate 2s linear infinite',
        },
        keyframes: {
            float: {
                '0%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-20px)' },
                '100%': { transform: 'translateY(0)' },
            },
            rotate: {
                '100%': { transform: 'rotate(360deg)' },
            },
            dash: {
                '0%': {
                    strokeDasharray: '1, 150',
                    strokeDashoffset: '0',
                },
                '50%': {
                    strokeDasharray: '90, 150',
                    strokeDashoffset: '-35',
                },
                '100%': {
                    strokeDasharray: '90, 150',
                    strokeDashoffset: '-124',
                },
            },
        },
    },
};
export const plugins = [];
  