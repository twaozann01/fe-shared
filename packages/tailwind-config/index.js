/**
 * Preset Tailwind dùng chung.
 *
 * App chỉ cần:
 *   presets: [require('@twaozann01/tailwind-config')]
 *   content: ['./src/**\/*.{ts,tsx}', ...require('@twaozann01/tailwind-config').sharedContent]
 *
 * Mọi màu đều trỏ vào CSS variable của @twaozann01/design-tokens, KHÔNG viết giá trị màu ở đây —
 * nếu viết ở cả hai nơi thì sẽ có ngày lệch nhau.
 *
 * `<alpha-value>` là chỗ Tailwind thay số alpha khi bạn viết `bg-primary/15`.
 */
const animate = require('tailwindcss-animate');

/** Tạo cặp DEFAULT + foreground cho một token ngữ nghĩa. */
const pair = (name) => ({
  DEFAULT: `hsl(var(--${name}) / <alpha-value>)`,
  foreground: `hsl(var(--${name}-foreground) / <alpha-value>)`,
});

/** Glob trỏ vào dist của các package UI — app phải thêm vào `content`, nếu không class sẽ bị purge mất. */
const sharedContent = [
  './node_modules/@twaozann01/ui/dist/**/*.{js,mjs}',
  './node_modules/@twaozann01/forms/dist/**/*.{js,mjs}',
  './node_modules/@twaozann01/filters/dist/**/*.{js,mjs}',
  './node_modules/@twaozann01/feedback/dist/**/*.{js,mjs}',
  './node_modules/@twaozann01/map/dist/**/*.{js,mjs}',
];

/** @type {import('tailwindcss').Config} */
const preset = {
  darkMode: 'class',
  content: [],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: pair('primary'),
        secondary: pair('secondary'),
        destructive: pair('destructive'),
        muted: pair('muted'),
        accent: pair('accent'),
        popover: pair('popover'),
        card: pair('card'),
        success: pair('success'),
        warning: pair('warning'),
        info: pair('info'),
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [animate],
};

module.exports = preset;
module.exports.sharedContent = sharedContent;
