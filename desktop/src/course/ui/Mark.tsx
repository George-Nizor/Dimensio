import InstrumentaIcons from '../../renderer/brand/instrumenta-icons.js';

// Dimensio's cube, drawn by Instrumenta's icon library from presentation attributes only, so it is
// safe under the page's content policy.
export function Mark({ size = 24, play = false }: { size?: number; play?: boolean }) {
  return <span className={`mark ${play ? 'ii-play' : 'ii-hover'}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: InstrumentaIcons.render('dimensio', { size, label: '' }) }} />;
}
