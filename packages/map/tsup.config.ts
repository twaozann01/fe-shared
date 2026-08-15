import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'leaflet', 'react-leaflet', '@twaozann/ui'],
  // Leaflet nạp CSS và ảnh marker qua import — để bundler của app xử lý, không nhúng vào dist.
  loader: { '.png': 'file' },
});
