import { useState } from 'react';
import { TOTAL_LESSONS, useContent, writtenLessons } from '../content/load';
import type { LessonEntry } from '../content/types';
import { currentLesson } from '../engine/review';
import { href } from '../router';
import { lessonStatus, useAppData } from '../store/appData';
import { setKnown } from '../store/db';
import { DiagramView } from '../ui/Diagram';
import { Icon } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { resourceDetails } from '../ui/Resource';

type Show = 'all' | 'open';

// The course is long (Dimensio's has 16 parts), so the parts are folded, as Delineare's plan has
// them: the part you're on is open, the others show their name and a count, and a click opens one.
// A search or the "Not done yet" filter opens every part with a match.
export function Course() {
  const content = useContent();
  const { records, settings } = useAppData();
  const [query, setQuery] = useState('');
  const [show, setShow] = useState<Show>('all');
  const written = writtenLessons(content);
  const current = currentLesson(written.map((lesson) => lesson.slug), records);
  const currentPart = current ? content.lessons[current]?.part ?? 1 : 1;
  const [open, setOpen] = useState<Set<number>>(() => new Set([currentPart]));
  const q = query.trim().toLowerCase();
  const filtering = Boolean(q) || show === 'open';
  const allOpen = content.parts.every((part) => open.has(part.number));
  const toggle = (number: number) => setOpen((previous) => {
    const next = new Set(previous);
    if (next.has(number)) next.delete(number);
    else next.add(number);
    return next;
  });

  const keep = (entry: LessonEntry) => {
    const status = lessonStatus(records.get(entry.slug));
    if (show === 'open' && (status === 'done' || status === 'known')) return false;
    return !q || `${entry.number} ${entry.title} ${entry.summary}`.toLowerCase().includes(q);
  };
  const parts = content.parts.map((part) => ({ ...part, shown: part.lessons.filter(keep) })).filter((part) => part.shown.length);

  return (
    <div className="page course">
      <header className="page-head">
        <h1>Course</h1>
        <p className="lede">There are {TOTAL_LESSONS(content)} lessons in {content.parts.length} parts, starting with moving around the 3D Viewport. They're in the order we recommend, but every lesson is open, so you can start wherever you like.</p>
        {settings.knowsBlender ? <p className="note">Mark the lessons you already know with "I already know this". They stop coming up, and their exercises stay in Practice.</p> : null}
      </header>

      <div className="toolbar">
        <label className="field search-field">
          <Icon name="search" size={18} />
          <span className="visually-hidden">Find a lesson</span>
          <input type="search" placeholder="Find a lesson" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="segmented" role="group" aria-label="Which lessons">
          <button type="button" aria-pressed={show === 'all'} onClick={() => setShow('all')}>All lessons</button>
          <button type="button" aria-pressed={show === 'open'} onClick={() => setShow('open')}>Not done yet</button>
        </div>
        {filtering || content.parts.length < 2 ? null : (
          <button type="button" className="quiet" onClick={() => setOpen(allOpen ? new Set() : new Set(content.parts.map((part) => part.number)))}>
            {allOpen ? 'Fold every part' : 'Open every part'}
          </button>
        )}
      </div>

      {parts.length ? null : <p className="empty">No lessons match that.</p>}

      <div className="course-parts">
        {parts.map((part) => {
          const expanded = filtering || open.has(part.number);
          const done = part.lessons.filter((entry) => ['done', 'known'].includes(lessonStatus(records.get(entry.slug)))).length;
          const here = part.number === currentPart && Boolean(current);
          return (
            <section key={part.number} className={`course-part ${expanded ? 'open' : ''}`} aria-labelledby={`part-${part.number}`}>
              <h2 className="part-head" id={`part-${part.number}`}>
                <button type="button" className="part-toggle" aria-expanded={expanded} aria-controls={`part-${part.number}-lessons`} disabled={filtering} onClick={() => toggle(part.number)}>
                  <span className="part-title">Part {part.number}: {part.title}</span>
                  <span className="part-count">{filtering ? `${part.shown.length} of ${part.lessons.length} lessons` : `${part.lessons.length} lessons, ${done} done`}{here ? " · the part you're on" : ''}</span>
                  <span className="part-chevron" aria-hidden="true"><Icon name="next" size={18} /></span>
                </button>
              </h2>
              {expanded ? (
                <ol className="lesson-grid" id={`part-${part.number}-lessons`}>
                  {part.shown.map((entry) => <LessonCard key={entry.slug} entry={entry} current={entry.slug === current} offerKnown={settings.knowsBlender} />)}
                </ol>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

// The card's picture: the lesson's example, the example model its exercise copies, its first step
// diagram, or the lesson number on grid paper.
function LessonCardArt({ entry }: { entry: LessonEntry }) {
  const content = useContent();
  const lesson = content.lessons[entry.slug];
  const exercise = lesson ? content.practice[lesson.exercise] : undefined;
  const model = exercise?.reference.type === 'model' ? content.references[exercise.reference.model] : undefined;
  const diagram = lesson?.example ?? lesson?.steps.find((step) => step.diagram)?.diagram;
  if (model?.renders.persp) return <span className="lesson-art is-model"><img src={model.renders.persp} alt="" /></span>;
  if (diagram) return <span className="lesson-art is-diagram"><DiagramView diagram={content.diagrams[diagram]} /></span>;
  return <span className="lesson-art is-number" aria-hidden="true"><span>{entry.number}</span></span>;
}

function LessonCard({ entry, current, offerKnown }: { entry: LessonEntry; current: boolean; offerKnown: boolean }) {
  const content = useContent();
  const { records } = useAppData();
  const status = lessonStatus(records.get(entry.slug));
  const lesson = content.lessons[entry.slug];
  const video = lesson?.watch.map((id) => content.resources[id]).find(Boolean);
  const badge = current ? 'Next' : status === 'done' ? 'Done' : status === 'known' ? 'Known' : status === 'tried' ? 'In progress' : entry.written ? '' : 'Being written';

  const body = (
    <>
      <span className="lesson-art-wrap">
        <LessonCardArt entry={entry} />
        {badge ? <span className={`badge ${current ? 'badge-next' : ''}`}>{badge}</span> : null}
      </span>
      <span className="lesson-card-body">
        <span className="lesson-card-title"><span className="num">{entry.number}</span>{entry.title}</span>
        <span className="card-text">{entry.summary}</span>
        {video ? <span className="card-meta video-line"><Icon name="library" size={15} />{resourceDetails(video).split(' · ').slice(0, 2).join(' · ')}</span> : null}
      </span>
    </>
  );

  const known = entry.written && offerKnown && (status === 'not started' || status === 'known') ? (
    <span className="lesson-card-foot">
      {status === 'known'
        ? <button type="button" className="quiet" onClick={() => setKnown(entry.slug, false)}>Undo "I already know this"</button>
        : <button type="button" className="quiet" onClick={() => setKnown(entry.slug, true)}>I already know this</button>}
    </span>
  ) : null;

  return (
    <Reveal as="li" className={`lesson-card ${current ? 'current' : ''}`}>
      {entry.written ? (
        <div className="card">
          <a className="lesson-card-link" href={href('lesson', entry.slug)}>{body}</a>
          {known}
        </div>
      ) : <div className="card unwritten" aria-label={`${entry.title}, being written`}>{body}</div>}
    </Reveal>
  );
}
