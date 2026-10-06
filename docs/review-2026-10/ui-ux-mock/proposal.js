// Proposal mock only: swaps the line glyphs for brand icons and restages a few states.
(function(){
const OLD=window.__OLD, R=(n,s,h)=>window.ForgeIcons.render(n,{size:s,hue:h});
const norm=(h)=>{const t=document.createElementNS('http://www.w3.org/2000/svg','svg');t.innerHTML=h;return t.innerHTML.replace(/\s+/g,' ').trim();};const byMarkup=new Map(Object.entries(OLD).map(([k,v])=>[norm(v),k]));
const LINE=new Set(['add','chevronDown','chevronLeft','close','more','search','fullscreen']);
const simple={archive:'archive',attach:'attach',camera:'capture',checkCircle:'done',clipboard:'plan',copy:'copy',duplicate:'copy',file:'page',film:'film',folder:'folder',frame:'frame',grid:'grid',hand:'pan',image:'render',logs:'page',nodes:'plan',open:'open',orbit:'orbit',output:'crate',resume:'resume',settings:'gear',shield:'shield',sparkle:'splat',steer:'send',stop:'stop',text:'page',trash:'trash'};
const sc=new URLSearchParams(location.search).get('s')||'first';
function sizeFor(el){ if(el.closest('.stage-icon'))return 34; if(el.closest('.rail-button'))return 24; if(el.closest('.topbar-actions'))return 24; if(el.closest('.panel-foot'))return 22; if(el.closest('.run-tile,.artifact-thumb'))return 24; if(el.closest('.film-glyph'))return 30; if(el.closest('.empty-list'))return 40; if(el.closest('.menu'))return 20; if(el.closest('.report-link'))return 20; return 22; }
function swap(svg){
  const key=byMarkup.get(svg.innerHTML.replace(/\s+/g,' ').trim()); if(!key||LINE.has(key)){svg.classList.add('kept-line');svg.classList.remove('ui-icon');svg.classList.add('ui-line');return;}
  let name=simple[key];
  if(key==='cube'){ name= svg.closest('.stage-icon')?'anvil': svg.closest('.rail-button')?'wire': svg.closest('[data-artifact-action]')?'open':'teapot'; }
  if(key==='play'){ name= svg.closest('[data-artifact-action]')?'gamepad':'hammer'; }
  if(key==='check') name='done';
  let hue; if(svg.closest('[data-artifact-action="blender"]')) hue='teal';
  const stage=svg.closest('.stage-node'); if(stage&&stage.classList.contains('done')) name='done';
  if(stage&&stage.classList.contains('failed')) name='failed';
  if(stage&&stage.classList.contains('warn')) name='alert';
  const s=sizeFor(svg); const span=document.createElement('span'); span.innerHTML=R(name||'page',s,hue); svg.replaceWith(span.firstChild);
}
function pass(){
  document.querySelectorAll('svg.ui-icon').forEach(swap);
  document.querySelectorAll('i.shade-dot').forEach(i=>{const span=document.createElement('span');span.innerHTML=R('sphere',24,i.classList.contains('matte')?'stone':'ember');i.replaceWith(span.firstChild);});
  const send=document.querySelector('#send'); if(send && !send.dataset.p){ send.dataset.p=1; }
  document.querySelectorAll('#send span').forEach(s=>{ if(s.textContent==='Run'||s.textContent==='Steer') s.className='run-label'; });
  for(const [id,icon,label] of [['library-toggle','runs','Runs'],['inspector-toggle','inspect','Inspect']]){const b=document.getElementById(id); if(b&&!b.dataset.p){b.dataset.p=1;b.innerHTML=R(icon,26)+`<span>${label}</span>`;}}
  const ve=document.querySelector('.viewport-empty'); if(ve&&!ve.dataset.p){ ve.dataset.p=1; ve.innerHTML=emptyFor(sc); }
  const of=document.querySelector('.omnibox-field'); if(of&&!of.dataset.p&&['done','model','image','checks','menu','settings','text'].includes(sc)){of.dataset.p=1; const c=document.createElement('span'); c.className='scope-chip'; c.innerHTML=R('teapot',18)+'<span>Changing <b>Medical pod</b> <code>v1</code></span><button aria-label="Start a new asset instead">×</button>'; of.prepend(c); const t=of.querySelector('textarea'); t.placeholder='Describe a change to the medical pod…';}
  if(sc==='offline'){const r=document.querySelector('#send'); if(r){r.disabled=true;r.title='Codex is not reachable';}}
  document.querySelectorAll('.stage-label').forEach(l=>{const t=l.textContent;if(t===t.toUpperCase())l.textContent=t[0]+t.slice(1).toLowerCase();});
  if(sc==='running'){const d=document.querySelector('.stage-node.active .stage-detail'); if(d&&!d.dataset.p){d.dataset.p=1;d.innerHTML='SPAR3D inference <code>02:41</code>';}}
}
function emptyFor(s){
  const cube=window.InstrumentaIcons.render('forge3d',{size:112});
  if(s==='offline') return `<div class="state-card"><div class="state-icon">${R('alert',64)}</div><h2>Codex isn't reachable</h2><p>Forge3D builds through your local Codex. It could not start:</p><pre>codex not found on PATH</pre><div class="state-actions"><button class="btn primary">${R('resume',20)}<span>Check again</span></button><button class="btn">Open setup guide</button></div><ul class="readiness"><li class="bad">${R('failed',16)}Codex</li><li class="ok">${R('done',16)}Blender <code>4.5.3</code></li><li class="bad">${R('failed',16)}Godot</li><li class="ok">${R('done',16)}WSL</li></ul></div>`;
  if(s==='failed') return `<div class="state-card"><div class="state-icon">${R('failed',64)}</div><h2>The build stopped</h2><p>Generate splat failed after 3 minutes. Nothing was written.</p><pre>TripoSplat exited with code 1 (CUDA out of memory)</pre><div class="state-actions"><button class="btn primary">${R('resume',20)}<span>Try again with Draft quality</span></button><button class="btn">${R('page',20)}<span>Open logs</span></button></div></div>`;
  return `<div class="hero-empty"><span class="hero-cube ii-hover">${cube}</span><h2>What shall we forge?</h2><p>Describe an asset, or attach a photo to turn into one. It is built on this machine and appears here.</p><div class="starters"><button class="starter">${R('teapot',28)}<span>A low-poly treasure chest, game-ready</span></button><button class="starter">${R('render',28)}<span>Turn a photo into a 3D model</span></button><button class="starter">${R('splat',28)}<span>A gaussian splat from a photo</span></button></div></div>`;
}
new MutationObserver(()=>pass()).observe(document.documentElement,{subtree:true,childList:true});
document.addEventListener('DOMContentLoaded',pass); setTimeout(pass,300);
})();
