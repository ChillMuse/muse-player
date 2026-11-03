import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';

// Highlight the section being read in the contents list.
const links = new Map([...document.querySelectorAll('.docs-toc a')].map(link => [link.hash.slice(1), link]));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => link.removeAttribute('aria-current'));
    links.get(entry.target.id)?.setAttribute('aria-current', 'true');
  }), { rootMargin: '-20% 0px -70% 0px' });
  document.querySelectorAll('.docs-body > section').forEach(section => observer.observe(section));
}
