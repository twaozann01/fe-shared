import { defineConfig } from 'tsup';

export default defineConfig({
  // Hai entry: `drawer` đứng riêng để `vaul` chỉ vào bundle của app nào thật sự dùng
  // Drawer. Xem chú thích trong src/drawer.ts.
  entry: ['src/index.ts', 'src/drawer.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true,
  // Tắt code-splitting: hai entry chỉ dùng chung vài util nhỏ, tách chunk chung chỉ đổi
  // lấy một request nữa. Quan trọng hơn: giữ được bảo đảm "entry chung không đụng vaul".
  splitting: false,
  external: ['react', 'react-dom'],
});
