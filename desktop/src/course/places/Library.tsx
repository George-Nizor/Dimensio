import { useState } from 'react';
import { courseBridge, problemText } from '../bridge';
import { useContent } from '../content/load';
import type { Lesson, ReferenceModel, Resource } from '../content/types';
import { href } from '../router';
import { Icon } from '../ui/Icons';
import { ResourceLine } from '../ui/Resource';

export function Library() {
  const content = useContent();
  const [query, setQuery] = useState('');
  const [teacher, setTeacher] = useState('');
  const [videosOnly, setVideosOnly] = useState(false);

  // Which lessons use each resource, in course order.
  const usedBy = new Map<string, Lesson[]>();
  for (const part of content.parts) {
    for (const entry of part.lessons) {
      const lesson = content.lessons[entry.slug];
      for (const id of lesson?.watch ?? []) usedBy.set(id, [...(usedBy.get(id) ?? []), lesson!]);
    }
  }
  // Which lessons use each example model, through their practice items.
  const modelUsedBy = new Map<string, Lesson[]>();
  for (const item of Object.values(content.practice)) {
    const lesson = content.lessons[item.lesson];
    if (item.reference.type !== 'model' || !lesson) continue;
    const list = modelUsedBy.get(item.reference.model) ?? [];
    if (!list.includes(lesson)) modelUsedBy.set(item.reference.model, [...list, lesson]);
  }
  const resources = Object.values(content.resources);
  const q = query.trim().toLowerCase();
  const fits = (r: Resource, skipTeacher = false) =>
    (!q || `${r.title} ${r.teacher} ${r.kind} ${(usedBy.get(r.id) ?? []).map((l) => l.title).join(' ')}`.toLowerCase().includes(q))
    && (skipTeacher || !teacher || r.teacher === teacher)
    && (!videosOnly || Boolean(r.youtube));
  const teachers = [...new Set(resources.map((r) => r.teacher))].sort((a, b) => a.localeCompare(b));
  const shown = resources.filter((r) => fits(r));
  const models = Object.values(content.references).filter((m) => !q || `${m.title} ${m.credit} ${m.alt}`.toLowerCase().includes(q));
  const showModels = models.length > 0 && !teacher && !videosOnly;
  const groups = [
    ...content.parts.map((part) => ({ title: `Part ${part.number}: ${part.title}`, items: shown.filter((r) => usedBy.get(r.id)?.[0]?.part === part.number) })),
    { title: 'Other resources', items: shown.filter((r) => !usedBy.has(r.id)) },
  ].filter((group) => group.items.length);

  return (
    <div className="page library">
      <header className="page-head">
        <h1>Library</h1>
        <p className="lede">Videos and written pages from other teachers, grouped by the part of the course that uses them, and the example models the exercises copy. You can play the videos here or open them in your browser. Each one shows which lesson uses it and whether it costs anything.</p>
      </header>

      <div className="library-layout">
        <aside className="filters" aria-label="Filters">
          <label className="field search-field">
            <Icon name="search" size={16} />
            <span className="visually-hidden">Search the library</span>
            <input type="search" placeholder="Search the library" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="toggle">
            <input type="checkbox" checked={videosOnly} onChange={(event) => setVideosOnly(event.target.checked)} />
            <span>Only videos that play here</span>
          </label>
          <div className="filter-group" role="group" aria-label="Teachers">
            <h3>Teachers</h3>
            <button type="button" className="filter-option" aria-pressed={teacher === ''} onClick={() => setTeacher('')}><span>Every teacher</span></button>
            {teachers.map((name) => (
              <button key={name} type="button" className="filter-option" aria-pressed={teacher === name} onClick={() => setTeacher(name)}>
                <span>{name}</span><span className="count">{resources.filter((r) => r.teacher === name && fits(r, true)).length}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="results">
          {groups.length ? groups.map((group) => (
            <section key={group.title} className="library-group" aria-label={group.title}>
              <h2>{group.title}</h2>
              <ul className="resources">
                {group.items.map((resource) => (
                  <ResourceLine key={resource.id} resource={resource} extra={usedBy.get(resource.id)?.length ? (
                    <span className="used-in">Used in {usedBy.get(resource.id)!.map((lesson, i) => <span key={lesson.slug}>{i ? ', ' : ''}<a href={href('lesson', lesson.slug)}>lesson {lesson.number}, {lesson.title}</a></span>)}</span>
                  ) : undefined} />
                ))}
              </ul>
            </section>
          )) : null}
          {showModels ? (
            <section className="library-group" aria-labelledby="models-title">
              <h2 id="models-title">Example models</h2>
              <ul className="model-cards">
                {models.map((model) => <ModelCard key={model.id} model={model} usedBy={modelUsedBy.get(model.id) ?? []} />)}
              </ul>
            </section>
          ) : null}
          {!groups.length && !showModels ? <p className="empty">Nothing in the library matches that.</p> : null}
        </div>
      </div>
    </div>
  );
}

// An example model: its render, where it came from, and a button that opens a copy in Blender.
function ModelCard({ model, usedBy }: { model: ReferenceModel; usedBy: Lesson[] }) {
  const [problem, setProblem] = useState('');
  const open = async () => {
    setProblem('');
    try {
      await (await courseBridge()).openInBlender(model.file);
    } catch (error) {
      setProblem(problemText(error, "Blender didn't open."));
    }
  };
  return (
    <li className="card model-card">
      {model.renders.persp ? <img className="model-card-image" src={model.renders.persp} alt={model.alt} /> : null}
      <div className="model-card-body">
        <span className="card-title">{model.title}</span>
        <span className="meta">{model.credit} · {model.licence}{model.source ? <> · <a href={model.source} target="_blank" rel="noreferrer">source</a></> : null}</span>
        {usedBy.length ? <span className="used-in">Used in {usedBy.map((lesson, i) => <span key={lesson.slug}>{i ? ', ' : ''}<a href={href('lesson', lesson.slug)}>lesson {lesson.number}, {lesson.title}</a></span>)}</span> : null}
        <span className="resource-actions"><button type="button" className="button small" onClick={() => void open()}><Icon name="open" size={14} />Open in Blender</button></span>
        {problem ? <span className="error" role="alert">{problem}</span> : null}
      </div>
    </li>
  );
}
