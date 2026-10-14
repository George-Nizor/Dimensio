import { TOTAL_LESSONS, useContent } from '../content/load';
import { href } from '../router';
import { saveSetting } from '../store/db';

// "Edit Mode, Extrude, Loop cuts and 5 more": a part's lessons, short enough to scan 16 parts.
function titles(list: string[]): string {
  return list.length <= 4 ? list.join(', ') : `${list.slice(0, 3).join(', ')} and ${list.length - 3} more`;
}

// What opens the first time, and again from Settings.
export function Welcome() {
  const content = useContent();
  const first = content.parts[0]?.lessons[0];
  const welcomed = () => void saveSetting('welcomed', true);
  const experienced = () => {
    void saveSetting('knowsBlender', true);
    welcomed();
  };

  return (
    <div className="page welcome narrow">
      <section className="welcome-intro">
        <h1>Welcome to Dimensio</h1>
        <p>Dimensio is a course for learning Blender, with a library of exercises for whenever you want to practise. It works whether you've never opened Blender or you've used it for years and want to fill in the gaps.</p>
        <p>Each lesson covers one skill. You read a short explanation and watch a video from a teacher who explains it well. Then you do an exercise in Blender while Dimensio shows the reference and keeps time. Afterwards you add your .blend file and check it against a short list. Dimensio measures the model, renders it from four sides and keeps it in Models, so you can see how you're improving.</p>
        <p>You'll need Blender 5.2 and a mouse with a scroll wheel. Everything you save stays on this computer.</p>
      </section>

      <section aria-labelledby="start-title">
        <h2 id="start-title">Where to start</h2>
        <div className="start-options">
          <div className="start-option">
            <div>
              <h3>I'm new to Blender</h3>
              <p>Start with lesson 1. It teaches you to move around the 3D Viewport, which every other lesson relies on.</p>
            </div>
            {first ? <a className="button primary" href={href('lesson', first.slug)} onClick={welcomed}>Start lesson 1</a> : null}
          </div>
          <div className="start-option">
            <div>
              <h3>I've used Blender</h3>
              <p>Look through the course and open the lessons you're unsure about. Every lesson has an "I already know this" button, so the ones you skip stop coming up.</p>
            </div>
            <a className="button" href={href('course')} onClick={experienced}>Browse the course</a>
          </div>
          <div className="start-option">
            <div>
              <h3>Model now</h3>
              <p>The practice library has exercises from every lesson and a new modelling prompt each day.</p>
            </div>
            <a className="button" href={href('practice')} onClick={welcomed}>Go to practice</a>
          </div>
        </div>
      </section>

      <section aria-labelledby="covers-title">
        <h2 id="covers-title">What the course covers</h2>
        <p>{TOTAL_LESSONS(content)} lessons in {content.parts.length} parts. Each part builds on the one before it, but every lesson is open from the start.</p>
        <ul className="part-list">
          {content.parts.map((part) => (
            <li key={part.number}>
              <a href={href('course')} onClick={welcomed}>
                <span>
                  <span className="part-list-title">Part {part.number}: {part.title}</span>
                  <span className="part-list-text">{titles(part.lessons.map((entry) => entry.title))}</span>
                </span>
                <span className="meta">{part.lessons.length} lessons</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
