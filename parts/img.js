// ===== Images stored as separate files in the OneDrive app folder =====
const imgCache=new Map(); // path -> Promise<blob url>
const GI=p=>'https://graph.microsoft.com/v1.0/me/drive/special/approot:/'+p.split('/').map(encodeURIComponent).join('/')+':/content';
function getImg(p){if(!imgCache.has(p))imgCache.set(p,gfetch(GI(p)).then(r=>{if(!r.ok)throw new Error(r.status);return r.blob()}).then(b=>URL.createObjectURL(b)).catch(e=>{imgCache.delete(p);throw e}));return imgCache.get(p)}
function hydrate(root){root.querySelectorAll('img[data-od]').forEach(im=>{if(im.getAttribute('src'))return;im.classList.add('imgload');getImg(im.dataset.od).then(u=>{im.src=u;im.classList.remove('imgload')}).catch(()=>{im.classList.remove('imgload');im.alt='(image could not be loaded: '+im.dataset.od+')'})})}
function noteHTML(root){const c=(root||$('txt')).cloneNode(true);c.querySelectorAll('img').forEach(im=>{im.classList.remove('imgsel');if(im.dataset.pending)return im.remove();if(im.dataset.od){im.removeAttribute('src');im.classList.remove('imgload');if(!im.className)im.removeAttribute('class');im.removeAttribute('alt')}else if(/^blob:/.test(im.getAttribute('src')||''))im.remove()});return c.innerHTML}
function stamp(){const d=new Date(),p=n=>String(n).padStart(2,'0');return iso(d)+'_'+p(d.getHours())+p(d.getMinutes())+p(d.getSeconds())+'_'+Math.random().toString(36).slice(2,8)}
async function uploadImg(blob){const ext=((blob.type||'image/png').split('/')[1]||'png').replace('jpeg','jpg').replace(/[^a-z0-9]/g,'');const p='images/'+stamp()+'.'+ext;
 const r=await gfetch(GI(p),{method:'PUT',headers:{'Content-Type':blob.type||'image/png'},body:blob});if(!r.ok)throw new Error('Upload failed ('+r.status+')');imgCache.set(p,Promise.resolve(URL.createObjectURL(blob)));return p}
const toDataURL=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)});
async function pasteImg(file,ed,ondone){ed=ed||$('txt');const id='p'+Math.random().toString(36).slice(2),inNotes=ed.id==='txt',k=iso(cur);
 ed.focus();document.execCommand('insertHTML',false,'<img data-pending="'+id+'" class="imgup" style="width:25%" src="'+URL.createObjectURL(file)+'"><br>');
 const el=()=>ed.querySelector('img[data-pending="'+id+'"]');
 try{const p=await uploadImg(file);const im=el();if(im){delete im.dataset.pending;im.classList.remove('imgup');im.dataset.od=p;getImg(p).then(u=>im.src=u)}
  else if(inNotes)data.notes[k]=(data.notes[k]||'')+'<img data-od="'+p+'" style="width:25%"><br>'}
 catch(e){const im=el(),du=await toDataURL(file);if(im){delete im.dataset.pending;im.classList.remove('imgup');im.src=du}else if(inNotes)data.notes[k]=(data.notes[k]||'')+'<img src="'+du+'" style="width:25%"><br>';
  st('Image not uploaded ('+e.message+'); kept inside the note instead',true)}
 if(ondone)ondone();else if(inNotes&&iso(cur)===k){data.notes[k]=noteHTML(ed);save()}else save()}
let migrating=false;
async function migrateImgs(){if(migrating)return;migrating=true;let changed=false,failed=0;
 async function migOne(holder,key){const v=holder[key];if(!v||!/<img[^>]+src=["']data:/i.test(v))return;const d=document.createElement('div');d.innerHTML=v;let ch=false;
  for(const im of d.querySelectorAll('img[src^="data:"]')){try{const b=await (await fetch(im.getAttribute('src'))).blob();const p=await uploadImg(b);im.removeAttribute('src');im.dataset.od=p;ch=true}catch(e){failed++}}
  if(ch&&holder[key]===v){holder[key]=d.innerHTML;changed=true}}
 try{for(const k of Object.keys(data.notes)){await migOne(data.notes,k);if(changed&&k===iso(cur)&&document.activeElement!==$('txt'))showDay()}
  for(const nb of (data.notebooks||[]))for(const pg of (nb.pages||[])){const wrap={h:pg.html};await migOne(wrap,'h');if(wrap.h!==pg.html){pg.html=wrap.h;changed=true;if(curPg===pg.id)showPage()}}
 if(changed)save();if(failed)st(failed+' old image(s) could not be moved to OneDrive; kept inside notes',true)}finally{migrating=false}}
$('txt').addEventListener('click',e=>{if(e.target.tagName!=='IMG'||!e.target.src)return;const o=document.createElement('div');o.id='imgview';const i=document.createElement('img');i.src=e.target.src;o.append(i);o.onclick=()=>o.remove();document.body.append(o)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('imgview'))$('imgview').remove()});
