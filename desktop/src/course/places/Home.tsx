import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { TOTAL_LESSONS, practiceByLesson, useContent, writtenLessons } from '../content/load';
import type { Content, Lesson } from '../content/types';
import { daySeed, makePrompt } from '../engine/prompts';
import { currentLesson, suggest } from '../engine/review';
import { href } from '../router';
import { useAppData } from '../store/appData';
import { db } from '../store/db';
import { DiagramView } from '../ui/Diagram';
import { Icon, type IconName } from '../ui/Icons';
import { BlobImage, shortDate } from '../ui/Thumb';
import { Suggestions } from './Suggestions';

// A picture for the lesson to continue: its example diagram, the example model its exercise copies,
// or its first step's diagram.
function LessonArt({ content, lesson }: { content: Content; lesson: Lesson }) {
  const exercise = content.practice[lesson.exercise];
  const model = exercise?.reference.type === 'model' ? content.references[exercise.reference.model] : undefined;
  if (lesson.example) return <DiagramView diagram={content.diagrams[lesson.example]} className="continue-art" />;
  if (model?.renders.persp) return <img className="continue-art continue-model" src={model.renders.persp} alt={model.alt} />;
  const step = lesson.steps.find((s) => s.diagram);
  return step?.diagram ? <DiagramView diagram={content.diagrams[step.diagram]} className="continue-art" /> : null;
}

export function Home() {
  const content = useContent();
  const { records, log } = useAppData();
  const [offset, setOffset] = useState(0);
  const attemptCount = useLiveQuery(() => db.attempts.count(), []);
  const lastAttempt = useLiveQuery(() => db.attempts.orderBy('createdAt').last(), []);

  const written = writtenLessons(content);
  const order = written.map((lesson) => lesson.slug);
  const slug = currentLesson(order, records);
  const lesson = slug ? content.lessons[slug] : undefined;
  const record = slug ? records.get(slug) : undefined;
  const exercise = lesson ? content.practice[lesson.exercise] : undefined;
  const now = Date.now();
  const seed = daySeed(now) + offset;
  const items = suggest({ order, records, practice: practiceByLesson(content), log, now, prompt: makePrompt(content.prompts, seed) });
  const exerciseCount = Object.keys(content.practice).length;
  const resourceCount = Object.keys(content.resources).length;
  const teachers = [...new Set(Object.values(content.resources).map((r) => r.teacher))].slice(0, 2).join(', ');

  const places: { route: string; icon: IconName; title: string; text: string }[] = [
    { route: href('course'), icon: 'course', title: 'Course', text: `All ${TOTAL_LESSONS(content)} lessons. Work through them in order or go straight to the one you need.` },
    { route: href('practice'), icon: 'practice', title: 'Practice', text: `${exerciseCount} exercises from every lesson, plus a modelling prompt each day.` },
    { route: href('library'), icon: 'library', title: 'Library', text: `${resourceCount} videos and pages from ${teachers} and other teachers, and the example models.` },
    { route: href('models'), icon: 'models', title: 'Models', text: attemptCount ? `${attemptCount} model${attemptCount === 1 ? '' : 's'} so far. Compare your first attempts with your latest.` : 'Every model you add, with its renders and measurements.' },
    { route: './workshop.html', icon: 'workshop', title: 'Workshop', text: 'Describe a model and Claude Code or Codex builds it in Blender.' },
  ];

  return (
    <div className="page home">
      <section className="continue" aria-labelledby="continue-title">
        {lesson && exercise ? (
          <>
            <div className="continue-text">
              <h1 id="continue-title">{record ? 'Continue' : 'Next'}: Lesson {lesson.number}, {lesson.title}</h1>
              <p>{record
                ? `You've tried the exercise. Do it again whenever you like; the lesson is done when every check holds.`
                : `${lesson.summary} The exercise takes about ${exercise.minutes} minutes.`}</p>
              <div className="actions">
                <a className="button primary" href={href('lesson', lesson.slug)}>{record ? 'Back to the lesson' : 'Open the lesson'}</a>
                <a className="button" href={href('do', exercise.id)}>Go to the exercise</a>
              </div>
            </div>
            <LessonArt content={content} lesson={lesson} />
          </>
        ) : (
          <div className="continue-text">
            <h1 id="continue-title">You've finished every lesson</h1>
            <p>Keep your skills up with the exercises below, or go back to any lesson in the course.</p>
          </div>
        )}
      </section>

      <ul className="place-cards stagger" aria-label="Places">
        {places.map((place) => (
          <li key={place.title}>
            <a className="card place-card" href={place.route}>
              <span className="place-card-icon"><Icon name={place.icon} size={22} /></span>
              <span className="card-title">{place.title}</span>
              <span className="card-text">{place.text}</span>
            </a>
          </li>
        ))}
      </ul>

      <section aria-labelledby="practice-title">
        <div className="section-head">
          <h2 id="practice-title">Practice</h2>
          <a href={href('practice')}>All exercises</a>
        </div>
        <Suggestions items={items} seed={seed} onAnother={() => setOffset((value) => value + 1)} />
      </section>

      {lastAttempt ? (
        <section aria-labelledby="last-title">
          <div className="section-head">
            <h2 id="last-title">Your last model</h2>
            <a href={href('models')}>Models</a>
          </div>
          <a className="card last-page" href={href('models', lastAttempt.id!)}>
            {lastAttempt.renders.persp ? <BlobImage blob={lastAttempt.renders.persp} alt="" className="last-page-image" /> : <span className="last-page-image empty-render" />}
            <span>
              <span className="card-title">{content.practice[lastAttempt.practiceId]?.title ?? 'Modelling prompt'}</span>
              <span className="card-meta">{shortDate(lastAttempt.createdAt)}</span>
            </span>
          </a>
        </section>
      ) : null}
    </div>
  );
}
