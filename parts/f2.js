// ===== Orphan image cleanup (30-day grace) =====
let cleaning=false;
async function cleanupImgs(){const td=iso(new Date());if(cleaning||!fh||!acct&&!window.__test||saving||dirty||migrating||data.lastCleanup===td)return;cleaning=true;
 try{let url='https://graph.microsoft.com/v1.0/me/drive/special/approot:/images:/children?$select=name,file&$top=200',files=[];
  while(url){const r=await gfetch(url);if(r.status==404){files=[];break}if(!r.ok)return;const j=await r.json();(j.value||[]).forEach(f=>{if(f.file&&f.name&&!f.name.includes('/'))files.push('images/'+f.name)});url=j['@odata.nextLink']||null}
  if(saving||dirty)return;
  const refs=new Set(),txt=JSON.stringify({n:data.notes,t:data.tasks,y:data.yearly})+($('txt')?$('txt').innerHTML:'');
  (txt.match(/images\/[A-Za-z0-9_.\-]+/g)||[]).forEach(p=>refs.add(p));
  const orph=data.orphans=data.orphans||{},listed=new Set(files);let ch=false;
  for(const p in orph)if(!listed.has(p)||refs.has(p)){delete orph[p];ch=true}
  for(const p of files){if(refs.has(p)||!/^images\/[^\/]+$/.test(p))continue;
   if(!orph[p]){orph[p]=td;ch=true;continue}
   if((new Date(td+'T12:00')-new Date(orph[p]+'T12:00'))/864e5>=7){const r=await gfetch(GI(p),{method:'DELETE'});if(r.ok||r.status==404){delete orph[p];imgCache.delete(p);ch=true}}}
  data.lastCleanup=td;save()}catch(e){}finally{cleaning=false}}
// ===== Image select / resize =====
let selImg=null;const bar=document.createElement('div');bar.id='imgbar';bar.hidden=true;
bar.innerHTML='<button data-w="25">Small</button><button data-w="50">Medium</button><button data-w="75">Large</button><button data-w="100">Full</button><button data-w="open">Open full size</button>';
const hdl=document.createElement('div');hdl.id='imghdl';hdl.hidden=true;document.body.append(bar,hdl);
function viewImg(src){const o=document.createElement('div');o.id='imgview';const i=document.createElement('img');i.src=src;o.append(i);o.onclick=()=>o.remove();document.body.append(o)}
function placeBar(){if(!selImg||!selImg.isConnected)return deselImg();const r=selImg.getBoundingClientRect();bar.style.top=(scrollY+Math.max(r.top,0)+4)+'px';bar.style.left=(scrollX+r.left+4)+'px';hdl.style.top=(scrollY+r.bottom-9)+'px';hdl.style.left=(scrollX+r.right-9)+'px'}
function selectImg(im){deselImg();selImg=im;im.classList.add('imgsel');bar.hidden=hdl.hidden=false;placeBar()}
function deselImg(){if(selImg)selImg.classList.remove('imgsel');selImg=null;bar.hidden=hdl.hidden=true}
function commitImg(){data.notes[iso(cur)]=noteHTML();save();placeBar()}
bar.onmousedown=e=>e.preventDefault();
bar.onclick=e=>{const w=e.target.dataset.w;if(!w||!selImg)return;if(w=='open'){if(selImg.src)viewImg(selImg.src);return}selImg.style.width=w+'%';commitImg();deselImg()};
hdl.onpointerdown=e=>{if(!selImg)return;e.preventDefault();hdl.setPointerCapture(e.pointerId);const cw=$('txt').clientWidth-28,l=selImg.getBoundingClientRect().left;
 hdl.onpointermove=m=>{selImg.style.width=Math.round(Math.min(100,Math.max(5,(m.clientX-l)/cw*100)))+'%';placeBar()};
 hdl.onpointerup=()=>{hdl.onpointermove=hdl.onpointerup=null;commitImg()}};
$('txt').addEventListener('click',e=>{if(e.target.tagName==='IMG')selectImg(e.target);else deselImg()});
$('txt').addEventListener('dblclick',e=>{if(e.target.tagName==='IMG'&&e.target.src)viewImg(e.target.src)});
document.addEventListener('mousedown',e=>{if(selImg&&!$('txt').contains(e.target)&&!bar.contains(e.target)&&e.target!==hdl)deselImg()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('imgview'))$('imgview').remove();else deselImg()}});
window.addEventListener('resize',placeBar);$('txt').addEventListener('input',placeBar);
