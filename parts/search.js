var lastTab='n';
const sesc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function plain(h){const d=document.createElement('div');d.innerHTML=String(h||'').replace(/<img[^>]*>/gi,' ');d.querySelectorAll('br,div,p,li,h3').forEach(e=>e.after(' '));return d.textContent.replace(/\s+/g,' ').trim()}
function snip(t,q){const i=t.toLowerCase().indexOf(q);const a=Math.max(0,i-50),b=Math.min(t.length,i+q.length+70);return (a?'\u2026':'')+sesc(t.slice(a,i))+'<mark>'+sesc(t.slice(i,i+q.length))+'</mark>'+sesc(t.slice(i+q.length,b))+(b<t.length?'\u2026':'')}
function doSearch(){const raw=$('sq').value.trim(),q=raw.toLowerCase().replace(/\s+/g,' ');$('sx').hidden=!raw;
 if(!q){if(!$('search').hidden)tab(lastTab);return}
 const keep=lastTab;['notes','tasks','yearly'].forEach(i=>$(i).hidden=true);$('search').hidden=false;['tn','tt','ty'].forEach(i=>$(i).classList.remove('on'));lastTab=keep;
 const R=$('sres');R.innerHTML='';let total=0;
 const grp=(title,items)=>{if(!items.length)return;total+=items.length;const h=document.createElement('h4');h.textContent=title+' ('+items.length+')';const u=document.createElement('ul');items.forEach(([meta,html,go])=>{const li=document.createElement('li');li.innerHTML='<small>'+sesc(meta)+'</small>'+html;li.onclick=go;u.append(li)});R.append(h,u)};
 const fd=k=>new Date(k+'T12:00').toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'});
 grp('Daily notes',Object.keys(data.notes).sort().reverse().map(k=>[k,plain(data.notes[k])]).filter(([k,t])=>t.toLowerCase().includes(q)).map(([k,t])=>[fd(k),snip(t,q),()=>openNote(k,raw.replace(/\s+/g,' '))]));
 grp('Tasks',data.tasks.filter(x=>(x.text||'').toLowerCase().includes(q)).sort((a,b)=>(b.when||'').localeCompare(a.when||'')).map(x=>[(x.done?'Archived':'Active')+(x.when?' \u00b7 '+fd(x.when):''),snip(x.text,q),()=>openTask(x)]));
 grp('Yearly tasks',(data.yearly||[]).map(y=>[y,(y.text||'')+' \u2014 '+(y.det||'').replace(/\s+/g,' ')]).filter(([y,t])=>t.toLowerCase().includes(q)).sort((a,b)=>(b[0].md||'').localeCompare(a[0].md||'')).map(([y,t])=>['Due '+new Date('2000-'+y.md+'T12:00').toLocaleDateString(undefined,{month:'short',day:'numeric'}),snip(t,q),()=>openYear(y)]));
 if(!total)R.innerHTML='<p style="color:#888">No matches for \u201c'+sesc(raw)+'\u201d.</p>'}
function clearS(){$('sq').value='';doSearch()}
function openNote(k,raw){clearS();cur=new Date(k+'T12:00');tab('n');showDay();setTimeout(()=>{const sel=getSelection();sel.removeAllRanges();const r=document.createRange();r.setStart($('txt'),0);r.collapse(true);sel.addRange(r);if(window.find&&window.find(raw,false,false,false,false,false,false)){const n=getSelection().anchorNode;(n&&n.parentElement||$('txt')).scrollIntoView({block:'center'})}else $('txt').scrollIntoView()},50)}
function flash(li){if(!li)return;li.scrollIntoView({block:'center'});li.classList.add('flash');setTimeout(()=>li.classList.remove('flash'),2500)}
function openTask(x){clearS();tab('t');render();if(x.done)document.querySelector('#tasks details').open=true;flash([...document.querySelectorAll('#list li,#alist li')].find(li=>li.textContent.includes(x.text)))}
function openYear(y){clearS();openY.add(y);tab('y');rY();flash([...document.querySelectorAll('#ylist li')].find(li=>li.querySelector('.yt').textContent.startsWith(y.text)))}
$('sq').oninput=doSearch;$('sq').onkeydown=e=>{if(e.key=='Escape')clearS()};$('sx').onclick=clearS;
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&$('sq').value)clearS()});
