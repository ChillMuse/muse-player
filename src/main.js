import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';
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

import { download } from './download.js';
if (download.url) {
  const url = new URL(download.url);
  if (url.protocol === 'https:') {
    const link = document.createElement('a');
    link.className = 'button primary'; link.href = url.href; link.textContent = download.label;
    link.append(document.querySelector('.header .button span').cloneNode(true));
    document.querySelector('.availability').replaceWith(link);
    document.querySelector('.download-note').textContent = download.note;
    const faq = document.querySelector('.questions details:last-child p');
    faq.textContent = 'Muse is a macOS-only app. Use the download button to get the installer. See the GitHub release for installation instructions.';
  }
}
