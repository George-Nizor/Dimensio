import { useContent } from '../content/load';
import type { Resource } from '../content/types';

export function Credits() {
  const content = useContent();
  const byTeacher = new Map<string, Resource[]>();
  for (const resource of Object.values(content.resources)) {
    byTeacher.set(resource.teacher, [...(byTeacher.get(resource.teacher) ?? []), resource]);
  }
  const models = Object.values(content.references);
  return (
    <div className="page credits narrow">
      <header className="page-head">
        <h1>Teachers and credits</h1>
        <p className="lede">Dimensio links to these teachers' own lessons and never copies them. A lesson that uses a teacher's method names them. Every shortcut and number in a lesson comes from the Blender 5.2 manual or one of these lessons.</p>
      </header>
      <ul className="credit-list">
        {[...byTeacher.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([teacher, resources]) => (
          <li key={teacher}>
            <h2>{teacher}</h2>
            <ul>
              {resources.map((resource) => (
                <li key={resource.id}><a href={resource.url} target="_blank" rel="noreferrer">{resource.title}</a> <span className="meta">· {resource.kind}</span></li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {models.length ? (
        <section>
          <h2>Example models</h2>
          <p>Dimensio's own Blender scripts render the example models' pictures. Every example model is under a licence that lets Dimensio include it.</p>
          <ul className="credit-models">
            {models.map((model) => (
              <li key={model.id}>
                <span className="card-title">{model.title}</span> <span className="meta">· {model.credit} · {model.licence}{model.source ? <> · <a href={model.source} target="_blank" rel="noreferrer">source</a></> : null}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section>
        <h2>Type and mark</h2>
        <p>Fraunces by Undercase Type, Commissioner by Kostas Bartsokas, and Spline Sans Mono by Eben Sorkin and Mirko Velimirovic, all under the SIL Open Font License. The cube mark is part of the Instrumenta suite.</p>
      </section>
      <section>
        <h2>Blender</h2>
        <p>Blender is free software from the Blender Foundation, under the GNU General Public License. Dimensio runs your copy of Blender and does not include it.</p>
      </section>
    </div>
  );
}
