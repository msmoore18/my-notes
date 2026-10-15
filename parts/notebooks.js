// ===== Notebooks =====
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function ensureNb(){data.notebooks=data.notebooks||[];if(!data.notebooks.length){data.notebooks.push({id:uid(),name:'General',color:GPAL[0],pages:[]});if(fh)save()}
 data.notebooks.forEach(n=>{if(!n.color)n.color=gcolNb(n);n.pages=n.pages||[]})}
function gcolNb(n){const used=data.notebooks.map(x=>x.color).filter(Boolean);n.color=n.color||GPAL.find(c=>!used.includes(c))||GPAL[data.notebooks.length%GPAL.length];return n.color}
let curNb=null,curPg=null;
function loadNbSel(){try{curNb=localStorage.getItem('nt_nb')||null;curPg=localStorage.getItem('nt_pg')||null}catch(e){}}
function saveNbSel(){try{if(curNb)localStorage.setItem('nt_nb',curNb);else localStorage.removeItem('nt_nb');if(curPg)localStorage.setItem('nt_pg',curPg);else localStorage.removeItem('nt_pg')}catch(e){}}
function getNb(){return (data.notebooks||[]).find(n=>n.id===curNb)}
function getPg(){const n=getNb();return n&&(n.pages||[]).find(p=>p.id===curPg)}
function saveNbPage(){const p=getPg();if(!p||!$('nbtxt'))return;p.html=noteHTML($('nbtxt'));p.title=$('nbtitle').value.trim()||p.title||'Untitled';p.updated=new Date().toISOString();flushNbList()}
function activeEd(){return (!$('books').hidden&&!$('nbpage').hidden)?$('nbtxt'):$('txt')}
function saveActive(){if(!$('books').hidden&&getPg())saveNbPage();else data.notes[iso(cur)]=noteHTML($('txt'));save()}
function rBooks(){ensureNb();const L=$('nblist');L.innerHTML='';
 if(!curNb||!getNb()){curNb=data.notebooks[0]&&data.notebooks[0].id;curPg=null}
 data.notebooks.forEach(n=>{const b=document.createElement('button');b.className='nbitem'+(n.id===curNb?' on':'');b.innerHTML='<span class="nbdot" style="background:'+n.color+'"></span><span class="nbn">'+sesc(n.name)+'</span>';
  b.onclick=()=>{curNb=n.id;curPg=null;saveNbSel();rBooks()};
  if(n.id===curNb){const m=document.createElement('span');m.className='gm';m.textContent='\u22ef';m.onclick=e=>{e.stopPropagation();nbMenu(n,m)};b.append(m)}
  L.append(b)});
 const n=getNb(),P=$('pglist');P.innerHTML='';$('nbname').textContent=n?n.name:'';$('nbpage').hidden=true;$('pgempty').hidden=!n;
 if(!n)return;$('pgempty').hidden=true;
 (n.pages||[]).slice().sort((a,b)=>(b.updated||'').localeCompare(a.updated||'')).forEach(p=>{const b=document.createElement('button');b.className='pgitem'+(p.id===curPg?' on':'');b.textContent=p.title||'Untitled';
  b.onclick=()=>{openPage(n.id,p.id)};
  const x=document.createElement('span');x.className='x';x.textContent='\u2715';x.title='Delete page';x.onclick=e=>{e.stopPropagation();if(confirm('Delete page "'+(p.title||'Untitled')+'"?')){n.pages=n.pages.filter(z=>z!==p);if(curPg===p.id)curPg=null;saveNbSel();save();rBooks()}};b.append(x);P.append(b)});
 if(curPg&&getPg())showPage();else $('nbpage').hidden=true}
function flushNbList(){const P=$('pglist');if(!P)return;const on=[...P.querySelectorAll('.pgitem')].find(b=>b.classList.contains('on'));if(on){const t=$('nbtitle').value.trim()||'Untitled';on.childNodes[0].nodeValue=t}}
function openPage(nid,pid){if(getPg()&&!$('nbpage').hidden)saveNbPage();curNb=nid;curPg=pid;saveNbSel();rBooks()}
function showPage(){const p=getPg();if(!p){$('nbpage').hidden=true;return}$('nbpage').hidden=false;$('nbtitle').value=p.title||'';
 const v=p.html||'';$('nbtxt').innerHTML=/<[a-z]/i.test(v)?v:v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>');hydrate($('nbtxt'));if(typeof deselImg=='function')deselImg()}
function nbMenu(n,el){const old=document.getElementById('nbmenu');if(old)old.remove();const m=document.createElement('div');m.id='nbmenu';m.className='gmenu';
 const ci=document.createElement('input');ci.type='color';ci.value=n.color||'#2f7ed8';ci.className='gcol';ci.onchange=()=>{n.color=ci.value;save();rBooks()};
 const cl=document.createElement('label');cl.className='gcl';cl.append('Color ',ci);
 const rb=document.createElement('button');rb.className='b';rb.textContent='Rename';rb.onclick=()=>{const v=(prompt('Rename notebook:',n.name)||'').trim();if(v){n.name=v;save();rBooks()}};
 const db=document.createElement('button');db.className='b';db.textContent='Delete';db.onclick=()=>{if(!confirm('Delete notebook "'+n.name+'" and all its pages?'))return;data.notebooks=data.notebooks.filter(z=>z!==n);if(curNb===n.id){curNb=null;curPg=null;saveNbSel()}save();rBooks()};
 m.append(cl,rb,db);el.parentElement.after(m);setTimeout(()=>document.addEventListener('click',function h(e){if(!m.contains(e.target)){m.remove();document.removeEventListener('click',h)}},true),0)}
$('nbnew').onclick=()=>{if(!fh)return;ensureNb();const name=(prompt('Notebook name:')||'').trim()||'Untitled';const n={id:uid(),name,pages:[]};gcolNb(n);data.notebooks.push(n);curNb=n.id;curPg=null;saveNbSel();save();rBooks()};
$('pgnew').onclick=()=>{const n=getNb();if(!n||!fh)return;const p={id:uid(),title:'Untitled',html:'',updated:new Date().toISOString()};n.pages.unshift(p);curPg=p.id;saveNbSel();save();rBooks()};
$('nbtitle').oninput=()=>{const p=getPg();if(!p)return;p.title=$('nbtitle').value;p.updated=new Date().toISOString();flushNbList();save()};
$('nbtxt').oninput=()=>{saveNbPage();save()};
$('nbtxt').onpaste=e=>{const it=[...e.clipboardData.items].find(i=>i.type.startsWith('image/'));if(it){e.preventDefault();if(!fh)return;pasteImg(it.getAsFile(),$('nbtxt'),()=>{saveNbPage();save()});return}
 e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'))};
$('nbtxt').addEventListener('click',e=>{if(e.target.tagName==='IMG')selectImg(e.target);else deselImg()});
$('nbtxt').addEventListener('dblclick',e=>{if(e.target.tagName==='IMG'&&e.target.src)viewImg(e.target.src)});
document.querySelectorAll('#ntb button').forEach(b=>{b.onmousedown=e=>e.preventDefault();b.onclick=()=>{if($('nbtxt').contentEditable!=='true')return;$('nbtxt').focus();
 const c=b.dataset.c,v=b.dataset.v;document.execCommand('styleWithCSS',false,c=='hl'||c=='foreColor');
 if(c=='hl')document.execCommand('hiliteColor',false,v);else document.execCommand(c,false,v||null);saveNbPage();save()}});
loadNbSel();
