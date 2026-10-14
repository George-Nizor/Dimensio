import { useEffect, useState } from 'react';
import { courseBridge, problemText } from '../bridge';
import { useContent } from '../content/load';
import { KIND_LABEL, VIEWS, type Inline, type PracticeItem, type ReferenceModel, type View } from '../content/types';
import type { MeasureReport } from '../engine/measure';
import { makePrompt } from '../engine/prompts';
import { href } from '../router';
import { useAppData } from '../store/appData';
import { recordExercise } from '../store/db';
import { DiagramView } from '../ui/Diagram';
import { Icon } from '../ui/Icons';
import { InlineText, Paragraphs } from '../ui/Inline';
import { Measurements } from '../ui/Measurements';
import { RenderGrid, ViewSwitcher, useObjectUrls } from '../ui/Renders';
import { chime } from '../ui/sound';
import { clock, useTimer } from '../ui/useTimer';
import { NotFound } from './Lesson';

// A prompt to model something for its own sake, built for the seed in the address.
function freeItem(prompt: string): PracticeItem {
  return {
    id: 'free', lesson: '', main: false, title: 'Modelling prompt', kind: 'imagination', minutes: 20,
    text: [[{ t: 'text', v: "Model this in Blender from imagination. Stop when the time is up, or keep going if you're enjoying it." }]],
    steps: [], rounds: [{ label: '', seconds: 1200 }], reference: { type: 'prompt', prompt }, starter: null, measure: [], check: [],
  };
}

export function ExercisePage({ practiceId, seed }: { practiceId?: string; seed?: number }) {
  const content = useContent();
  const item = practiceId ? content.practice[practiceId] : freeItem(makePrompt(content.prompts, seed ?? 0));
  if (!item) return <NotFound />;
  return <Exercise key={`${item.id}:${seed ?? ''}`} item={item} />;
}

const fileName = (path: string) => path.split(/[\\/]/).pop() ?? path;

// What the learner's model came back as: the renders and outlines as images, and the report.
interface Result {
  renders: Partial<Record<View, Blob>>;
  overlays: Partial<Record<View, Blob>>;
  report: MeasureReport | null;
}

function Exercise({ item }: { item: PracticeItem }) {
  const content = useContent();
  const { settings } = useAppData();
  const lesson = item.lesson ? content.lessons[item.lesson] : undefined;
  const model = item.reference.type === 'model' ? content.references[item.reference.model] : undefined;
  const checks: Inline[] = item.main && lesson ? lesson.checks : item.check;
  const timer = useTimer(item.rounds, () => { if (settings.sound) chime(); });
  const round = item.rounds[timer.round];
  const total = item.rounds.reduce((sum, r) => sum + r.seconds, 0);
  const back = lesson ? href('lesson', lesson.slug) : href();
  // The starter file Dimensio made for this exercise, which is also the file to add afterwards.
  const [starterFile, setStarterFile] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  // Space starts and pauses the timer while nothing else has focus.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || (event.target instanceof HTMLElement && event.target.closest('button, input, a, textarea, select'))) return;
      event.preventDefault();
      if (timer.phase === 'ready') timer.start();
      else if (timer.phase === 'running') timer.pause();
      else if (timer.phase === 'paused') timer.resume();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [timer]);

  const elapsed = timer.phase === 'ready' ? 0 : item.rounds.slice(0, timer.round).reduce((sum, r) => sum + r.seconds, 0) + ((round?.seconds ?? 0) - timer.remaining);
  const progress = timer.phase === 'finished' ? 1 : total ? elapsed / total : 0;
  const length = `${Math.round(total / 60)}-minute ${lesson ? 'exercise' : 'model'}`;

  return (
    <div className="exercise">
      <header className="exercise-bar">
        <a href={back}><Icon name="back" size={18} />{lesson ? `Lesson ${lesson.number}: ${lesson.title}` : 'Home'}</a>
        <span>{length}</span>
        <a href={href()}>{timer.phase === 'finished' ? 'Home' : 'Leave without saving'}</a>
      </header>
      <div className="exercise-body">
        <div className={`reference is-${result ? 'result' : item.reference.type}`}>
          {result ? <YourModel result={result} model={model} /> : <ReferenceArea item={item} model={model} />}
        </div>

        <aside className="panel" aria-label="Exercise">
          <h1>{item.title}</h1>
          <p className="meta">{lesson ? `Lesson ${lesson.number} ${item.main ? 'exercise' : 'practice'} · ` : ''}{KIND_LABEL[item.kind]} · {item.minutes} minutes</p>
          <Paragraphs items={item.text} />
          {item.steps.length ? <ol className="step-chips">{item.steps.map((step, i) => <li key={step}><b>{i + 1}</b>{step}</li>)}</ol> : null}

          {timer.phase !== 'finished' ? <OpenInBlender item={item} onStarter={setStarterFile} /> : null}

          {timer.phase !== 'finished' ? (
            <div className="timer" aria-live="polite">
              <p className="meta">{timer.phase === 'ready' ? 'Space starts and pauses the timer' : timer.phase === 'paused' ? 'Paused' : item.rounds.length > 1 ? `${round?.label ? `${round.label}, ` : ''}round ${timer.round + 1} of ${item.rounds.length}` : 'Modelling'}</p>
              <p className={`clock ${timer.phase === 'paused' ? 'paused' : ''}`}>{clock(timer.phase === 'ready' ? round?.seconds ?? 0 : timer.remaining)}</p>
              <div className="progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
              <div className="actions">
                {timer.phase === 'ready' ? <button type="button" className="button primary" onClick={timer.start}>Start the timer</button> : null}
                {timer.phase === 'running' ? <button type="button" className="button" onClick={timer.pause}>Pause</button> : null}
                {timer.phase === 'paused' ? <button type="button" className="button primary" onClick={timer.resume}>Resume</button> : null}
                {timer.phase !== 'ready' && item.rounds.length > 1 ? <button type="button" className="quiet" onClick={timer.skipRound}>Next round</button> : null}
                {timer.phase === 'ready'
                  ? <button type="button" className="quiet" onClick={timer.finish}>Skip the timer</button>
                  : <button type="button" className="button primary" onClick={timer.finish}>I've finished my model</button>}
              </div>
            </div>
          ) : (
            <Finish item={item} checks={checks} model={model} starterFile={starterFile} onResult={setResult} />
          )}
        </aside>
      </div>
    </div>
  );
}

// What sits on the grey beside the panel before the model is measured.
function ReferenceArea({ item, model }: { item: PracticeItem; model: ReferenceModel | undefined }) {
  const content = useContent();
  const [picture, setPicture] = useState(0);
  const [opening, setOpening] = useState(false);
  const [problem, setProblem] = useState('');
  const reference = item.reference;

  if (reference.type === 'model' && model) {
    const openExample = async () => {
      setOpening(true);
      setProblem('');
      try {
        await (await courseBridge()).openInBlender(model.file);
      } catch (error) {
        setProblem(problemText(error, "Blender didn't open."));
      } finally {
        setOpening(false);
      }
    };
    return (
      <>
        {reference.prompt ? <p className="reference-note">{reference.prompt}</p> : null}
        <ViewSwitcher sources={model.renders} alt={model.alt} className="reference-model" caption={`${model.title}. ${model.credit}, ${model.licence}.`} />
        <div className="picture-controls">
          <button type="button" className="button small" disabled={opening} onClick={() => void openExample()}>Open the example in Blender</button>
        </div>
        {problem ? <p className="reference-problem" role="alert">{problem}</p> : null}
      </>
    );
  }
  if (reference.type === 'images' && reference.images.length) {
    const image = reference.images[picture % reference.images.length]!;
    return (
      <>
        {reference.prompt ? <p className="reference-note">{reference.prompt}</p> : null}
        <figure className="reference-picture" key={image.src}>
          <img src={image.src} alt={image.alt} />
          <figcaption>{image.credit}</figcaption>
        </figure>
        {reference.images.length > 1 ? (
          <div className="picture-controls">
            <span>Picture {(picture % reference.images.length) + 1} of {reference.images.length}</span>
            <button type="button" className="button small" onClick={() => setPicture((value) => value + 1)}>Next picture</button>
          </div>
        ) : null}
      </>
    );
  }
  if (reference.type === 'diagram') {
    return (
      <>
        <p className="reference-note">Your model should end up looking something like this.</p>
        <DiagramView diagram={content.diagrams[reference.diagram]} className="reference-art" />
      </>
    );
  }
  return <p className="reference-prompt">{reference.type === 'prompt' ? reference.prompt : item.title}</p>;
}

// The learner's model once it is measured: its renders, and the example's outline over it.
function YourModel({ result, model }: { result: Result; model: ReferenceModel | undefined }) {
  const renders = useObjectUrls(result.renders);
  const overlays = useObjectUrls(result.overlays);
  const hasOverlays = Object.keys(overlays).length > 0;
  return (
    <div className="your-model">
      <h2>Your model</h2>
      {Object.keys(renders).length ? <RenderGrid sources={renders} alt="Your model," /> : <p className="reference-note">Blender sent back no pictures of this model.</p>}
      {hasOverlays && model ? (
        <>
          <h2>The example's outline over yours</h2>
          <p className="reference-note">Grey is your model and the orange line is the example's outline. Tinted areas are in the example and missing from yours. Hatched areas are extra.</p>
          <RenderGrid sources={overlays} alt={`Your model in grey, with the outline of the ${model.title.toLowerCase()} drawn over it,`} />
        </>
      ) : null}
    </div>
  );
}

// "Open in Blender": the exercise's starter scene when it has one, otherwise a new scene. The
// starter is built once, as <course folder>\<practice id>.blend; pressing again opens that file with
// the learner's work in it. "Start over" builds the starter again over it, after asking.
function OpenInBlender({ item, onStarter }: { item: PracticeItem; onStarter: (file: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState('');
  const [opened, setOpened] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [problem, setProblem] = useState('');
  const starter = item.starter;
  const open = async (overwrite = false) => {
    setBusy(true);
    setConfirming(false);
    setProblem('');
    try {
      const bridge = await courseBridge();
      if (starter) {
        const made = await bridge.makeStarter(starter.id, { name: item.id, overwrite, options: starter.options });
        setFile(made);
        onStarter(made);
        await bridge.openInBlender(made);
      } else {
        await bridge.openInBlender();
      }
      setOpened(true);
    } catch (error) {
      setProblem(problemText(error, "Blender didn't open."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="open-blender">
      <button type="button" className="button" disabled={busy} onClick={() => void open()}>{busy ? 'Opening Blender' : 'Open in Blender'}</button>
      <p className="meta">{opened
        ? `Blender is opening ${file ? fileName(file) : 'a new scene'} in its own window.`
        : starter ? 'Builds the starter scene for this exercise and opens it. If you started before, it opens your file.' : 'Opens Blender with a new scene.'}</p>
      {starter && file && !busy ? (
        confirming ? (
          <p className="start-over">
            Replace {fileName(file)} with a new starter scene? Your changes in it will be lost.{' '}
            <button type="button" className="button small danger" onClick={() => void open(true)}>Start over</button>{' '}
            <button type="button" className="quiet" onClick={() => setConfirming(false)}>Keep my file</button>
          </p>
        ) : <button type="button" className="quiet" onClick={() => setConfirming(true)}>Start over</button>
      ) : null}
      {problem ? <p className="error" role="alert">{problem}</p> : null}
    </div>
  );
}

type Stage = 'adding' | 'measuring' | 'failed' | 'saved';

function Finish({ item, checks, model, starterFile, onResult }: {
  item: PracticeItem;
  checks: Inline[];
  model: ReferenceModel | undefined;
  starterFile: string;
  onResult: (result: Result) => void;
}) {
  const content = useContent();
  const lesson = item.lesson ? content.lessons[item.lesson] : undefined;
  const [file, setFile] = useState(starterFile);
  const [held, setHeld] = useState<boolean[]>(() => checks.map(() => false));
  const [stage, setStage] = useState<Stage>('adding');
  const [problem, setProblem] = useState('');
  const [saved, setSaved] = useState<null | { done: boolean; withModel: boolean; report: MeasureReport | null }>(null);
  const allHeld = checks.length > 0 && held.every(Boolean);

  const pick = async () => {
    setProblem('');
    try {
      const chosen = await (await courseBridge()).pickBlend();
      if (chosen) setFile(chosen);
    } catch (error) {
      setProblem(problemText(error, "The file picker didn't open."));
    }
  };

  const save = async (attempt?: { file: string | null; result: Result | null }) => {
    await recordExercise({
      practiceId: item.id, lesson: item.lesson, main: item.main, allChecksHeld: allHeld,
      attempt: attempt ? {
        file: attempt.file,
        renders: attempt.result?.renders ?? {},
        overlays: attempt.result?.overlays ?? {},
        report: attempt.result?.report ?? null,
        checksHeld: held.flatMap((value, i) => (value ? [i] : [])),
        checkCount: checks.length,
      } : undefined,
    });
    setSaved({ done: item.main && allHeld, withModel: Boolean(attempt), report: attempt?.result?.report ?? null });
    setStage('saved');
  };

  // The learner has ticked their checks; only now does Blender measure the model.
  const measure = async () => {
    if (!file) return;
    setStage('measuring');
    setProblem('');
    try {
      const output = await (await courseBridge()).measure(file, { reference: model?.file, views: [...VIEWS] });
      const blobs = (images: Partial<Record<View, Uint8Array>>) => Object.fromEntries(Object.entries(images).map(([view, bytes]) => [view, new Blob([bytes.slice()], { type: 'image/png' })])) as Partial<Record<View, Blob>>;
      const result: Result = { renders: blobs(output.renders), overlays: blobs(output.overlays), report: output.report };
      await save({ file, result });
      onResult(result);
    } catch (error) {
      setProblem(problemText(error, "Blender couldn't measure this file."));
      setStage('failed');
    }
  };

  const saveQuietly = async (withFile: boolean) => {
    try {
      await save(withFile && file ? { file, result: null } : undefined);
    } catch (error) {
      setProblem(problemText(error, 'Saving failed.'));
    }
  };

  if (stage === 'saved' && saved) {
    return (
      <section className="finish saved" aria-live="polite">
        <svg className="saved-mark" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /><path d="M15 27 L23 34 L37 19" /></svg>
        <h2>Saved</h2>
        <p>{saved.done
          ? `Every check held, so lesson ${lesson?.number} is done. Its exercises will come back in Practice in a couple of days.`
          : item.main
            ? 'Not every check held yet, which is normal early on. The lesson stays in progress, and you can try the exercise again whenever you like.'
            : saved.withModel ? 'Your model is in Models.' : 'The exercise is in your practice history.'}</p>
        {saved.report && item.measure.length ? (
          <>
            <h3 className="sub-head">Measurements</h3>
            <Measurements report={saved.report} measures={item.measure} />
          </>
        ) : null}
        <div className="actions">
          {lesson ? <a className="button primary" href={href('lesson', lesson.slug)}>Back to the lesson</a> : <a className="button primary" href={href()}>Home</a>}
          {saved.withModel ? <a className="button" href={href('models')}>See it in Models</a> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="finish">
      <h2>Add your model</h2>
      <p>Save your file in Blender with <kbd className="keys"><kbd className="key">Ctrl</kbd><span className="keys-plus">+</span><kbd className="key">S</kbd></kbd>, then add it here. It goes in Models, where you can put it next to later attempts.</p>
      <div className={`drop ${file ? 'has-file' : ''}`}>
        {file ? (
          <span className="chosen-file">
            <Icon name="models" size={22} />
            <span><span className="chosen-name">{fileName(file)}</span><span className="meta">{file}</span></span>
          </span>
        ) : null}
        <button type="button" className={file ? 'quiet' : 'button'} disabled={stage === 'measuring'} onClick={() => void pick()}>{file ? 'Choose another file' : 'Add your model'}</button>
      </div>

      {checks.length ? (
        <fieldset className="check-boxes" disabled={stage === 'measuring'}>
          <legend>Tick each check that holds on your model</legend>
          {checks.map((check, i) => (
            <label key={i} className="check-box">
              <input type="checkbox" checked={held[i] ?? false} onChange={(event) => setHeld((list) => list.map((value, j) => (j === i ? event.target.checked : value)))} />
              <span><InlineText nodes={check} /></span>
            </label>
          ))}
          {item.main ? <p className="meta">When every check holds, the lesson is done.</p> : null}
        </fieldset>
      ) : null}

      {stage === 'measuring' ? <p className="measuring" role="status">Blender is measuring {fileName(file)} and rendering it from four sides. This takes a few seconds.</p> : null}
      {problem ? <p className="error" role="alert">{problem}</p> : null}
      <div className="actions">
        {stage === 'failed' ? (
          <>
            <button type="button" className="button primary" onClick={() => void measure()}>Try again</button>
            <button type="button" className="quiet" onClick={() => void saveQuietly(true)}>Save without measuring</button>
          </>
        ) : (
          <>
            <button type="button" className="button primary" disabled={!file || stage === 'measuring'} onClick={() => void measure()}>{item.measure.length ? 'Measure and save' : 'Save my model'}</button>
            <button type="button" className="quiet" disabled={stage === 'measuring'} onClick={() => void saveQuietly(false)}>Save without a model</button>
          </>
        )}
      </div>
    </section>
  );
}
