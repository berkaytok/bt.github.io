import { writable } from 'svelte/store';

function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  return h || 'home';
}

export const route = writable(parseHash());

let initialized = false;
export function startRouting() {
  if (initialized) return;
  initialized = true;
  const onHash = () => route.set(parseHash());
  window.addEventListener('hashchange', onHash);
  route.set(parseHash());
  return () => window.removeEventListener('hashchange', onHash);
}