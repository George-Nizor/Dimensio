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

export function Course() {
  const content = useContent();
  const { records, settings } = useAppData();
  const [query, setQuery] = useState('');
  const [show, setShow] = useState<Show>('all');
  const written = writtenLessons(content);
  const current = currentLesson(written.map((lesson) => lesson.slug), records);
  const q = query.trim().toLowerCase();

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
      </div>

      {parts.length ? null : <p className="empty">No lessons match that.</p>}

      {parts.map((part) => (
        <section key={part.number} className="course-part" aria-labelledby={`part-${part.number}`}>
          <div className="part-head">
            <h2 id={`part-${part.number}`}>Part {part.number}: {part.title}</h2>
            <span className="meta">{part.lessons.length} lessons</span>
          </div>
          <ol className="lesson-grid">
            {part.shown.map((entry) => <LessonCard key={entry.slug} entry={entry} current={entry.slug === current} offerKnown={settings.knowsBlender} />)}
          </ol>
        </section>
      ))}
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
