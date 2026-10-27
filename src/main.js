import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';
const base = import.meta.env.BASE_URL;
const screens = {
  home: ['Muse Home: 듣던 음악과 최근 추가한 앨범', '마지막으로 듣던 곡부터. 다시, 재생.'],
  library: ['Muse Library: 앨범 커버로 탐색하는 음악 라이브러리', '좋아하는 앨범들이 모여, 당신만의 컬렉션.'],
  radio: ['Muse Radio: 곡과 아티스트에서 시작하는 라디오', '한 곡에서 시작해, 새로운 음악으로.'],
  add: ['Muse Add music: 음악 검색과 다운로드 진행 화면', '찾고, 추가하고, 라이브러리에서 만나보세요.'],
  artists: ['Muse Library: 아티스트별 음악 보기', '좋아하는 아티스트의 음악을 한눈에.'],
  songs: ['Muse Library: 노래별 음악 보기', '듣고 싶은 그 노래를 더 빠르게.'],
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
    faq.textContent = 'Muse는 macOS 전용 앱입니다. 다운로드 버튼으로 설치 파일을 받을 수 있습니다. 자세한 설치 방법은 GitHub 릴리스에서 확인하세요.';
  }
}
