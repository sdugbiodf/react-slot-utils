import { esmExternalRequirePlugin } from 'rolldown/plugins';
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  platform: 'neutral',
  target: 'ES2024',
  outDir: 'dist',
  format: 'esm',
  clean: true,
  minify: true,
  dts: true,
  exports: true,
  inlineOnly: false,
  plugins: [esmExternalRequirePlugin({ external: ['react', 'classnames'] })],
});
