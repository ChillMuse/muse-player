import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';
const base = import.meta.env.BASE_URL;
const screens = {
  home: ['Muse Home: resume your last track and browse recently added albums', 'Pick up where you left off. Browse recently added albums.'],
  library: ['Muse Library: browse albums by their cover artwork', 'Search the library. Browse Albums, Artists, or Songs.'],
  radio: ['Muse Radio: start from a record or one of your artists', 'Pick a record to start from. Radio keeps going from there.'],
  add: ['Muse Add music: search results and background download progress', 'Search for a song or an album. It downloads in the background and appears in the library when it’s ready.'],
  artists: ['Muse Library: artists with their album counts', 'Browse your artists and the albums in your library.'],
  songs: ['Muse Library: songs with artist names and track durations', 'Browse songs with their artists and track durations.'],
};
const tabs = [...document.querySelectorAll('[role="tab"]')];
const screen = document.querySelector('#app-screen');
function selectScreen(name) {
  const parent = ['artists', 'songs'].includes(name) ? 'library' : name;
  screen.src = `${base}images/${name}.jpg`;
  screen.alt = screens[name][0];
  document.querySelector('#screen-caption').textContent = screens[name][1];
  document.querySelector('#app-panel').setAttribute('aria-labelledby', `tab-${parent}`);
  tabs.forEach(tab => { const active = tab.dataset.screen === parent; tab.setAttribute('aria-selected', active); tab.tabIndex = active ? 0 : -1; });
  document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', button.dataset.view === name));
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectScreen(tab.dataset.screen));
  tab.addEventListener('keydown', event => {
    const keys = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault(); const next = tabs[keys[event.key]]; next.focus(); selectScreen(next.dataset.screen);
  });
});
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
  selectScreen(button.dataset.view);
  document.querySelector('.preview').scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}));
document.querySelector('#show-radio').addEventListener('click', () => selectScreen('radio'));
const dialog = document.querySelector('#image-dialog');
function openImage() { dialog.querySelector('img').src = screen.src; dialog.querySelector('img').alt = screen.alt; dialog.showModal(); }
document.querySelector('.screenshot-button').addEventListener('click', openImage);
document.querySelector('#expand').addEventListener('click', openImage);
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
    link.className = 'button primary'; link.href = url.href; link.textContent = `${download.label} ↗`;
    document.querySelector('.availability').replaceWith(link);
    document.querySelector('.download-note').textContent = download.note;
    const faq = document.querySelector('.questions details:last-child p');
    faq.textContent = 'Muse is a macOS-only app. Use the download button to get the installer. See the GitHub release for installation instructions.';
  }
}
