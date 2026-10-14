import { useEffect, useState } from 'react';
import { VIEWS, VIEW_LABEL, type View } from '../content/types';

type Sources = Partial<Record<View, string>>;

// Object URLs for stored renders, released when they go away.
export function useObjectUrls(blobs: Partial<Record<View, Blob>> | undefined): Sources {
  const [urls, setUrls] = useState<Sources>({});
  useEffect(() => {
    const next: Sources = {};
    for (const view of VIEWS) {
      const blob = blobs?.[view];
      if (blob) next[view] = URL.createObjectURL(blob);
    }
    setUrls(next);
    return () => Object.values(next).forEach((url) => URL.revokeObjectURL(url));
  }, [blobs]);
  return urls;
}

// One render at a time, with the views to switch between. Renders sit on neutral grey in both
// themes, as Delineare's references do.
export function ViewSwitcher({ sources, alt, className = '', caption }: { sources: Sources; alt: string; className?: string; caption?: string }) {
  const views = VIEWS.filter((view) => sources[view]);
  const [picked, setPicked] = useState<View>(views[0] ?? 'persp');
  const view = sources[picked] ? picked : views[0];
  if (!view) return null;
  return (
    <figure className={`views ${className}`}>
      <img className="views-image" key={view} src={sources[view]} alt={`${alt} ${VIEW_LABEL[view]} view.`} />
      {views.length > 1 ? (
        <div className="segmented views-switch" role="group" aria-label="View">
          {views.map((v) => <button key={v} type="button" aria-pressed={v === view} onClick={() => setPicked(v)}>{VIEW_LABEL[v]}</button>)}
        </div>
      ) : null}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

// Every view side by side, each with its name.
export function RenderGrid({ sources, alt, label = (view: View) => VIEW_LABEL[view] }: { sources: Sources; alt: string; label?: (view: View) => string }) {
  const views = VIEWS.filter((view) => sources[view]);
  if (!views.length) return null;
  return (
    <ul className="render-grid">
      {views.map((view) => (
        <li key={view}>
          <figure>
            <img src={sources[view]} alt={`${alt} ${VIEW_LABEL[view]} view.`} />
            <figcaption>{label(view)}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
