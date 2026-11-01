import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Fills __MUSE_RELEASE__ in the HTML with the newest muse-desktop release, e.g. "Muse 0.1.2 (alpha)".
// If GitHub can't be reached the build still succeeds, just without a version number.
let release;
const latestRelease = () => release ??= (async () => {
  try {
    const headers = { Accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch('https://api.github.com/repos/IanTheMitten/muse-desktop/releases/latest', { headers, signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const version = (await response.json()).tag_name?.replace(/^v/, '');
    if (!/^\d+(\.\d+)*$/.test(version ?? '')) throw new Error(`unexpected tag "${version}"`);
    return `Muse ${version} (alpha)`;
  } catch (error) {
    console.warn(`Could not look up the latest Muse release (${error.message}); the pages will show no version number.`);
    return 'Muse (alpha)';
  }
})();

export default defineConfig({
  base: '/muse-player/',
  plugins: [{ name: 'muse-release', transformIndexHtml: async html => html.replaceAll('__MUSE_RELEASE__', await latestRelease()) }],
  build: { rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), thanks: resolve(import.meta.dirname, 'thanks.html') } } }
});
