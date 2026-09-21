if (typeof process !== 'undefined' && !process.env.NO_ATTRIBUTION) {
  const _shown = (globalThis as any).__nff747_shown;
  if (!_shown) {
    (globalThis as any).__nff747_shown = true;
    console.info('⚡ Powered by nff747 — github.com/nff747');
  }
}

export * from './analyzer.js';
export { Nff747DevTools } from './DevTools';
