import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';
import { installers, thanksUrl } from './download.js';

const params = new URLSearchParams(location.search);
const chosen = installers[params.get('os')];

// Fall back to the visitor's system when no installer was chosen.
const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
const os = chosen?.os || (/win/i.test(platform) ? 'windows' : 'macos');

// Tabs: show the steps for the system that was downloaded.
const tabs = [...document.querySelectorAll('[role="tab"]')];
const select = tab => {
  tabs.forEach(other => {
    const active = other === tab;
    other.setAttribute('aria-selected', String(active));
    other.tabIndex = active ? 0 : -1;
    document.getElementById(other.getAttribute('aria-controls')).hidden = !active;
  });
};
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => select(tab));
  tab.addEventListener('keydown', event => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    const next = tabs[(index + step + tabs.length) % tabs.length];
    select(next);
    next.focus();
  });
});
select(document.getElementById(`tab-${os}`));

if (chosen) {
  document.getElementById('download-status').textContent =
    `Your download of Muse for ${chosen.name} is starting. Look for ${chosen.file} in your Downloads folder.`;
  document.getElementById('retry-link').href = chosen.url;
  document.getElementById('download-retry').hidden = false;
  document.querySelectorAll(`[data-file="${chosen.os}"]`).forEach(file => { file.textContent = chosen.file; });
  // Start the download; the page stays open so the steps remain visible.
  setTimeout(() => { location.href = chosen.url; }, 600);
} else {
  const choices = document.getElementById('download-choices');
  Object.values(installers).forEach(item => {
    const link = document.createElement('a');
    link.className = 'download-alternative';
    link.href = thanksUrl(item);
    link.textContent = item.label;
    choices.append(link);
  });
}
