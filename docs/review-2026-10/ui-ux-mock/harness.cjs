const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('/workspace/dev_projects_master/_BoneheadLabs/bonehead-clicker-extension/node_modules/playwright-core');
const R='/workspace/dev_projects_master/_PersonalProjects/Instrumenta/Forge3D/references';
const dir=path.join(__dirname,process.env.SITE||'site'),out=path.join(__dirname,'shots');
const types={'.js':'text/javascript','.css':'text/css','.html':'text/html','.woff2':'font/woff2','.png':'image/png','.glb':'model/gltf-binary','.json':'application/json','.txt':'text/plain'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';let f;
 if(p.startsWith('/artifacts/')){const e=path.extname(p);f= e==='.png'?(p.includes('controller')?R+'/game-controller-v001/reference.png':R+'/medical-pod-v001/reference.png'):e==='.glb'?path.join(__dirname,'model.glb'):e==='.json'?path.join(__dirname,'val.json'):path.join(__dirname,'log.txt');}
 else f=path.join(dir,p);
 if(!fs.existsSync(f)){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);});
fs.writeFileSync(path.join(__dirname,'val.json'),JSON.stringify({manifold:true,triangle_budget:true,uv_overlap:false,scale_m:1.8},null,1));
fs.writeFileSync(path.join(__dirname,'log.txt'),'[blender] building pedestal\n[blender] decimate 0.42\n[export] model.glb 4.0 KiB\n');
srv.listen(0,async()=>{
 const port=srv.address().port;
 const browser=await chromium.launch({executablePath:process.env.HOME+'/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const W=+process.env.W||1540,H=+process.env.H||900;
 const page=await browser.newPage({viewport:{width:W,height:H}});
 const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await page.addInitScript(()=>{
  const q=new URLSearchParams(location.search);const sc=q.get('s')||'first';
  const now=Date.now();const iso=(m)=>new Date(now-m*60000).toISOString();
  const arts=[
   {path:'renders/hero.png',name:'hero.png',preview_role:'primary-image',size_bytes:812331,media_type:'image/png'},
   {path:'model.glb',name:'model.glb',preview_role:'model',size_bytes:4008,media_type:'model/gltf-binary'},
   {path:'validation.json',name:'validation.json',preview_role:'validation',size_bytes:220,media_type:'application/json'},
   {path:'build.log.txt',name:'build.log.txt',preview_role:'text',size_bytes:120,media_type:'text/plain'},
   {path:'controller.png',name:'controller.png',preview_role:'image',size_bytes:512000,media_type:'image/png'}];
  const done={run_id:'r1',name:'Medical pod',prompt:'A sci-fi medical pod, game-ready, under 20k tris, PBR',status:'completed',workflow_route:'authored-blender',created_at:iso(90),updated_at:iso(70),artifacts:arts,
   steps:[{name:'Route request',status:'completed'},{name:'Model in Blender',status:'completed'},{name:'Export GLB',status:'completed'},{name:'Validate',status:'completed'}],validation:{manifold:true,triangle_budget:true,uv_overlap:false},
   transcript:[{kind:'user',at:iso(90),text:'A sci-fi medical pod, game-ready'},{kind:'agent',at:iso(80),text:'Routing to authored Blender. I will block out the pod shell first.'},{kind:'log',at:iso(75),text:'[blender] decimate 0.42'},{kind:'error',at:iso(72),text:'UV overlap detected on lid_inner'}]};
  const running={run_id:'r2',name:'Controller',prompt:'Game controller from this reference photo',status:'running',workflow_route:'image-to-mesh',created_at:iso(4),updated_at:iso(1),artifacts:[arts[4]],
   steps:[{name:'Route request',status:'completed'},{name:'Generate mesh with SPAR3D',status:'running',detail:'spar3d inference'}],transcript:[{kind:'agent',at:iso(3),text:'Running SPAR3D on the reference.'}]};
  const failed={run_id:'r3',name:'Stump',prompt:'Mossy tree stump as a gaussian splat',status:'failed',workflow_route:'gaussian-splat',failure:'TripoSplat exited with code 1 (CUDA out of memory)',created_at:iso(60*26),updated_at:iso(60*26),artifacts:[],
   steps:[{name:'Route request',status:'completed'},{name:'Generate splat',status:'failed'}],transcript:[{kind:'error',at:iso(60*26),text:'CUDA out of memory. Tried to allocate 2.00 GiB'}]};
  let runs=[],tools={codex:true,blender:true,godot:true,wsl:true},active=null,err='',skill={state:'ready'};
  if(sc==='first'){runs=[];}
  if(sc==='checking'){runs=[];tools={};}
  if(sc==='offline'){runs=[];err='Codex App Server could not start: codex not found on PATH';tools={codex:false,blender:true,godot:false,wsl:true};}
  if(['done','image','model','checks','logs','menu','dialog','approval','settings','text'].includes(sc)){runs=[done,failed];}
  if(sc==='running'){runs=[running,done,failed];active={runId:'r2'};}
  if(sc==='failed'){runs=[failed,done];}
  if(sc==='plugin'){runs=[done];skill={state:'version-mismatch',installedVersion:'0.2.0',bundledVersion:'0.2.2'};tools={codex:true,blender:true,godot:false,wsl:true};}
  const panels={library:['first','checking','offline'].includes(sc)?false:true,inspector:true};
  localStorage.setItem('forge3d.panels',JSON.stringify(panels));
  const noop=()=>()=>{};
  window.forge3d={bootstrap:async()=>({version:'0.2.2',activeJob:active,appServerError:err,skill,tools,runs,models:[{id:'gpt-5',displayName:'GPT-5'}]}),
   onState:noop,onEvent:noop,onApproval:(cb)=>{window.__approve=cb;return ()=>{}},onError:noop,refreshTools:async()=>({}),artifactAction:async()=>({}),pickAttachments:async()=>[],continueRun:async()=>({})};
 });
 const sel=async(s)=>{await page.click(s).catch(e=>console.log('miss',s))};
 const scenes={
  first:async()=>{}, checking:async()=>{}, offline:async()=>{}, plugin:async()=>{},
  done:async()=>{}, image:async()=>{await sel('[data-tab="artifacts"]');await sel('[data-artifact-path="renders/hero.png"]');},
  model:async()=>{await sel('[data-tab="artifacts"]');await sel('[data-artifact-path="model.glb"]');await page.waitForTimeout(2500);},
  checks:async()=>{await sel('[data-tab="validation"]');},
  text:async()=>{await sel('[data-tab="artifacts"]');await sel('[data-artifact-path="validation.json"]');await page.waitForTimeout(500)},
  logs:async()=>{await sel('[data-tab="logs"]');},
  running:async()=>{},
  failed:async()=>{await sel('[data-tab="logs"]');},
  menu:async()=>{await page.hover('.run-card');await sel('.run-more');},
  dialog:async()=>{await page.hover('.run-card');await sel('.run-more');await sel('[data-menu-action="continue"]');},
  settings:async()=>{await sel('#settings-toggle');},
  approval:async()=>{await page.evaluate(()=>window.__approve({requestId:1,method:'item/commandExecution/requestApproval',params:{command:'blender --background --python build_pod.py',reason:'Codex wants to run Blender headless to build the pod.'}}));},
 };
 const only=process.argv[2]?process.argv[2].split(','):Object.keys(scenes);
 for(const n of only){await page.goto(`http://127.0.0.1:${port}/?s=${n}`);await page.waitForTimeout(900);await scenes[n]();await page.waitForTimeout(400);
   await page.screenshot({path:path.join(out,`${process.env.P||''}${n}.png`)});}
 console.log('errors',[...new Set(errs)].slice(0,10));
 await browser.close();srv.close();
});
