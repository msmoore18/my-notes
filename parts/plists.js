// ===== Named task lists (Work + Personal) =====
const LC={personal:{L:'plists',S:'nt_plist',W:'ppills',N:'pname'},tasks:{L:'tlists',S:'nt_tlist',W:'tpills',N:'tname'}};
function ensureL(K){const c=LC[K];data[c.L]=data[c.L]||[];data[K]=data[K]||[];const ls=data[c.L];
 if(!ls.length)ls.push({id:'general',name:'General'});
 const ids=new Set(ls.map(l=>l.id));let ch=false;
 data[K].forEach(x=>{if(!x.list||!ids.has(x.list)){x.list=ls[0].id;ch=true}});if(ch&&fh)save();return ls}
function curL(K){const ls=ensureL(K);let c=null;try{c=localStorage.getItem(LC[K].S)}catch(e){}
 return ls.some(l=>l.id===c)?c:ls[0].id}
function setL(K,id){try{localStorage.setItem(LC[K].S,id)}catch(e){}}
function listName(K,x){const l=(data[(LC[K]||{}).L]||[]).find(l=>l.id===x.list);return l?l.name:''}
function rLP(K){const C=LC[K],ls=ensureL(K),c=curL(K),W=$(C.W);W.innerHTML='';
 ls.forEach(l=>{const b=document.createElement('button');b.className='pill'+(l.id===c?' on':'');b.textContent=l.name;
  const n=data[K].filter(x=>x.list===l.id&&!x.done).length;if(n){const s=document.createElement('span');s.className='gm';s.textContent=n;b.append(s)}
  b.onclick=()=>{setL(K,l.id);render()};W.append(b)});
 const mk=(t,f)=>{const b=document.createElement('button');b.className='pill'+(t[0]=='+'?' new':'');b.textContent=t;b.disabled=!fh;b.dataset.act=1;b.onclick=f;W.append(b)};
 const cl=ls.find(l=>l.id===c);
 mk('+ New list',()=>{const v=(prompt('Name for the new list:')||'').trim();if(!v)return;
  if(ls.some(l=>l.name.toLowerCase()===v.toLowerCase()))return alert('There is already a list called '+v+'.');
  const id='l'+Date.now().toString(36);ls.push({id,name:v});setL(K,id);save();render()});
 mk('Rename',()=>{const v=(prompt('Rename list "'+cl.name+'" to:',cl.name)||'').trim();if(!v||v===cl.name)return;
  if(ls.some(l=>l!==cl&&l.name.toLowerCase()===v.toLowerCase()))return alert('There is already a list called '+v+'.');cl.name=v;save();render()});
 mk('Delete',()=>{if(ls.length<2)return alert('You need at least one list. Rename this one instead.');
  const n=data[K].filter(x=>x.list===cl.id).length;
  if(!confirm('Delete the list "'+cl.name+'"'+(n?' and its '+n+' task'+(n>1?'s':'')+' (including archived)':'')+'? This cannot be undone.'))return;
  data[K]=data[K].filter(x=>x.list!==cl.id);data[C.L]=ls.filter(l=>l!==cl);setL(K,data[C.L][0].id);save();render()});
 $(C.N).textContent=cl.name}
