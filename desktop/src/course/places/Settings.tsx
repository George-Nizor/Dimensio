import { useEffect, useState } from 'react';
import pkg from '../../../package.json';
import { courseBridge, problemText, type BlenderStatus } from '../bridge';
import { href } from '../router';
import { useAppData } from '../store/appData';
import { deleteEverything, saveSetting, type Settings, type Theme } from '../store/db';

export function SettingsPage() {
  const { settings } = useAppData();
  // The screen follows a change at once; the store catches up a moment later.
  const [local, setLocal] = useState<Settings>(settings);
  const [confirming, setConfirming] = useState(false);
  useEffect(() => setLocal(settings), [settings]);
  const change = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setLocal((previous) => ({ ...previous, [key]: value }));
    void saveSetting(key, value);
  };
  const themes: [Theme, string][] = [['system', 'Match the computer'], ['light', 'Light'], ['dark', 'Dark']];

  return (
    <div className="page settings narrow">
      <header className="page-head"><h1>Settings</h1></header>

      <BlenderSetting />

      <fieldset className="setting">
        <legend>Theme</legend>
        {themes.map(([value, label]) => (
          <label key={value} className="radio">
            <input type="radio" name="theme" checked={local.theme === value} onChange={() => change('theme', value)} />
            {label}
          </label>
        ))}
      </fieldset>

      <fieldset className="setting">
        <legend>Lessons</legend>
        <label className="check-box">
          <input type="checkbox" checked={local.foldSteps} onChange={(event) => change('foldSteps', event.target.checked)} />
          <span>Hide the steps on every lesson. Useful if you already know Blender and only want the video, the exercise and the checks.</span>
        </label>
        <label className="check-box">
          <input type="checkbox" checked={local.knowsBlender} onChange={(event) => change('knowsBlender', event.target.checked)} />
          <span>Show "I already know this" on every lesson in the course</span>
        </label>
        <label className="check-box">
          <input type="checkbox" checked={local.sound} onChange={(event) => change('sound', event.target.checked)} />
          <span>Play a quiet tone when a timer round ends</span>
        </label>
        <p className="meta"><a href={href('welcome')}>Where to start</a> shows the first page again.</p>
      </fieldset>

      <fieldset className="setting">
        <legend>Motion</legend>
        <label className="check-box">
          <input type="checkbox" checked={local.reduceMotion} onChange={(event) => change('reduceMotion', event.target.checked)} />
          <span>Reduce animation. Pages fade in instead of moving, and the opening animation is shorter.</span>
        </label>
      </fieldset>

      <section className="setting">
        <h2>Workshop agent</h2>
        <p>The Workshop builds models from a prompt with Claude Code or Codex. You choose the agent and sign in to it in the <a href="./workshop.html#setup">Workshop's setup</a>.</p>
      </section>

      <section className="setting">
        <h2>Your data</h2>
        <p>Your models, practice history and settings stay in this app on this computer. Nothing is sent anywhere. Your .blend files stay in their own folders.</p>
        {confirming ? (
          <div className="actions">
            <button type="button" className="button danger" onClick={async () => { await deleteEverything(); setConfirming(false); }}>Delete all my models and history</button>
            <button type="button" className="quiet" onClick={() => setConfirming(false)}>Keep everything</button>
          </div>
        ) : (
          <button type="button" className="quiet" onClick={() => setConfirming(true)}>Delete everything</button>
        )}
      </section>

      <p className="meta">Dimensio {pkg.version} · <a href={href('credits')}>Teachers and credits</a></p>
    </div>
  );
}

// Where Blender is, which version it is, and what to do when it is missing or older than 5.2.
function BlenderSetting() {
  const [status, setStatus] = useState<BlenderStatus | null>(null);
  const [folder, setFolder] = useState('');
  const [problem, setProblem] = useState('');

  useEffect(() => {
    let live = true;
    courseBridge().then(async (bridge) => {
      const [found, course] = await Promise.all([bridge.blenderStatus(), bridge.courseFolder().catch(() => '')]);
      if (live) { setStatus(found); setFolder(course); }
    }).catch((error: unknown) => { if (live) setProblem(problemText(error, "Dimensio couldn't look for Blender.")); });
    return () => { live = false; };
  }, []);

  const choose = async () => {
    setProblem('');
    try {
      const chosen = await (await courseBridge()).chooseBlender();
      if (chosen) setStatus(chosen);
    } catch (error) {
      setProblem(problemText(error, "The file picker didn't open."));
    }
  };

  const tooOld = Boolean(status?.version && status.supported === false);
  return (
    <section className="setting blender-setting" aria-labelledby="blender-title">
      <h2 id="blender-title">Blender</h2>
      {status ? (
        <dl className="facts">
          <dt>Blender</dt><dd className="mono-path">{status.path ?? 'Not found'}</dd>
          <dt>Version</dt><dd>{status.version ?? 'Unknown'}{tooOld ? ', older than 5.2' : ''}</dd>
          {folder ? <><dt>Course folder</dt><dd className="mono-path">{folder}</dd></> : null}
        </dl>
      ) : problem ? null : <p className="meta">Looking for Blender.</p>}
      {status && (!status.ok || tooOld) ? (
        <p className="fix">{[status.reason, status.fix || 'Install Blender 5.2 LTS from blender.org, or choose blender.exe below. The course is written for 5.2.'].filter(Boolean).join(' ')}</p>
      ) : null}
      {problem ? <p className="error" role="alert">{problem}</p> : null}
      <div className="actions">
        <button type="button" className="button small" onClick={() => void choose()}>Choose blender.exe</button>
        <span className="meta">Starter scenes and copies of the example models go in the course folder.</span>
      </div>
    </section>
  );
}
