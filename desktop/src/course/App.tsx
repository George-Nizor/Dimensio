import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ContentContext, loadContent } from './content/load';
import type { Content } from './content/types';
import { Course } from './places/Course';
import { Credits } from './places/Credits';
import { ExercisePage } from './places/Exercise';
import { Home } from './places/Home';
import { LessonPage, NotFound } from './places/Lesson';
import { Library } from './places/Library';
import { ModelDetail, Models } from './places/Models';
import { Practice } from './places/Practice';
import { SettingsPage } from './places/Settings';
import { Welcome } from './places/Welcome';
import { href, useRoute } from './router';
import { AppDataContext, useAppData, type AppData } from './store/appData';
import { db, readSettings, saveSetting, type Theme } from './store/db';
import { Icon, type IconName } from './ui/Icons';
import { Mark } from './ui/Mark';
import { Splash } from './ui/Splash';

// The tabs. The Workshop is a page of its own (workshop.html), Forge3D's renderer, with the same
// tabs along its top.
const TABS: { route: string; label: string; icon: IconName }[] = [
  { route: '', label: 'Home', icon: 'home' },
  { route: 'course', label: 'Course', icon: 'course' },
  { route: 'practice', label: 'Practice', icon: 'practice' },
  { route: 'library', label: 'Library', icon: 'library' },
  { route: 'models', label: 'Models', icon: 'models' },
];

// The opening animation plays once per window, not on every reload of a route.
const splashSeen = () => {
  try { return sessionStorage.getItem('dimensio-splash') === '1'; } catch { return false; }
};

// The Workshop keeps its theme in localStorage under this key. The course app writes it too, so the
// two pages of the window agree, and the window's own chrome follows through window.dimensio.setTheme.
const SHARED_THEME = 'forge3d.theme';
const THEMES: Theme[] = ['system', 'light', 'dark'];

function readSharedTheme(): Theme | null {
  try {
    const value = JSON.parse(localStorage.getItem(SHARED_THEME) ?? 'null');
    return THEMES.includes(value) ? value : null;
  } catch { return null; }
}

export function App() {
  const [content, setContent] = useState<Content | null>(null);
  const [problem, setProblem] = useState('');
  const [splash, setSplash] = useState(() => !splashSeen());
  const route = useRoute();
  const records = useLiveQuery(() => db.lessons.toArray(), []);
  const log = useLiveQuery(() => db.log.toArray(), []);
  const settings = useLiveQuery(readSettings, []);

  useEffect(() => {
    loadContent().then(setContent, (error: unknown) => setProblem(error instanceof Error ? error.message : String(error)));
  }, []);

  // The Workshop may have changed the theme since this page last ran.
  const synced = useRef(false);
  useEffect(() => {
    if (!settings || synced.current) return;
    synced.current = true;
    const shared = readSharedTheme();
    if (shared && shared !== settings.theme) void saveSetting('theme', shared);
  }, [settings]);

  const theme = settings?.theme;
  const reduceMotion = settings?.reduceMotion;
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    if (theme === 'system') delete root.dataset.theme;
    else root.dataset.theme = theme;
    if (reduceMotion) root.dataset.motion = 'reduced';
    else delete root.dataset.motion;
    try { localStorage.setItem(SHARED_THEME, JSON.stringify(theme)); } catch { /* storage is optional */ }
    window.dimensio?.setTheme?.(theme)?.catch?.(() => {});
  }, [theme, reduceMotion]);

  const endSplash = useCallback(() => {
    try { sessionStorage.setItem('dimensio-splash', '1'); } catch { /* a private window plays it again next time */ }
    setSplash(false);
  }, []);

  const data = useMemo<AppData | null>(() => (records && log && settings ? { records: new Map(records.map((r) => [r.slug, r])), log, settings } : null), [records, log, settings]);
  const ready = Boolean((content && data) || problem);

  let body = null;
  if (problem) body = <main className="page"><h1>Dimensio could not start</h1><p>{problem}</p></main>;
  else if (content && data) {
    body = (
      <ContentContext.Provider value={content}>
        <AppDataContext.Provider value={data}>
          <Shell route={route} />
        </AppDataContext.Provider>
      </ContentContext.Provider>
    );
  }

  return (
    <>
      {body}
      {splash ? <Splash ready={ready} onDone={endSplash} /> : null}
    </>
  );
}

function Shell({ route }: { route: string[] }) {
  const { records, log, settings } = useAppData();
  const [place = '', id] = route;
  const fresh = !settings.welcomed && records.size === 0 && log.length === 0;

  let page;
  switch (place) {
    case '': page = fresh ? <Welcome /> : <Home />; break;
    case 'welcome': page = <Welcome />; break;
    case 'course': page = <Course />; break;
    case 'lesson': page = <LessonPage slug={id ?? ''} />; break;
    case 'do': page = <ExercisePage practiceId={id} />; break;
    case 'free': page = <ExercisePage seed={Number(id) || 0} />; break;
    case 'practice': page = <Practice />; break;
    case 'library': page = <Library />; break;
    case 'models': page = id ? <ModelDetail id={Number(id)} /> : <Models />; break;
    case 'settings': page = <SettingsPage />; break;
    case 'credits': page = <Credits />; break;
    default: page = <NotFound />;
  }

  // The exercise fills the window: the reference, the steps and the clock, and nothing else.
  if (place === 'do' || place === 'free') return <div className="app app-exercise" key={route.join('/')}>{page}</div>;

  const active = place === 'lesson' ? 'course' : place;
  return (
    <div className="app">
      <Header active={place === '' && fresh ? 'welcome' : active} />
      <main className="main">
        <div className="page-enter" key={route.join('/')}>{page}</div>
      </main>
    </div>
  );
}

function Header({ active }: { active: string }) {
  return (
    <header className="app-header">
      <a className="brand" href={href()} aria-label="Dimensio, home"><Mark size={32} /><span>Dimensio</span></a>
      <nav className="tabs" aria-label="Places">
        {TABS.map((tab) => (
          <a key={tab.label} className="tab" href={href(...(tab.route ? [tab.route] : []))} aria-current={active === tab.route ? 'page' : undefined}>
            <Icon name={tab.icon} size={18} /><span>{tab.label}</span>
          </a>
        ))}
        <a className="tab" href="./workshop.html"><Icon name="workshop" size={18} /><span>Workshop</span></a>
      </nav>
      <nav className="header-end" aria-label="About">
        <a className="tab small" href={href('settings')} aria-label="Settings" title="Settings" aria-current={active === 'settings' ? 'page' : undefined}><Icon name="settings" size={18} /><span>Settings</span></a>
        <a className="tab small" href={href('credits')} aria-label="Credits" title="Credits" aria-current={active === 'credits' ? 'page' : undefined}><Icon name="credits" size={18} /><span>Credits</span></a>
      </nav>
    </header>
  );
}
