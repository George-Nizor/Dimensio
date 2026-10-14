import { useEffect, useRef, useState, type ReactNode } from 'react';
import { olderBlender, type Resource } from '../content/types';
import { Icon } from './Icons';

// One line per resource: title, teacher, what it is, length, the Blender version when it is older
// than 5.0, and cost. A YouTube lesson can play in place, in YouTube's privacy-enhanced player;
// everything opens in the system browser too.
export function resourceDetails(resource: Resource): string {
  return [resource.teacher, resource.kind + (resource.minutes ? `, ${resource.minutes} min` : ''), olderBlender(resource), resource.cost].filter(Boolean).join(' · ');
}

export function ResourceLine({ resource, extra }: { resource: Resource; extra?: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  return (
    <li className={`resource ${playing ? 'playing' : ''}`}>
      <div className="resource-line">
        <span className="resource-text">
          <span className="resource-title">{resource.title}</span>
          <span className="meta">{resourceDetails(resource)}</span>
          {extra}
        </span>
        <span className="resource-actions">
          {resource.youtube ? (
            <button type="button" className="button small" aria-expanded={playing} onClick={() => setPlaying((value) => !value)}>
              {playing ? 'Close' : <><Icon name="play" size={14} />Play here</>}
            </button>
          ) : null}
          <a className="button small ghost" href={resource.url} target="_blank" rel="noreferrer"><Icon name="open" size={14} />Open</a>
        </span>
      </div>
      {playing && resource.youtube ? <VideoEmbed id={resource.youtube} title={`${resource.title}, ${resource.teacher}`} /> : null}
    </li>
  );
}

// The player loads as a credentialless frame, as in Delineare: no cookies go to YouTube, and the
// page's content policy allows this one frame origin and nothing else. React drops a bare
// `credentialless` attribute, so the frame gets it here, before its address, which is the order the
// browser needs. YouTube also refuses to play when the request for its player carries no Referer
// (player errors 152 and 153), which Chromium never sends from the app's own scheme; the main
// process adds one naming the app (src/lib/app-protocol.cjs, identifyToYouTube).
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    element.setAttribute('credentialless', '');
    element.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`;
  }, [id]);
  return (
    <div className={`video ${loaded ? 'loaded' : ''}`}>
      <iframe
        ref={frame}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
