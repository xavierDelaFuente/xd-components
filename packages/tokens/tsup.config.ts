import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/tokens.css',
    'src/theme-paper.css',
    'src/theme-sand.css',
    'src/theme-lavender.css',
  ],
  clean: true,
});
