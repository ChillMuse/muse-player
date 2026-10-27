# Muse landing page

Live: https://chillmuse.github.io/muse-player/

A responsive Korean / English product landing page using the supplied app screenshots and original poster-inspired artwork. Built with native HTML/CSS/JavaScript and Vite; fonts are self-hosted.

## Development

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Production paths target `/muse-player/`. Pushing `main` deploys through `.github/workflows/pages.yml`. GitHub Pages must use GitHub Actions as its source.

## Downloads

Muse is a macOS-only app. The installer will be provided later through GitHub. Until then the page shows a macOS release-pending state. To enable the download button, set `url` and the actual requirements in `note` in `src/download.js`. The button and FAQ update together at build time.

## Assets and design

Six original supplied app screenshots are in `public/images/`. Generated artwork source and prompt are documented in `design/README.md`. Fonts: DM Sans and Cormorant Garamond via Fontsource (SIL Open Font License).

## Verification

```sh
npx playwright test
```

Checks desktop/mobile overflow, image loading, tabs and keyboard navigation, screenshot dialog, FAQ, and automated accessibility. Tests use installed Google Chrome. Serve the production build with `npm run preview` first.
