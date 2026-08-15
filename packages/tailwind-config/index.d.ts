import type { Config } from 'tailwindcss';

declare const preset: Config & { sharedContent: string[] };

export = preset;
