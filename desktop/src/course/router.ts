import { useEffect, useState } from 'react';

// Hash routes, as in Delineare, so the course app needs no server-side routes and the Workshop can
// link straight to a place: #/, #/course, #/lesson/<slug>, #/do/<practice id>, #/free/<seed>,
// #/practice, #/library, #/models, #/models/<attempt id>, #/settings, #/credits, #/welcome.
export function parseRoute(hash: string): string[] {
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
}

export function useRoute(): string[] {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const update = () => {
      setRoute(parseRoute(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return route;
}

export const href = (...parts: (string | number)[]) => `#/${parts.map((part) => encodeURIComponent(String(part))).join('/')}`;

export function go(...parts: (string | number)[]): void {
  window.location.hash = href(...parts);
}
