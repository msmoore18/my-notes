// ===== Yearly task groups =====
function ensureG(){if(!Array.isArray(data.groups)){data.groups=['SPTF','Lazy S','SMP'];if(fh)save()}if(!data.ygroup)data.ygroup='All';data.groups.forEach(gcol);
 if(data.ygroup!=='All'&&data.ygroup!=='__none'&&!data.groups.includes(data.ygroup))data.ygroup='All'}
const ungrouped=y=>!y.group||!data.groups.includes(y.group);
function inG(y){const s=data.ygroup||'All';return s==='All'||(s==='__none'?ungrouped(y):y.group===s)}
function gtag(y){const t=document.createElement('span');t.className='gtag';t.textContent=ungrouped(y)?'Ungrouped':y.group;if(!ungrouped(y))t.style.background=gcol(y.group);return t}
function gOpts(sel,val,withNone){sel.innerHTML='';if(withNone)sel.append(new Option('Ungrouped',''));data.groups.forEach(g=>sel.append(new Option(g,g)));sel.value=val||(withNone?'':data.groups[0]||'')}
let gMenu=null;
function rPills(){const P=$('ypills');P.innerHTML='';const mk=(label,val,cls)=>{const b=document.createElement('button');b.className='pill'+(cls?' '+cls:'')+((data.ygroup||'All')===val?' on':'');b.textContent=label;b.onclick=()=>{data.ygroup=val;gMenu=null;save();rY()};P.append(b);return b};
 mk('All','All');data.groups.forEach(g=>{const b=mk(g,g),c=gcol(g);b.style.borderColor=c;if(data.ygroup===g){b.style.background=c;b.style.color='#fff'}else{b.style.color=c;b.style.background=c+'14'}if(data.ygroup===g){const m=document.createElement('span');m.className='gm';m.textContent='\u22ef';m.title='Rename or delete this group';m.onclick=e=>{e.stopPropagation();gMenu=gMenu===g?null:g;rPills()};b.append(m)}
  b.oncontextmenu=e=>{e.preventDefault();data.ygroup=g;gMenu=g;rY()}});
 if((data.yearly||[]).some(ungrouped))mk('Ungrouped','__none','ung');
 const n=document.createElement('button');n.className='pill new';n.textContent='+ New group';n.onclick=newGroup;P.append(n);
 if(gMenu&&data.groups.includes(gMenu)){const r=document.createElement('div');r.className='gmenu';const rb=document.createElement('button');rb.className='b';rb.textContent='Rename "'+gMenu+'"';rb.onclick=()=>renameGroup(gMenu);
  const db=document.createElement('button');db.className='b';db.textContent='Delete "'+gMenu+'"';db.onclick=()=>deleteGroup(gMenu);const ci=document.createElement('input');ci.type='color';ci.value=gcol(gMenu);ci.title='Group color';ci.className='gcol';const g0=gMenu;ci.onchange=()=>{data.groupColors[g0]=ci.value;save();rY()};const cl=document.createElement('label');cl.className='gcl';cl.append('Color ',ci);r.append(cl,rb,db);P.append(r)}
 const s=$('ygsel'),all=(data.ygroup||'All')==='All';s.hidden=!all||!data.groups.length;if(all){const v=s.value;gOpts(s,data.groups.includes(v)?v:data.groups[0])}}
const dupG=(n,except)=>data.groups.some(g=>g!==except&&g.toLowerCase()===n.toLowerCase());
function newGroup(){const n=(prompt('New group name:')||'').trim();if(!n)return;if(n==='All'||n==='Ungrouped'||dupG(n))return alert('A group called "'+n+'" already exists.');data.groups.push(n);gcol(n);data.ygroup=n;save();rY()}
function renameGroup(g){const n=(prompt('Rename "'+g+'" to:',g)||'').trim();if(!n||n===g)return;if(n==='All'||n==='Ungrouped'||dupG(n,g))return alert('A group called "'+n+'" already exists.');
 data.groups=data.groups.map(x=>x===g?n:x);if(data.groupColors&&data.groupColors[g]){data.groupColors[n]=data.groupColors[g];delete data.groupColors[g]}(data.yearly||[]).forEach(y=>{if(y.group===g)y.group=n});if(data.ygroup===g)data.ygroup=n;gMenu=null;save();rY()}
function deleteGroup(g){const c=(data.yearly||[]).filter(y=>y.group===g).length;if(!confirm('Delete the group "'+g+'"?'+(c?' Its '+c+' task(s) will become Ungrouped (not deleted).':'')))return;
 data.groups=data.groups.filter(x=>x!==g);if(data.groupColors)delete data.groupColors[g];(data.yearly||[]).forEach(y=>{if(y.group===g)delete y.group});data.ygroup='All';gMenu=null;save();rY()}
function addGroupVal(){const s=data.ygroup||'All';return s==='All'?($('ygsel').value||undefined):s==='__none'?undefined:s}
const GPAL=['#2f7ed8','#8e44ad','#16a085','#d35400','#c2185b','#5d6d7e','#3949ab','#795548','#00897b','#7cb342'];
function gcol(g){data.groupColors=data.groupColors||{};if(!data.groupColors[g]){const used=Object.values(data.groupColors);data.groupColors[g]=GPAL.find(c=>!used.includes(c))||GPAL[Object.keys(data.groupColors).length%GPAL.length];if(fh)save()}return data.groupColors[g]}
