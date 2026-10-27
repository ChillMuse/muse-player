import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './tests', use: { channel: 'chrome', viewport: { width: 1440, height: 1000 } } });
