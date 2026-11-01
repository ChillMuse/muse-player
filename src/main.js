import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';
import { download, thanksUrl } from './download.js';
import './signup.js';
const dialog = document.querySelector('#image-dialog');
document.querySelectorAll('[data-enlarge]').forEach(button => {
  button.addEventListener('click', () => {
    const screenshot = button.closest('figure').querySelector('img');
    dialog.querySelector('img').src = screenshot.src;
    dialog.querySelector('img').alt = screenshot.alt;
    dialog.showModal();
  });
});
dialog.querySelector('button').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); } }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('pending'); observer.observe(element); });
}

// Detect visitor's operating system
const platform =
  navigator.userAgentData?.platform ||
  navigator.platform ||
  navigator.userAgent;

const isMac = /mac/i.test(platform);
const isWindows = /win/i.test(platform);

// Select recommended download
const primaryDownload = isMac
  ? download.macOS.appleSilicon
  : isWindows
    ? download.windows
    : null;

// Create download links
const createDownloadLink = (item, primary = false) => {
  const link = document.createElement('a');

  link.className = primary
    ? 'button primary'
    : 'download-alternative';

  link.href = thanksUrl(item);
  link.textContent = item.label;

  return link;
};

const availability = document.querySelector('.availability');

if (availability) {
  const container = document.createElement('div');
  container.className = 'download-options';

  if (primaryDownload) {
    container.append(createDownloadLink(primaryDownload, true));
  } else {
    const link = document.createElement('a');
    link.className = 'button primary';
    link.href = download.releases;
    link.textContent = 'Download Muse';
    container.append(link);
  }

  // Alternative downloads
  const alternatives = document.createElement('div');
  alternatives.className = 'download-alternatives';

  if (isMac) {
    alternatives.append(
      createDownloadLink(download.macOS.intel)
    );
  } else if (isWindows) {
    alternatives.append(
      createDownloadLink(download.macOS.appleSilicon),
      createDownloadLink(download.macOS.intel)
    );
  } else {
    alternatives.append(
      createDownloadLink(download.macOS.appleSilicon),
      createDownloadLink(download.macOS.intel),
      createDownloadLink(download.windows)
    );
  }

  container.append(alternatives);
  availability.replaceWith(container);
}
