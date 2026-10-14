import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { courseBridge, problemText } from '../bridge';
import { useContent } from '../content/load';
import type { MeasureReport } from '../engine/measure';
import { go, href } from '../router';
import { db, type Attempt } from '../store/db';
import { Icon } from '../ui/Icons';
import { InlineText } from '../ui/Inline';
import { Measurements } from '../ui/Measurements';
import { RenderGrid, useObjectUrls } from '../ui/Renders';
import { BlobImage, shortDate } from '../ui/Thumb';
import { NotFound } from './Lesson';

const fileName = (path: string) => path.split(/[\\/]/).pop() ?? path;

// "5 objects · 60 triangles": the size of a model, as plain counts.
function sizeLine(report: MeasureReport | null): string {
  if (!report) return '';
  const objects = report.totals?.objects ?? report.objects.length;
  const tris = report.totals?.tris ?? report.objects.reduce((sum, object) => sum + (object.tris ?? 0), 0);
  return `${objects} object${objects === 1 ? '' : 's'} · ${tris} triangle${tris === 1 ? '' : 's'}`;
}

function Thumb({ attempt, alt, className }: { attempt: Attempt; alt: string; className?: string }) {
  const blob = attempt.renders.persp ?? Object.values(attempt.renders)[0];
  return blob ? <BlobImage blob={blob} alt={alt} className={className} /> : <span className={`${className ?? ''} empty-render`}>No renders</span>;
}

// Models is Dimensio's sketchbook: every .blend you added, newest first, with its renders.
export function Models() {
  const content = useContent();
  const [lesson, setLesson] = useState('');
  const attempts = useLiveQuery(() => db.attempts.orderBy('createdAt').reverse().toArray(), []);
  if (!attempts) return null;
  const lessons = [...new Set(attempts.map((attempt) => attempt.lesson))].filter((slug) => content.lessons[slug]);
  const shown = lesson ? attempts.filter((attempt) => attempt.lesson === lesson) : attempts;
  const first = shown.at(-1);
  const latest = shown[0];

  return (
    <div className="page models">
      <header className="page-head">
        <h1>Models</h1>
        <p className="lede">{attempts.length
          ? 'The models you added after each exercise, newest first, with their renders and measurements. Pick a lesson to see your first attempt next to your latest.'
          : 'No models yet. Add a .blend file after your next exercise, and it appears here with its renders and measurements.'}</p>
      </header>
      {lessons.length ? (
        <label className="select">
          <span>Lesson</span>
          <select value={lesson} onChange={(event) => setLesson(event.target.value)}>
            <option value="">Every lesson</option>
            {lessons.map((slug) => <option key={slug} value={slug}>Lesson {content.lessons[slug]!.number}, {content.lessons[slug]!.title}</option>)}
          </select>
        </label>
      ) : null}
      {lesson && first && latest && first.id !== latest.id ? (
        <section className="compare" aria-labelledby="compare-title">
          <h2 id="compare-title">Lesson {content.lessons[lesson]!.number}, {content.lessons[lesson]!.title}: your first model and your latest</h2>
          <figure><Thumb attempt={first} alt="Your first model for this lesson" /><figcaption>First model, {shortDate(first.createdAt)}{sizeLine(first.report) ? ` · ${sizeLine(first.report)}` : ''}</figcaption></figure>
          <figure><Thumb attempt={latest} alt="Your latest model for this lesson" /><figcaption>Latest model, {shortDate(latest.createdAt)}{sizeLine(latest.report) ? ` · ${sizeLine(latest.report)}` : ''}</figcaption></figure>
        </section>
      ) : null}
      {lesson && shown.length === 1 ? <p className="note">One model for this lesson so far. Your first and latest show side by side once there are two.</p> : null}
      <ul className="page-grid stagger">
        {shown.map((attempt) => (
          <li key={attempt.id}>
            <a href={href('models', attempt.id!)}>
              <Thumb attempt={attempt} alt="" />
              <span className="page-caption">
                <span>{content.practice[attempt.practiceId]?.title ?? 'Modelling prompt'}</span>
                <span className="meta">{shortDate(attempt.createdAt)}{sizeLine(attempt.report) ? ` · ${sizeLine(attempt.report)}` : ''}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ModelDetail({ id }: { id: number }) {
  const content = useContent();
  const [confirming, setConfirming] = useState(false);
  const [problem, setProblem] = useState('');
  const attempt = useLiveQuery(() => db.attempts.get(id), [id]);
  const renders = useObjectUrls(attempt?.renders);
  const overlays = useObjectUrls(attempt?.overlays);
  if (attempt === undefined) return null;
  if (!attempt) return <NotFound />;
  const item = content.practice[attempt.practiceId];
  const lesson = content.lessons[attempt.lesson];
  const checks = item?.main && lesson ? lesson.checks : item?.check ?? [];
  const file = attempt.file;

  const run = async (action: 'open' | 'reveal') => {
    if (!file) return;
    setProblem('');
    try {
      const bridge = await courseBridge();
      if (action === 'open') await bridge.openInBlender(file);
      else await bridge.reveal(file);
    } catch (error) {
      setProblem(problemText(error, action === 'open' ? "Blender didn't open." : "The folder didn't open."));
    }
  };

  return (
    <div className="page model narrow">
      <a className="back-link" href={href('models')}><Icon name="back" size={16} />Models</a>
      <h1>{item?.title ?? 'Modelling prompt'}</h1>
      <p className="meta">{shortDate(attempt.createdAt)}{lesson ? <> · <a href={href('lesson', lesson.slug)}>Lesson {lesson.number}, {lesson.title}</a></> : null}{sizeLine(attempt.report) ? ` · ${sizeLine(attempt.report)}` : ''}</p>

      {file ? (
        <div className="file-line">
          <span className="chosen-file"><Icon name="models" size={20} /><span><span className="chosen-name">{fileName(file)}</span><span className="meta">{file}</span></span></span>
          <span className="resource-actions">
            <button type="button" className="button small" onClick={() => void run('open')}><Icon name="open" size={14} />Open in Blender</button>
            <button type="button" className="button small ghost" onClick={() => void run('reveal')}><Icon name="folder" size={14} />Show in folder</button>
          </span>
        </div>
      ) : null}
      {problem ? <p className="error" role="alert">{problem}</p> : null}

      {Object.keys(renders).length ? <div className="model-renders"><RenderGrid sources={renders} alt="Your model," /></div> : <p className="note">You saved this model without renders.</p>}
      {Object.keys(overlays).length ? (
        <section className="model-section" aria-labelledby="outline-title">
          <h2 id="outline-title">The example's outline over yours</h2>
          <p className="note">Grey is your model and the orange line is the example's outline. Tinted areas are in the example and missing from yours. Hatched areas are extra.</p>
          <div className="model-renders"><RenderGrid sources={overlays} alt="Your model in grey with the example's outline over it," /></div>
        </section>
      ) : null}

      {checks.length ? (
        <section className="model-section" aria-labelledby="checks-title">
          <h2 id="checks-title">Your checks</h2>
          <ul className="held">
            {checks.map((check, i) => (
              <li key={i} className={attempt.checksHeld.includes(i) ? 'yes' : 'no'}>
                <span className="held-mark">{attempt.checksHeld.includes(i) ? <Icon name="check" size={16} /> : null}{attempt.checksHeld.includes(i) ? 'Held' : 'Not yet'}</span> <span><InlineText nodes={check} /></span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {item?.measure.length && attempt.report ? (
        <section className="model-section" aria-labelledby="measured-title">
          <h2 id="measured-title">Measurements</h2>
          <Measurements report={attempt.report} measures={item.measure} />
        </section>
      ) : null}

      <div className="actions">
        {confirming ? (
          <>
            <button type="button" className="button danger" onClick={async () => { await db.attempts.delete(id); go('models'); }}>Delete this model from Models</button>
            <button type="button" className="quiet" onClick={() => setConfirming(false)}>Keep it</button>
          </>
        ) : (
          <button type="button" className="quiet" onClick={() => setConfirming(true)}>Delete</button>
        )}
      </div>
      {confirming && file ? <p className="meta">The .blend file stays where it is.</p> : null}
    </div>
  );
}
