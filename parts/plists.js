// ===== Personal task lists =====
function ensureP(){data.plists=data.plists||[];data.personal=data.personal||[];
 if(!data.plists.length)data.plists.push({id:'general',name:'General'});
 const ids=new Set(data.plists.map(l=>l.id));let ch=false;
 data.personal.forEach(x=>{if(!x.list||!ids.has(x.list)){x.list=data.plists[0].id;ch=true}});if(ch&&fh)save()}
function curP(){ensureP();let c=null;try{c=localStorage.getItem('nt_plist')}catch(e){}
 return data.plists.some(l=>l.id===c)?c:data.plists[0].id}
function setP(id){try{localStorage.setItem('nt_plist',id)}catch(e){}}
function rPP(){ensureP();const c=curP(),W=$('ppills');W.innerHTML='';
 data.plists.forEach(l=>{const b=document.createElement('button');b.className='pill'+(l.id===c?' on':'');b.textContent=l.name;
  const n=data.personal.filter(x=>x.list===l.id&&!x.done).length;if(n){const s=document.createElement('span');s.className='gm';s.textContent=n;b.append(s)}
  b.onclick=()=>{setP(l.id);render()};W.append(b)});
 const nb=document.createElement('button');nb.className='pill new';nb.textContent='+ New list';nb.disabled=!fh;
 nb.onclick=()=>{const v=(prompt('Name for the new list (e.g. Packing, House):')||'').trim();if(!v)return;
  if(data.plists.some(l=>l.name.toLowerCase()===v.toLowerCase()))return alert('There is already a list called '+v+'.');
  const id='l'+Date.now().toString(36);data.plists.push({id,name:v});setP(id);save();render()};W.append(nb);
 const cl=data.plists.find(l=>l.id===c);
 const rn=document.createElement('button');rn.className='pill';rn.textContent='Rename';rn.disabled=!fh;
 rn.onclick=()=>{const v=(prompt('Rename list "'+cl.name+'" to:',cl.name)||'').trim();if(!v||v===cl.name)return;
  if(data.plists.some(l=>l!==cl&&l.name.toLowerCase()===v.toLowerCase()))return alert('There is already a list called '+v+'.');cl.name=v;save();render()};
 const dl=document.createElement('button');dl.className='pill';dl.textContent='Delete';dl.disabled=!fh;
 dl.onclick=()=>{if(data.plists.length<2)return alert('You need at least one list. Rename this one instead.');
  const n=data.personal.filter(x=>x.list===cl.id).length;
  if(!confirm('Delete the list "'+cl.name+'"'+(n?' and its '+n+' task'+(n>1?'s':'')+' (including archived)':'')+'? This cannot be undone.'))return;
  data.personal=data.personal.filter(x=>x.list!==cl.id);data.plists=data.plists.filter(l=>l!==cl);setP(data.plists[0].id);save();render()};
 W.append(rn,dl);$('pname').textContent=cl.name}
