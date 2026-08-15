import preset from '@twaozann01/tailwind-config';
import type { Config } from 'tailwindcss';

export default {
  presets: [preset],
  // Phải quét cả dist của các package thư viện, nếu không Tailwind purge mất class của chúng.
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}', ...preset.sharedContent],
} satisfies Config;
