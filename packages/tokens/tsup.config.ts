import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/tokens.css',
    'src/theme-terra.css',
    'src/theme-almanac.css',
    'src/theme-block.css',
    'src/theme-graphite.css',
    'src/theme-rubber.css',
    'src/theme-terminal.css',
  ],
  clean: true,
});
