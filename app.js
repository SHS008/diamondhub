/* DiamondHub — Softball Team Hub */
const LS_KEY = 'diamondhub_v1';
let S = null;
let calCursor = new Date();
let statsSort = {key:'AVG', dir:-1};
let statTargetId = null;
let schedTab = 'upcoming';
let liveTab = 'score';

const $ = s => document.querySelector(s);
const uid = () => 'id' + Math.random().toString(36).slice(2,9);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const todayISO = () => new Date().toISOString().slice(0,10);
function toast(msg){ const w=$('#toastWrap'); const d=document.createElement('div'); d.className='toast'; d.innerHTML=msg; w.appendChild(d); setTimeout(()=>d.remove(),3400); }
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(S)); }

/* ---------- SEED ---------- */
function blankStats(){ return {ab:0,h:0,d2:0,d3:0,hr:0,rbi:0,r:0,bb:0,k:0,sb:0, ip:0,er:0,pk:0,pbb:0, po:0,a:0,e:0}; }
function seed(){
  const t1 = uid(), t2 = uid();
  const firsts1 = [['Ava','Johnson',7,'SS'],['Mia','Thompson',3,'P'],['Sophia','Anderson',11,'C'],['Isabella','Martinez',5,'1B'],['Olivia','Garcia',22,'CF'],['Emma','Wilson',9,'3B'],['Lily','Brown',14,'2B'],['Chloe','Davis',2,'LF'],['Grace','Miller',8,'RF'],['Ella','Moore',17,'P'],['Scarlett','Taylor',21,'UT'],['Layla','Peterson',4,'C']];
  const firsts2 = [['Harper','Nelson',6,'SS'],['Zoey','Carter',10,'P'],['Nora','Mitchell',12,'1B'],['Riley','Roberts',15,'CF'],['Hannah','Evans',1,'3B'],['Aria','Turner',18,'C'],['Ellie','Phillips',20,'LF'],['Stella','Campbell',24,'2B']];
  const mk = (t, arr) => arr.map(([f,l,n,pos],i)=>({id:uid(), teamId:t, first:f, last:l, number:n, pos, bats: i%4===0?'L':'R', throws:'R', parent: f+'\'s Mom', parentEmail: f.toLowerCase()+'.parent@email.com', parentPhone:`(906) 555-01${String(10+i).slice(-2)}`, stats: Object.assign(blankStats(), {ab: 28+((i*7)%14), h: 8+((i*5)%9), d2: (i%3), d3: (i%5===0?1:0), hr: (i%4===0?2:(i%6===0?1:0)), rbi: 6+((i*3)%10), r: 7+((i*2)%8), bb: 2+(i%4), k: 3+(i%5), sb: (i%4), ip: (pos==='P'? 18+((i*3)%12):0), er: (pos==='P'?4+(i%3):0), pk:(pos==='P'?14+(i%8):0), pbb:(pos==='P'?5+(i%3):0)})}));
  const players = [...mk(t1, firsts1), ...mk(t2, firsts2)];
  const d = (offset, t='18:00') => { const x=new Date(); x.setDate(x.getDate()+offset); return {date: x.toISOString().slice(0,10), time:t}; };
  const g1=d(2), g2=d(5), g3=d(-3), p1=d(1), p2=d(4);
  const games = [
    {id:uid(), teamId:t1, opponent:'Marquette Redettes', date:g3.date, time:'18:00', location:'Ludington Park Field 2', type:'Game', status:'final', homeAway:'home', ourScore:8, oppScore:5, feed:[
      {t:'Final', text:'Eskymos win 8–5! Mia T. 11 Ks, Ava J. 3-for-4 with a 💣', time:'8:42 PM'},
      {t:'Bot 6th', text:'Isabella M. doubles to the gap, 2 runs score! 8–5', time:'8:20 PM'},
      {t:'Top 5th', text:'Pitching change: Ella M. relieves Mia T. Runners on 1st & 2nd, 1 out.', time:'7:55 PM'},
      {t:'Bot 3rd', text:'HOME RUN 🥎 Ava J. launches a 2-run shot over left! 5–3 Eskymos!', time:'7:21 PM'}]},
    {id:uid(), teamId:t1, opponent:'Kingsford Flivvers', date:g1.date, time:g1.time, location:'Ludington Park Field 1', type:'Game', status:'scheduled', homeAway:'away', ourScore:0, oppScore:0, feed:[]},
    {id:uid(), teamId:t1, opponent:'Gladstone Braves', date:g2.date, time:'12:00', location:'Gladstone Sports Park', type:'Game', status:'scheduled', homeAway:'away', ourScore:0, oppScore:0, feed:[]},
  ];
  const events = [
    {id:uid(), teamId:t1, title:'Practice — Hitting + Fielding', type:'Practice', date:p1.date, time:'17:30', location:'Ludington Park Field 2', notes:'Bring helmets & water. Pitchers stay 30 min late.', uniform:'Practice Tee', requireRsvp:true, rsvps:{}},
    {id:uid(), teamId:t1, title:'Game vs Kingsford Flivvers', type:'Game', date:g1.date, time:g1.time, location:'Ludington Park Field 1', notes:'Arrive 45 min early. Away greens.', uniform:'Away Green', requireRsvp:true, rsvps:{}},
    {id:uid(), teamId:t1, title:'Practice — Pitchers & Catchers', type:'Practice', date:p2.date, time:'17:00', location:'Escanaba High Cages', notes:'Bullpens + blocking drills.', uniform:'Practice Tee', requireRsvp:true, rsvps:{}},
    {id:uid(), teamId:t1, title:'Car Wash Fundraiser 🧽', type:'Fundraiser', date:d(9).date, time:'10:00', location:'Elmer\'s Parking Lot', notes:'Each player needs 1 parent volunteer. Goal: $1,200 for new helmets.', uniform:'Practice Tee', requireRsvp:true, rsvps:{}},
    {id:uid(), teamId:t1, title:'U.P. Fall Classic Tournament', type:'Tournament', date:d(12).date, time:'09:00', location:'Marquette Fields', notes:'3-game guarantee. Hotel block at Hampton Inn.', uniform:'Home White', requireRsvp:true, rsvps:{}},
    {id:uid(), teamId:t2, title:'Practice — Basics', type:'Practice', date:p1.date, time:'16:30', location:'Ludington Park Field 3', notes:'Throwing mechanics night.', uniform:'Practice Tee', requireRsvp:true, rsvps:{}},
    {id:uid(), teamId:t2, title:'Game vs Bark River Broncos', type:'Game', date:d(6).date, time:'18:00', location:'Bark River Field', notes:'Away game, carpool at 4:45.', uniform:'Away Green', requireRsvp:true, rsvps:{}},
  ];
  const t1players = players.filter(p=>p.teamId===t1);
  events.slice(0,3).forEach((e,i)=>{ t1players.forEach((p,j)=>{ if((j+i)%5!==0) e.rsvps[p.id]= (j+i)%7===0?'maybe':'yes'; else e.rsvps[p.id]='no'; }); });
  const messages = [
    {id:uid(), teamId:t1, author:'Coach Miller', text:'📣 Huge win Tuesday! Proud of the energy in the dugout. Practice Thursday 5:30 — we\'re working cutoffs & relays.', time:'Tue 9:12 PM', pinned:true},
    {id:uid(), teamId:t1, author:'Sarah Johnson (Ava\'s mom)', text:'I can bring the team cooler + ice for Saturday\'s doubleheader 🧊', time:'Wed 8:04 AM', pinned:false},
    {id:uid(), teamId:t1, author:'Coach Miller', text:'Reminder: fundraiser car wash sign-up is in Snacks & Duties. We still need 4 more volunteers!', time:'Today 7:30 AM', pinned:false},
    {id:uid(), teamId:t2, author:'Coach Daniels', text:'Welcome to the 12U squad page! First practice Thursday 4:30 Field 3. 💚', time:'Mon 6:00 PM', pinned:true},
  ];
  const duties = [
    {id:uid(), teamId:t1, title:'Post-game snacks — vs Kingsford', date:g1.date, slots:[{role:'Snacks + drinks', by:'Sarah J.'},{role:'Cooler + ice', by:null}]},
    {id:uid(), teamId:t1, title:'Car Wash Fundraiser volunteers', date:d(9).date, slots:[{role:'Setup 9:30 AM', by:null},{role:'Washer crew', by:'Davis family'},{role:'Cashier', by:null},{role:'Tear-down', by:null}]},
    {id:uid(), teamId:t1, title:'Scorebook duty', date:g1.date, slots:[{role:'Scorekeeper', by:'Coach Lee'}]},
  ];
  const dues = [{id:uid(), teamId:t1, title:'Spring Season Fees', amount:175, dueDate:d(14).date, paid:Object.fromEntries(t1players.slice(0,8).map(p=>[p.id,true]))},
                {id:uid(), teamId:t1, title:'Tournament Entry — U.P. Classic', amount:45, dueDate:d(10).date, paid:Object.fromEntries(t1players.slice(0,4).map(p=>[p.id,true]))}];
  const media = [
    {id:uid(), teamId:t1, emoji:'💣', title:'Ava\'s walk-off HR vs Marquette', date:g3.date},
    {id:uid(), teamId:t1, emoji:'🔥', title:'Mia\'s 11-K gem', date:g3.date},
    {id:uid(), teamId:t1, emoji:'🧤', title:'Lily\'s diving stop at 2B', date:g3.date},
    {id:uid(), teamId:t1, emoji:'🏆', title:'Team dinner after the W', date:g3.date},
    {id:uid(), teamId:t2, emoji:'🥎', title:'First 12U practice!', date:d(-1).date},
  ];
  return {
    teams:[
      {id:t1, name:'Escanaba Eskymos 14U', age:'14U • Travel', season:'Fall 2026', color:'#16a34a', emoji:'🥎', record:{w:14,l:5,t:1}, gcName:'Escanaba Eskymos 14U', gcUrl:''},
      {id:t2, name:'Escanaba Jr. Eskymos 12U', age:'12U • Rec', season:'Fall 2026', color:'#2563eb', emoji:'⚾', record:{w:8,l:4,t:0}, gcName:'Escanaba Jr Eskymos 12U', gcUrl:''},
    ],
    players, games, events, messages, duties, dues, media,
    lineups:{}, live:null, activeTeamId:t1, notifRead:false
  };
}
function load(){ try{ const raw=localStorage.getItem(LS_KEY); S = raw? JSON.parse(raw) : seed(); if(!S.teams?.length) S=seed(); }catch(e){ S=seed(); } save(); }

/* ---------- HELPERS ---------- */
const team = () => S.teams.find(t=>t.id===S.activeTeamId) || S.teams[0];
const teamPlayers = (tid) => S.players.filter(p=>p.teamId===(tid||S.activeTeamId));
const teamGames = (tid) => S.games.filter(g=>g.teamId===(tid||S.activeTeamId));
const teamEvents = (tid) => S.events.filter(e=>e.teamId===(tid||S.activeTeamId)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
const pname = p => `${p.first} ${p.last}`;
function calcAVG(s){ return s.ab? (s.h/s.ab):0; }
function calcOBP(s){ const d=s.ab+s.bb; return d? (s.h+s.bb)/d:0; }
function calcSLG(s){ return s.ab? (s.h + s.d2 + 2*s.d3 + 3*s.hr)/s.ab:0; }
function calcERA(s){ return s.ip? (s.er/s.ip*7):0; }
const f3 = n => n.toFixed(3).replace(/^0/,'');
function fmtDate(iso){ if(!iso) return ''; const [y,m,d]=iso.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}); }
function fmtTime(t){ if(!t) return ''; let [h,m]=t.split(':').map(Number); const ap=h>=12?'PM':'AM'; h=h%12||12; return `${h}:${String(m).padStart(2,'0')} ${ap}`; }
function upcoming(evts){ const t=todayISO(); return evts.filter(e=>e.date>=t); }
function abbr(name){ const w=String(name||'').split(/\s+/).filter(x=>x && !/\d/.test(x)); return ((w[0]||'???').slice(0,3)).toUpperCase(); }
function streak(){ const finals=teamGames().filter(g=>g.status==='final').sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)); let s='',n=0; for(let i=finals.length-1;i>=0;i--){ const w=finals[i].ourScore>finals[i].oppScore, l=finals[i].ourScore<finals[i].oppScore; const c=w?'W':l?'L':'T'; if(!s){s=c;n=1;} else if(c===s)n++; else break; } return s?s+n:'—'; }

/* ---------- NAV ---------- */
const TAB_OF = {home:'home', live:'live', schedule:'schedule', stats:'stats', roster:'roster', lineup:'roster', more:'more', messages:'more', duties:'more', dues:'more', media:'more', drills:'more', settings:'more'};
const MORE_TITLES = {messages:'Team Chat', duties:'Snacks & Duties', dues:'Dues & Fees', media:'Highlights', drills:'Practice Library', settings:'Settings'};
function showView(v){
  const RENDER={home:renderHome,live:renderLive,schedule:renderSchedule,roster:renderRoster,stats:renderStats,lineup:renderLineup,messages:renderMessages,duties:renderDuties,dues:renderDues,media:renderMedia,drills:renderDrills,settings:renderSettings,more:renderMore};
  if(!RENDER[v]) v='home';
  document.querySelectorAll('.tab-item').forEach(b=>b.classList.toggle('active', b.dataset.view===TAB_OF[v]));
  document.querySelectorAll('.view').forEach(s=>s.classList.remove('active'));
  $('#view-'+v).classList.add('active');
  const sb=$('#subbar');
  if(v==='roster'||v==='lineup'){ sb.classList.remove('hidden'); sb.innerHTML=`<div class="pills"><button class="${v==='roster'?'active':''}" onclick="showView('roster')">👥 Roster</button><button class="${v==='lineup'?'active':''}" onclick="showView('lineup')">📋 Lineup</button></div><span class="subbar-title">${esc(team().name)}</span>`; }
  else if(MORE_TITLES[v]){ sb.classList.remove('hidden'); sb.innerHTML=`<button class="backbtn" onclick="showView('more')">‹ More</button><span class="subbar-title">${MORE_TITLES[v]}</span>`; }
  else { sb.classList.add('hidden'); sb.innerHTML=''; }
  RENDER[v](); renderStrip();
  window.scrollTo(0,0);
}
function setTeam(id){ S.activeTeamId=id; save(); $('#teamDropdown').classList.add('hidden'); renderTeamBits(); showView(document.querySelector('.view.active').id.replace('view-','')); toast(`Switched to <b>${esc(team().name)}</b>`); }
function renderTeamBits(){
  const t=team();
  $('#teamBtnLabel').innerHTML = `<span style="font-size:16px">${t.emoji}</span><span>${esc(t.name)}</span><span class="chip green">${t.record.w}-${t.record.l}-${t.record.t}</span>`;
  $('#teamDropdownList').innerHTML = S.teams.map(x=>`<button class="team-pill ${x.id===S.activeTeamId?'active':''}" onclick="setTeam('${x.id}')"><span class="dot" style="background:${x.color}"></span><span><span class="tm-name">${x.emoji} ${esc(x.name)}</span><span class="tm-sub">${esc(x.age)} • ${x.record.w}-${x.record.l}-${x.record.t}</span></span></button>`).join('');
  $('#tabLiveDot').style.display = S.live? 'inline-block':'none';
  renderStrip();
}
function renderStrip(){
  const t=team(); const L=S.live; const gms=[...teamGames()].reverse();
  const last=gms.find(g=>g.status==='final');
  const nextG=upcoming(teamEvents()).filter(e=>e.type==='Game'||e.type==='Tournament').slice(0,2);
  let h='';
  if(L) h+=`<button class="strip-card live" onclick="showView('live')"><span class="strip-live">● LIVE ${esc(L.half[0])}${L.inning}</span><span class="strip-score">${abbr(t.name)} ${L.weHome?L.us:L.them} &nbsp;${abbr(L.opp)} ${L.weHome?L.them:L.us}</span></button>`;
  if(last) h+=`<button class="strip-card" onclick="liveTab='past';showView('live')"><span class="strip-tag">FINAL</span><span class="strip-score">${abbr(t.name)} ${last.ourScore} &nbsp;${abbr(last.opponent)} ${last.oppScore}</span></button>`;
  nextG.forEach(e=>{ const opp=((e.title.match(/vs\.?\s+(.+)/i)||[])[1]||e.title); const d=new Date(e.date+'T12:00:00'); h+=`<button class="strip-card" onclick="showView('schedule')"><span class="strip-tag">${d.toLocaleDateString('en-US',{weekday:'short'}).toUpperCase()} ${fmtTime(e.time).replace(' ','')}</span><span class="strip-score">${abbr(t.name)} @ ${abbr(opp)}</span></button>`; });
  $('#scoreStrip').innerHTML = h || `<span class="strip-empty">No games yet — tap ＋ to schedule one! 🥎</span>`;
}

/* ---------- HOME ---------- */
function dateBlock(iso){ const d=new Date(iso+'T12:00:00'); return `<div class="date-block"><span class="dow">${d.toLocaleDateString('en-US',{weekday:'short'}).toUpperCase()}</span><span class="day">${d.getDate()}</span><span class="mon">${d.toLocaleDateString('en-US',{month:'short'}).toUpperCase()}</span></div>`; }
function renderHome(){
  const t=team(), ps=teamPlayers(), evs=teamEvents(), gms=teamGames();
  const next = upcoming(evs)[0];
  const lastFinal = [...gms].reverse().find(g=>g.status==='final');
  const teamAVG = ps.length? ps.reduce((a,p)=>a+calcAVG(p.stats),0)/ps.length : 0;
  const totalHR = ps.reduce((a,p)=>a+p.stats.hr,0);
  const yes = next?.requireRsvp ? Object.values(next.rsvps||{}).filter(v=>v==='yes').length : 0;
  const opp = next ? ((next.title.match(/vs\.?\s+(.+)/i)||[])[1]||'') : '';
  const isGame = next && (next.type==='Game'||next.type==='Tournament');
  const msgs = S.messages.filter(m=>m.teamId===t.id).slice(-2).reverse();
  const avgL = [...ps].sort((a,b)=>calcAVG(b.stats)-calcAVG(a.stats)).slice(0,3);
  const hrL = [...ps].sort((a,b)=>b.stats.hr-a.stats.hr).slice(0,3);
  $('#view-home').innerHTML = `
    ${next ? `<div class="matchup">
      <div class="match-eyebrow">${isGame?'⭐ NEXT GAME':'📌 UP NEXT'} • ${fmtDate(next.date).toUpperCase()} • ${fmtTime(next.time)}</div>
      ${isGame
        ? `<div class="match-teams"><div class="match-team"><div class="match-abbr">${abbr(t.name)}</div><div class="match-name">${esc(t.name)} (${t.record.w}-${t.record.l}-${t.record.t})</div></div><div class="match-vs">VS</div><div class="match-team right"><div class="match-abbr">${abbr(opp)}</div><div class="match-name">${esc(opp)}</div></div></div>`
        : `<div class="match-teams"><div class="match-team"><div class="match-abbr" style="font-size:32px">${esc(next.title)}</div><div class="match-name">${esc(next.type)}</div></div></div>`}
      <div class="match-meta">📍 ${esc(next.location||'Location TBD')}${next.uniform?` &nbsp;•&nbsp; 👕 ${esc(next.uniform)}`:''}</div>
      ${next.requireRsvp?`<div style="background:rgba(255,255,255,.14);border-radius:10px;padding:8px 12px;font-size:13px;font-weight:700;margin-bottom:12px">✅ ${yes}/${ps.length} going</div>`:''}
      <div class="row-actions" style="margin-top:0"><button class="btn-white" onclick="schedTab='upcoming';showView('schedule')">RSVP Now</button><button class="btn-live" onclick="goLive()">🔴 Score Live</button></div>
    </div>`
    : `<div class="card" style="text-align:center"><h2>Welcome to ${esc(t.name)}! 🥎</h2><p class="muted">Schedule your first event to get the season rolling.</p><button class="btn-primary" onclick="openModal('eventModal')">+ Schedule Event</button></div>`}

    <div class="stat-strip">
      <div class="stat-cell"><div class="v">${t.record.w}-${t.record.l}-${t.record.t}</div><div class="l">RECORD</div></div>
      <div class="stat-cell"><div class="v">${streak()}</div><div class="l">STREAK</div></div>
      <div class="stat-cell"><div class="v">${f3(teamAVG)}</div><div class="l">TEAM AVG</div></div>
      <div class="stat-cell"><div class="v">${totalHR}</div><div class="l">HOME RUNS</div></div>
    </div>

    <div class="sec-head">📅 Up Next</div>
    ${upcoming(evs).slice(0,4).map(e=>`<div class="ev-row">${dateBlock(e.date)}<div class="ev-body"><span class="chip ${e.type==='Game'?'green':e.type==='Practice'?'blue':e.type==='Tournament'?'amber':'purple'}">${esc(e.type).toUpperCase()}</span> <b>${esc(e.title)}</b><div class="muted">🕕 ${fmtTime(e.time)} • 📍 ${esc(e.location||'TBD')}</div></div><button class="btn-outline" style="align-self:center" onclick="schedTab='upcoming';showView('schedule')">RSVP</button></div>`).join('') || '<div class="card"><p class="muted">Nothing scheduled. 🎉</p></div>'}

    <div class="grid2">
      <div><div class="sec-head">👑 AVG Leaders</div><div class="card">${avgL.map((p,i)=>`<div class="leader"><span class="rank ${['gold','silver','bronze'][i]}">${i+1}</span><span style="flex:1"><b>#${p.number} ${esc(pname(p))}</b></span><b>${f3(calcAVG(p.stats))}</b></div>`).join('')}</div></div>
      <div><div class="sec-head">💣 HR Leaders</div><div class="card">${hrL.map((p,i)=>`<div class="leader"><span class="rank ${['gold','silver','bronze'][i]}">${i+1}</span><span style="flex:1"><b>#${p.number} ${esc(pname(p))}</b></span><b>${p.stats.hr}</b></div>`).join('')}</div></div>
    </div>

    <div class="grid2">
      <div><div class="sec-head">📻 Latest Final</div><div class="card">
        ${S.live? `<div class="duty-row" style="border-color:var(--red)"><span class="chip red">● LIVE</span><b style="flex:1">${esc(t.name)} ${S.live.us} – ${S.live.them} ${esc(S.live.opp)}</b><button class="btn-live" onclick="showView('live')">Open</button></div>`:''}
        ${lastFinal? `<div class="duty-row"><span class="chip ${lastFinal.ourScore>lastFinal.oppScore?'green':'gray'}">${lastFinal.ourScore>lastFinal.oppScore?'W':'L'} ${lastFinal.ourScore}–${lastFinal.oppScore}</span><span style="flex:1">vs ${esc(lastFinal.opponent)}<br><span class="muted">${fmtDate(lastFinal.date)}</span></span><button class="btn-outline" onclick="liveTab='past';showView('live')">Recap</button></div>`:'<p class="muted">No finals yet.</p>'}
      </div></div>
      <div><div class="sec-head">📣 Team Board</div><div class="card">
        ${msgs.map(m=>`<div class="chat-msg ${m.pinned?'pinned':''}"><b>${esc(m.author)}</b> <span class="muted">${esc(m.time)}</span><br>${esc(m.text)}</div>`).join('')}
        <div class="row-actions"><button class="btn-secondary" onclick="showView('messages')">Open Chat 💬</button></div>
      </div></div>
    </div>`;
}

/* ---------- MORE MENU ---------- */
function renderMore(){
  const t=team();
  const openSlots = S.duties.filter(d=>d.teamId===t.id).reduce((a,d)=>a+d.slots.filter(s=>!s.by).length,0);
  const duesOwed = S.dues.filter(d=>d.teamId===t.id).reduce((a,d)=>a+teamPlayers().filter(p=>!d.paid?.[p.id]).length,0);
  const cell=(view,ico,label,sub)=>`<div class="more-cell" onclick="showView('${view}')"><div class="mi">${ico}</div><b>${label}</b><span>${sub}</span></div>`;
  $('#view-more').innerHTML=`
    <div class="sec-head">☰ More</div>
    <div class="more-grid">
      ${cell('messages','💬','Team Chat', S.messages.filter(m=>m.teamId===t.id).length+' messages')}
      ${cell('duties','🍊','Snacks & Duties', openSlots? openSlots+' open slots':'All filled! 🎉')}
      ${cell('dues','💰','Dues & Fees', duesOwed? duesOwed+' unpaid':'All paid up!')}
      ${cell('media','📸','Highlights', S.media.filter(m=>m.teamId===t.id).length+' moments')}
      ${cell('drills','🏋️','Practice Library','8 drills')}
      ${cell('settings','⚙️','Settings','Team + data')}
    </div>
    <div class="card" style="margin-top:14px"><h3>⚡ Quick Actions</h3>
      <div class="row-actions">
        <button class="btn-secondary" onclick="openModal('playerModal')">👤 Add Player</button>
        <button class="btn-secondary" onclick="openModal('messageModal')">📣 Announce</button>
        <button class="btn-secondary" onclick="showView('stats')">📈 Enter Stats</button>
        <button class="btn-secondary" onclick="openModal('gcModal')">🔗 GameChanger Link</button>
      </div></div>`;
}

/* ---------- LIVE / SCORES ---------- */
function goLive(){ showView('live'); if(!S.live) openModal('gameModal'); }
function startLiveGame(){
  const opp=$('#ng-opp').value.trim()||'Opponent';
  const loc=$('#ng-loc').value.trim()||team().name+' Field';
  const weHome=$('#ng-home').value==='home';
  closeModal();
  S.live={opp, loc, weHome, inning:1, half: weHome?'Top':'Bot', outs:0, balls:0, strikes:0, bases:[false,false,false], us:0, them:0, batterIdx:0, maxInn:parseInt($('#ng-inn').value)||7, feed:[{t:'Pregame', text:`🔴 LIVE: ${esc(team().name)} vs ${esc(opp)} at ${esc(loc)}. Play ball!`, time: new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}], status:'live', teamId:S.activeTeamId};
  save(); renderTeamBits(); renderLive(); renderStrip();
  toast('🔴 You are LIVE! Families can follow the feed.');
}
function liveBatter(){ const ps=teamPlayers(S.live.teamId); return ps.length? ps[S.live.batterIdx % ps.length] : {first:'Batter',last:'',number:'-'}; }
function pushFeed(text, cls=''){
  const L=S.live; const label = `${L.half} ${L.inning}${['st','nd','rd'][L.inning-1]||'th'}`;
  L.feed.unshift({t:label, text, cls, time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})});
}
function advanceBases(n, batter){
  const L=S.live; let scored=0;
  if(n>=4){ scored = L.bases.filter(Boolean).length + 1; L.bases=[false,false,false]; }
  else { const nb=[false,false,false]; for(let i=2;i>=0;i--){ if(L.bases[i]){ const dest=i+n; if(dest>=3) scored++; else nb[dest]=true; } } nb[n-1]=true; L.bases=nb; }
  if(L.weHome ? L.half==='Bot' : L.half==='Top'){ L.us+=scored; } else { L.them+=scored; }
  const ourAB = (L.weHome && L.half==='Bot') || (!L.weHome && L.half==='Top');
  if(ourAB && batter && batter.id){
    const p=S.players.find(x=>x.id===batter.id);
    if(p){ p.stats.ab+= (n===0?0:1); if(n>0){p.stats.h+=1; if(n===2)p.stats.d2++; if(n===3)p.stats.d3++; if(n>=4)p.stats.hr++;} p.stats.rbi+=scored; }
  }
  return scored;
}
function recordPlay(kind){
  const L=S.live; if(!L) return;
  const b=liveBatter(); const nm=`#${b.number} ${b.first} ${b.last? b.last[0]+'.':''}`;
  const nextBatter = ()=>{ L.batterIdx++; };
  const out = ()=>{ L.outs++; L.balls=0; L.strikes=0; const p=S.players.find(x=>x.id===b.id); if(p && ((L.weHome&&L.half==='Bot')||(!L.weHome&&L.half==='Top'))) {p.stats.ab++; if(kind==='K')p.stats.k++;} nextBatter(); if(L.outs>=3) endHalf(true); };
  const reset = ()=>{ L.balls=0; L.strikes=0; };
  const R = (s)=> s? ` <b>+${s} run${s>1?'s':''}!</b>`:'';
  switch(kind){
    case '1B':{ const s=advanceBases(1,b); pushFeed(`✅ SINGLE — ${nm} singles!${R(s)}`, s?'score':''); reset(); nextBatter(); break; }
    case '2B':{ const s=advanceBases(2,b); pushFeed(`✅ DOUBLE — ${nm} doubles to the gap!${R(s)}`, s?'score':''); reset(); nextBatter(); break; }
    case '3B':{ const s=advanceBases(3,b); pushFeed(`✅ TRIPLE — ${nm} triples! Wheels! ⚡${R(s)}`, s?'score':''); reset(); nextBatter(); break; }
    case 'HR':{ const s=advanceBases(4,b); pushFeed(`💣 HOME RUN — ${nm} GOES YARD!${R(s)}`, 'score'); reset(); nextBatter(); break; }
    case 'BB':{ const s=advanceBases(1,b); const p=S.players.find(x=>x.id===b.id); if(p)p.stats.bb++; pushFeed(`🚶 WALK — ${nm} takes ball four.${R(s)}`,''); reset(); nextBatter(); break; }
    case 'HBP':{ const s=advanceBases(1,b); pushFeed(`🩹 HIT BY PITCH — ${nm} takes one for the team.${R(s)}`,''); reset(); nextBatter(); break; }
    case 'K': pushFeed(`❌ STRIKEOUT — ${nm} goes down swinging. (${L.outs+1} out)`); out(); break;
    case 'GO': pushFeed(`⚾ GROUNDOUT — ${nm} grounds out. (${L.outs+1} out)`); out(); break;
    case 'FO': pushFeed(`⚾ FLYOUT — ${nm} flies out. (${L.outs+1} out)`); out(); break;
    case 'SAC': pushFeed(`🤝 SAC BUNT — ${nm} moves the runner! (${L.outs+1} out)`); { const nb=[false,false,false]; for(let i=1;i<3;i++) if(L.bases[i-1]) nb[i]=true; if(L.bases[2]){ if(L.weHome?L.half==='Bot':L.half==='Top')L.us++; else L.them++; } L.bases=nb; } out(); break;
    case 'SB':{ const nb=[false,L.bases[0]||L.bases[1],L.bases[1]||L.bases[2]]; L.bases=[L.bases[0]&&L.bases[1],nb[1],nb[2]]; pushFeed(`🏃 STOLEN BASE! ${nm} swipes a bag! ⚡`); break; }
    case '+RUN':{ if(L.weHome?L.half==='Bot':L.half==='Top')L.us++; else L.them++; pushFeed(`🏠 RUN SCORES on the play!`,'score'); break; }
  }
  save(); renderLive(); renderStrip();
}
function bumpCount(kind){
  const L=S.live; if(!L) return;
  if(kind==='ball'){ L.balls++; if(L.balls>=4){ L.balls=0; L.strikes=0; recordPlay('BB'); return; } }
  if(kind==='strike'){ L.strikes++; if(L.strikes>=3){ L.balls=0; L.strikes=0; recordPlay('K'); return; } }
  if(kind==='out'){ L.outs++; L.balls=0; L.strikes=0; pushFeed(`➕ Out recorded. (${L.outs} out)`); L.batterIdx++; if(L.outs>=3) endHalf(true); }
  if(kind==='clear'){ L.balls=0; L.strikes=0; }
  save(); renderLive(); renderStrip();
}
function toggleBase(i){ if(!S.live) return; S.live.bases[i]=!S.live.bases[i]; save(); renderLive(); }
function endHalf(auto){
  const L=S.live; if(!L) return;
  pushFeed(`🔄 ${L.half} ${L.inning} over. Score: Us ${L.us} – ${L.them} ${esc(L.opp)}.`);
  L.outs=0; L.balls=0; L.strikes=0; L.bases=[false,false,false];
  if(L.half==='Top'){ L.half='Bot'; } else { L.half='Top'; L.inning++; }
  if(L.inning>L.maxInn){ endGame(); return; }
  save(); renderLive(); renderStrip();
}
function endGame(){
  const L=S.live; if(!L) return;
  const won=L.us>L.them, tie=L.us===L.them;
  pushFeed(`${won?'🏆 WE WIN':'🎬 FINAL'}: ${esc(team().name)} ${L.us} – ${L.them} ${esc(L.opp)}. ${won?'Great game!! 💚':'Good battle — back at it next time!'}`);
  S.games.push({id:uid(), teamId:L.teamId||S.activeTeamId, opponent:L.opp, date:todayISO(), time:new Date().toTimeString().slice(0,5), location:L.loc, type:'Game', status:'final', homeAway: L.weHome?'home':'away', ourScore:L.us, oppScore:L.them, feed:[...L.feed].reverse()});
  const t=S.teams.find(x=>x.id===(L.teamId||S.activeTeamId)); if(t){ if(won)t.record.w++; else if(tie)t.record.t++; else t.record.l++; }
  S.live=null; save(); renderTeamBits(); renderLive();
  toast(`Final recorded — ${won?'🏆 <b>WIN!</b>':'good battle!'}`);
}
function importGCFeed(){
  const url=$('#gc-url').value.trim(), txt=$('#gc-text').value.trim();
  const t=team(); if(url) t.gcUrl=url;
  if(txt){
    const lines=txt.split('\n').map(s=>s.trim()).filter(Boolean);
    if(!S.live){ S.live={opp:'Imported feed', loc:'', weHome:true, inning:1, half:'Bot', outs:0, balls:0, strikes:0, bases:[false,false,false], us:0, them:0, batterIdx:0, maxInn:7, feed:[], status:'live', teamId:S.activeTeamId}; }
    lines.reverse().forEach(line=> S.live.feed.unshift({t:'Imported', text:'📲 '+esc(line), cls:'gc', time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}));
    pushFeed(`🔗 Added ${lines.length} imported play(s) to the feed.`);
  } else if(url){ toast('🔗 Stream link saved!'); }
  else { toast('Paste a stream link or play-by-play text first.'); return; }
  save(); closeModal(); renderTeamBits(); liveTab='score'; renderLive(); renderStrip();
  toast('✅ Saved to the DiamondHub feed!');
}
function renderLive(){
  const t=team(); const L=S.live;
  const gms=[...teamGames()].reverse();
  const gcSearchURL='https://www.gamechanger.io/search/teams?q='+encodeURIComponent(t.gcName||t.name);
  let scoreHTML='';
  if(L){
    const b=liveBatter();
    scoreHTML=`<div class="scoreboard">
      <div style="text-align:center;margin-bottom:10px"><span class="chip red">● LIVE</span> <span style="font-size:13px;opacity:.9">${esc(L.half)} ${L.inning} • ${esc(L.loc)} • At-bat: <b>#${b.number} ${esc(b.first)} ${esc(b.last||'')}</b></span></div>
      <div class="score-teams">
        <div class="score-team"><div class="s-name">${esc(L.weHome? t.name : L.opp)}</div><div class="s-score">${L.weHome? L.us : L.them}</div><div style="font-size:12px;opacity:.7">${L.weHome?'US':'OPP'}</div></div>
        <div><div class="base-diamond">
          <div class="base b2 ${L.bases[1]?'on':''}" onclick="toggleBase(1)" title="2nd"></div>
          <div class="base b3 ${L.bases[2]?'on':''}" onclick="toggleBase(2)" title="3rd"></div>
          <div class="base b1 ${L.bases[0]?'on':''}" onclick="toggleBase(0)" title="1st"></div>
          <div class="base hp"></div>
        </div>
        <div style="display:flex;gap:10px;justify-content:center;font-size:12px"><span>B <span class="count-dots" style="display:inline-flex">${[0,1,2].map(i=>`<span class="dot ${L.balls>i?'on-b':''}"></span>`).join('')}</span></span><span>S <span class="count-dots" style="display:inline-flex">${[0,1].map(i=>`<span class="dot ${L.strikes>i?'on-s':''}"></span>`).join('')}</span></span><span>O <span class="count-dots" style="display:inline-flex">${[0,1].map(i=>`<span class="dot ${L.outs>i?'on-o':''}"></span>`).join('')}</span></span></div></div>
        <div class="score-team"><div class="s-name">${esc(L.weHome? L.opp : t.name)}</div><div class="s-score">${L.weHome? L.them : L.us}</div><div style="font-size:12px;opacity:.7">${L.weHome?'OPP':'US'}</div></div>
      </div>
      <div class="row-actions" style="justify-content:center">
        <button class="btn-secondary" onclick="bumpCount('ball')">+ Ball (${L.balls})</button>
        <button class="btn-secondary" onclick="bumpCount('strike')">+ Strike (${L.strikes})</button>
        <button class="btn-secondary" onclick="bumpCount('out')">+ Out</button>
        <button class="btn-secondary" onclick="bumpCount('clear')">Reset Count</button>
        <button class="btn-secondary" onclick="endHalf()">End Half-Inning</button>
        <button class="btn-live" onclick="endGame()">■ Final</button>
      </div></div>
    <div class="grid2"><div class="card"><h3>⚾ Score the Play</h3>
      <div class="play-btns">
        <button onclick="recordPlay('1B')">1B Single</button><button onclick="recordPlay('2B')">2B Double</button>
        <button onclick="recordPlay('3B')">3B Triple</button><button onclick="recordPlay('HR')">💣 Home Run</button>
        <button onclick="recordPlay('BB')">Walk</button><button onclick="recordPlay('HBP')">Hit by Pitch</button>
        <button onclick="recordPlay('K')">K Strikeout</button><button onclick="recordPlay('GO')">Groundout</button>
        <button onclick="recordPlay('FO')">Flyout</button><button onclick="recordPlay('SAC')">Sac Bunt</button>
        <button onclick="recordPlay('SB')">🏃 Steal</button><button onclick="recordPlay('+RUN')">🏠 +1 Run</button>
      </div>
      <p class="muted">Tap bases on the diamond to set runners. Hits auto-advance runners & credit batter stats. 🧮</p></div>
      <div class="card"><h3>📻 Live Play-by-Play</h3><div class="feed">${L.feed.map(f=>`<div class="feed-item ${f.cls||''}"><span class="f-inn">${esc(f.t)} • ${esc(f.time)}</span><br>${f.text}</div>`).join('')}</div></div></div>`;
  } else {
    scoreHTML=`<div class="card" style="text-align:center;padding:40px"><div style="font-size:56px">📻</div><h2>No live game right now</h2><p class="muted">Start scoring and every family follows pitch-by-pitch in real time.</p><div class="row-actions" style="justify-content:center"><button class="btn-live" onclick="openModal('gameModal')">🔴 Start Live Game</button><button class="btn-secondary" onclick="openModal('gcModal')">🔗 Link a GameChanger Stream</button></div></div>`;
  }
  const gcTab = `<div class="card"><h3>🔗 GameChanger Link — <span class="muted">${esc(t.gcName||t.name)}</span></h3>
    <p class="muted">Scoring this game in GameChanger too? Keep everything connected — link the stream so families can jump to it, or paste plays to keep a copy in DiamondHub.</p>
    <div class="grid3">
      <div class="drill"><b>1️⃣ Open your GC team</b><p class="muted">Looks up your team name on GameChanger.</p><button class="btn-primary" onclick="window.open('${gcSearchURL}','_blank')">🔎 Open "${esc(t.gcName||t.name)}"</button></div>
      <div class="drill"><b>2️⃣ Save stream link</b><p class="muted">Paste a public stream URL to view it here.</p><div style="display:flex;gap:6px"><input id="gc-embed" placeholder="https://web.gc.com/teams/…" value="${esc(t.gcUrl||'')}" style="flex:1;border:1.5px solid var(--line);border-radius:10px;padding:9px"><button class="btn-outline" onclick="saveGCUrl()">Save</button></div></div>
      <div class="drill"><b>3️⃣ Paste plays</b><p class="muted">Copy plays over to keep them in DiamondHub.</p><button class="btn-outline" onclick="openModal('gcModal')">📲 Paste Plays</button></div>
    </div>
    ${t.gcUrl? `<div style="margin-top:12px"><b>Saved stream:</b><p class="muted">If the site blocks embedding, use the "Open" button above.</p><iframe src="${esc(t.gcUrl)}" style="width:100%;height:420px;border:1px solid var(--line);border-radius:12px" title="GameChanger embed"></iframe></div>`:''}
  </div>`;
  $('#view-live').innerHTML = `
    <div class="pill-tabs"><button class="${liveTab==='score'?'active':''}" onclick="liveTab='score';renderLive()">📻 Score & Feed</button><button class="${liveTab==='gc'?'active':''}" onclick="liveTab='gc';renderLive()">🔗 GC Link</button><button class="${liveTab==='past'?'active':''}" onclick="liveTab='past';renderLive()">📚 Past Games</button></div>
    ${liveTab==='score'? scoreHTML : liveTab==='gc'? gcTab : `
    <div class="card"><h3>📚 Game History</h3>${gms.map(g=>`<div class="duty-row"><span class="chip ${g.status==='final'?(g.ourScore>g.oppScore?'green':'gray'):'blue'}">${g.status==='final'?`${g.ourScore> g.oppScore?'W':'L'} ${g.ourScore}–${g.oppScore}`:'SCHED'}</span><span style="flex:1"><b>vs ${esc(g.opponent)}</b><br><span class="muted">${fmtDate(g.date)} • ${esc(g.location||'')}</span></span>${g.status==='final'?`<button class="btn-outline" onclick="viewRecap('${g.id}')">Recap</button>`:''}</div>`).join('')||'<p class="muted">No games yet.</p>'}</div>
    <div id="recapBox"></div>`}`;
}
function saveGCUrl(){ const v=$('#gc-embed').value.trim(); team().gcUrl=v; save(); toast('🔗 Stream link saved!'); renderLive(); }
function viewRecap(id){ const g=S.games.find(x=>x.id===id); if(!g) return; $('#recapBox').innerHTML=`<div class="card"><h3>📝 Recap — vs ${esc(g.opponent)} (${g.ourScore}–${g.oppScore})</h3><div class="feed">${(g.feed||[]).map(f=>`<div class="feed-item"><span class="f-inn">${esc(f.t||'')}</span><br>${f.text}</div>`).join('')||'<p class="muted">No plays recorded.</p>'}</div></div>`; $('#recapBox').scrollIntoView({behavior:'smooth'}); }

/* ---------- SCHEDULE ---------- */
function renderSchedule(){
  const evs=teamEvents(); const up=upcoming(evs);
  const y=calCursor.getFullYear(), m=calCursor.getMonth();
  const first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate();
  const monthName=calCursor.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  let cells='';
  const prevDays=new Date(y,m,0).getDate();
  for(let i=first-1;i>=0;i--) cells+=`<div class="cal-day other"><span class="dnum">${prevDays-i}</span></div>`;
  for(let d=1;d<=days;d++){
    const iso=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const de=evs.filter(e=>e.date===iso);
    cells+=`<div class="cal-day ${iso===todayISO()?'today':''}" onclick="dayClick('${iso}')"><span class="dnum">${d}</span>${de.slice(0,3).map(e=>`<div class="cal-ev ev-${e.type.replace(' ','-')}">${esc(e.title.slice(0,14))}</div>`).join('')}${de.length>3?`<div class="cal-ev ev-Other">+${de.length-3} more</div>`:''}</div>`;
  }
  const used=(first+days)%7; if(used) for(let d=1;d<=7-used;d++) cells+=`<div class="cal-day other"><span class="dnum">${d}</span></div>`;
  $('#view-schedule').innerHTML=`
    <div class="pill-tabs"><button class="${schedTab==='upcoming'?'active':''}" onclick="schedTab='upcoming';renderSchedule()">⏭️ Upcoming</button><button class="${schedTab==='calendar'?'active':''}" onclick="schedTab='calendar';renderSchedule()">🗓️ Calendar</button><button class="${schedTab==='past'?'active':''}" onclick="schedTab='past';renderSchedule()">📚 Past</button>
    <span style="flex:1"></span><button onclick="openModal('eventModal')">＋ New</button><button onclick="downloadAllICS()">📥 Export .ics</button></div>
    ${schedTab==='calendar'? `<div class="card"><div class="cal-head"><button class="btn-secondary" onclick="calMove(-1)">‹</button><h2 style="margin:0">${monthName}</h2><button class="btn-secondary" onclick="calMove(1)">›</button><span style="flex:1"></span><button class="btn-secondary" onclick="calCursor=new Date();renderSchedule()">Today</button></div>
    <div class="cal-grid">${['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d=>`<div class="cal-dow">${d}</div>`).join('')}${cells}</div></div>`:''}
    ${(schedTab==='upcoming'?up:schedTab==='past'?evs.filter(e=>e.date<todayISO()).reverse():up).map(e=>eventCard(e)).join('') || '<div class="card"><p class="muted">Nothing here yet. 🎉</p></div>'}`;
}
function eventCard(e){
  const ps=teamPlayers(); const yes=Object.values(e.rsvps||{}).filter(v=>v==='yes').length;
  const pct=ps.length?Math.round(yes/ps.length*100):0;
  return `<div class="card"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${dateBlock(e.date)}<div style="flex:1;min-width:180px"><span class="chip ${e.type==='Game'?'green':e.type==='Practice'?'blue':e.type==='Tournament'?'amber':'purple'}">${esc(e.type).toUpperCase()}</span><h3 style="margin:2px 0">${esc(e.title)}</h3><span class="muted">🕕 ${fmtTime(e.time)} • 📍 ${esc(e.location||'TBD')} ${e.uniform?`• 👕 ${esc(e.uniform)}`:''}</span></div><div class="row-actions" style="margin:0"><button class="btn-secondary" onclick="downloadICS('${e.id}')">📥 .ics</button><button class="btn-secondary" onclick="sendInvites('${e.id}')">✉️ Invite</button><button class="btn-secondary" onclick="deleteEvent('${e.id}')">🗑️</button></div></div>
  ${e.notes?`<p style="font-size:13px">${esc(e.notes)}</p>`:''}
  ${e.requireRsvp?`<b style="font-size:13px">RSVP — ${yes}/${ps.length} going (${pct}%)</b><div class="progress"><div style="width:${pct}%"></div></div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">${ps.map(p=>{const v=(e.rsvps||{})[p.id];return `<button class="chip ${v==='yes'?'green':v==='no'?'red':v==='maybe'?'amber':'gray'}" style="border:none;cursor:pointer" onclick="cycleRSVP('${e.id}','${p.id}')" title="Tap to change">#${p.number} ${esc(p.first)} ${v==='yes'?'✓':v==='no'?'✕':v==='maybe'?'?':'·'}</button>`;}).join('')}</div>
  <p class="muted">Tap a player to cycle Going → Maybe → Out. ⏰</p>`:'<p class="muted">No RSVP required for this event.</p>'}</div>`;
}
function calMove(n){ calCursor=new Date(calCursor.getFullYear(), calCursor.getMonth()+n, 1); renderSchedule(); }
function dayClick(iso){ openModal('eventModal'); setTimeout(()=>{ $('#ne-date').value=iso; },50); }
function cycleRSVP(eid,pid){ const e=S.events.find(x=>x.id===eid); e.rsvps=e.rsvps||{}; const cur=e.rsvps[pid]; e.rsvps[pid]= cur==='yes'?'maybe':cur==='maybe'?'no':cur==='no'?undefined:'yes'; save(); renderSchedule(); }
function deleteEvent(id){ if(!confirm('Delete this event?')) return; S.events=S.events.filter(e=>e.id!==id); save(); renderSchedule(); renderStrip(); toast('Event deleted.'); }
function createEvent(){
  const title=$('#ne-title').value.trim(); if(!title){toast('Give the event a title first 📝');return;}
  const opp=$('#ne-opp').value.trim();
  const ev={id:uid(), teamId:S.activeTeamId, title: opp && $('#ne-type').value==='Game' ? `Game vs ${opp}` : title, type:$('#ne-type').value, date:$('#ne-date').value||todayISO(), time:$('#ne-time').value||'18:00', location:$('#ne-loc').value.trim(), notes:$('#ne-notes').value.trim(), uniform:$('#ne-uni').value, requireRsvp:$('#ne-rsvp').checked, rsvps:{}};
  S.events.push(ev);
  if(ev.type==='Game'&&opp) S.games.push({id:uid(), teamId:S.activeTeamId, opponent:opp, date:ev.date, time:ev.time, location:ev.location, type:'Game', status:'scheduled', homeAway:'home', ourScore:0, oppScore:0, feed:[]});
  save(); closeModal(); renderSchedule(); renderStrip();
  toast(`📅 <b>${esc(ev.title)}</b> created — invites ready for ${teamPlayers().length} families! ✉️`);
}
function icsFor(e){
  const dt=(d,t)=>d.replace(/-/g,'')+'T'+t.replace(':','')+'00';
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DiamondHub//Softball//EN','BEGIN:VEVENT',`UID:${e.id}@diamondhub`,`DTSTART:${dt(e.date,e.time)}`,`SUMMARY:${team().name} — ${e.title}`,`LOCATION:${e.location||''}`,`DESCRIPTION:${(e.notes||'')+(e.uniform?` Uniform: ${e.uniform}`:'')}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
}
function dl(name, text, type='text/calendar'){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type})); a.download=name; a.click(); }
function downloadICS(id){ const e=S.events.find(x=>x.id===id); dl(`${e.title.replace(/\W+/g,'_')}.ics`, icsFor(e)); toast('📥 Calendar invite downloaded — works with Apple, Google & Outlook!'); }
function downloadAllICS(){ const evs=teamEvents(); if(!evs.length){toast('No events to export.');return;} const all=evs.map(e=>icsFor(e).split('\r\n').slice(3,-1).join('\r\n')).join('\r\n'); dl(`${team().name.replace(/\W+/g,'_')}_schedule.ics`, 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//DiamondHub//Softball//EN\r\n'+all+'\r\nEND:VCALENDAR'); toast(`📥 Exported ${evs.length} events to calendar file!`); }
function sendInvites(id){ const e=S.events.find(x=>x.id===id); const emails=teamPlayers().map(p=>p.parentEmail).filter(Boolean).join(','); const subject=encodeURIComponent(`${team().name} — ${e.title} (${fmtDate(e.date)})`); const body=encodeURIComponent(`Hi team!\n\nYou're invited to:\n${e.title}\n${fmtDate(e.date)} at ${fmtTime(e.time)}\n${e.location||''}\n${e.notes||''}\n\nPlease RSVP in DiamondHub! 🥎\n— Coach`); window.location.href=`mailto:${emails}?subject=${subject}&body=${body}`; toast('✉️ Opening your email app with all parent invites…'); }

/* ---------- ROSTER ---------- */
function renderRoster(){
  const ps=teamPlayers();
  $('#view-roster').innerHTML=`<div class="card"><div style="display:flex;gap:10px;align-items:center"><h2 style="flex:1;margin:0">👥 Roster (${ps.length})</h2><button class="btn-primary" onclick="openModal('playerModal')">+ Add Player</button></div><p class="muted">Tap a player for their full card — contact, stats & attendance.</p></div>
  ${ps.map(p=>`<div class="player-row" onclick="playerDetail('${p.id}')"><div class="jersey" style="background:${team().color}">#${p.number}</div><div class="player-meta"><b>${esc(pname(p))}</b><span>${esc(p.pos)} • B:${p.bats} T:${p.throws} • AVG ${f3(calcAVG(p.stats))} • ${p.stats.hr} HR • ${p.stats.rbi} RBI</span></div><span class="chip gray">${esc(p.parent||'')}</span><button class="btn-outline" onclick="event.stopPropagation();openStatModal('${p.id}')">+ Stats</button></div>`).join('')||'<div class="card">No players yet — add your first! 👤</div>'}`;
}
function createPlayer(){
  const f=$('#np-first').value.trim(); if(!f){toast('Player needs at least a first name 🙂');return;}
  S.players.push({id:uid(), teamId:S.activeTeamId, first:f, last:$('#np-last').value.trim(), number:parseInt($('#np-num').value)||0, pos:$('#np-pos').value, bats:$('#np-bats').value, throws:$('#np-throws').value, parent:$('#np-parent').value.trim(), parentEmail:$('#np-email').value.trim(), parentPhone:$('#np-phone').value.trim(), stats:blankStats()});
  save(); closeModal(); renderRoster(); renderTeamBits(); toast(`👤 <b>${esc(f)}</b> joined the squad!`);
}
function playerDetail(id){
  const p=S.players.find(x=>x.id===id); if(!p) return; const s=p.stats;
  const evs=teamEvents().filter(e=>e.requireRsvp); const att=evs.filter(e=>e.rsvps?.[p.id]==='yes').length;
  $('#playerDetailBody').innerHTML=`<div style="display:flex;gap:14px;align-items:center"><div class="jersey" style="background:${team().color};width:64px;height:64px;font-size:24px">#${p.number}</div><div><h2 style="margin:0">${esc(pname(p))}</h2><p class="muted" style="margin:2px 0">${esc(p.pos)} • Bats ${p.bats} / Throws ${p.throws}<br>👪 ${esc(p.parent||'—')} • ${esc(p.parentEmail||'')} • ${esc(p.parentPhone||'')}</p></div></div>
  <div class="grid4" style="margin-top:14px">
    <div class="drill"><div style="font-family:var(--cond);font-size:28px;font-weight:800">${f3(calcAVG(s))}</div><span class="muted">AVG</span></div>
    <div class="drill"><div style="font-family:var(--cond);font-size:28px;font-weight:800">${f3(calcOBP(s))}</div><span class="muted">OBP</span></div>
    <div class="drill"><div style="font-family:var(--cond);font-size:28px;font-weight:800">${f3(calcSLG(s))}</div><span class="muted">SLG</span></div>
    <div class="drill"><div style="font-family:var(--cond);font-size:28px;font-weight:800">${s.hr}</div><span class="muted">HOME RUNS</span></div>
  </div>
  <div class="table-wrap"><table><tr><th>AB</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>RBI</th><th>R</th><th>BB</th><th>K</th><th>SB</th></tr><tr><td>${s.ab}</td><td>${s.h}</td><td>${s.d2}</td><td>${s.d3}</td><td>${s.hr}</td><td>${s.rbi}</td><td>${s.r}</td><td>${s.bb}</td><td>${s.k}</td><td>${s.sb}</td></tr></table></div>
  ${s.ip?`<p><b>Pitching:</b> ${s.ip} IP • ${calcERA(s).toFixed(2)} ERA • ${s.pk} K • ${s.pbb} BB</p>`:''}
  <p><b>Attendance:</b> ${att}/${evs.length} RSVP'd yes (${evs.length?Math.round(att/evs.length*100):0}%)</p>
  <div class="row-actions"><button class="btn-primary" onclick="closeModal();openStatModal('${p.id}')">📝 Log Stats</button><button class="btn-secondary" onclick="closeModal();removePlayer('${p.id}')">Remove</button></div>`;
  openModal('playerDetailModal');
}
function removePlayer(id){ if(!confirm('Remove this player?'))return; S.players=S.players.filter(p=>p.id!==id); save(); renderRoster(); }

/* ---------- STATS ---------- */
function openStatModal(id){ statTargetId=id; const p=S.players.find(x=>x.id===id); $('#statPlayerName').textContent=`#${p.number} ${pname(p)}`; ['ab','h','2b','3b','hr','rbi','r','bb','k','sb','ip','er','pk','pbb'].forEach(k=>{ const el=$('#st-'+k); if(el) el.value=0; }); openModal('statModal'); }
function saveStats(){
  const p=S.players.find(x=>x.id===statTargetId); if(!p) return; const v=id=>parseFloat($(id).value)||0;
  p.stats.ab+=v('#st-ab'); p.stats.h+=v('#st-h'); p.stats.d2+=v('#st-2b'); p.stats.d3+=v('#st-3b'); p.stats.hr+=v('#st-hr'); p.stats.rbi+=v('#st-rbi'); p.stats.r+=v('#st-r'); p.stats.bb+=v('#st-bb'); p.stats.k+=v('#st-k'); p.stats.sb+=v('#st-sb'); p.stats.ip+=v('#st-ip'); p.stats.er+=v('#st-er'); p.stats.pk+=v('#st-pk'); p.stats.pbb+=v('#st-pbb');
  save(); closeModal(); renderStats(); toast(`📈 Stats saved for <b>${esc(pname(p))}</b>!`);
}
function renderStats(){
  const ps=[...teamPlayers()];
  const val=(p,k)=>({AVG:calcAVG(p.stats),OBP:calcOBP(p.stats),SLG:calcSLG(p.stats),OPS:calcOBP(p.stats)+calcSLG(p.stats),HR:p.stats.hr,RBI:p.stats.rbi,R:p.stats.r,SB:p.stats.sb,AB:p.stats.ab,H:p.stats.h}[k]);
  ps.sort((a,b)=>(val(b,statsSort.key)-val(a,statsSort.key))* (statsSort.dir===-1?1:-1));
  const th=k=>`<th onclick="statsSort={key:'${k}',dir:statsSort.key==='${k}'?-statsSort.dir:-1};renderStats()">${k}${statsSort.key===k?(statsSort.dir===-1?' ▼':' ▲'):''}</th>`;
  $('#view-stats').innerHTML=`
  <div class="grid3">
    <div class="card"><h3>👑 Batting Avg</h3>${[...teamPlayers()].sort((a,b)=>calcAVG(b.stats)-calcAVG(a.stats)).slice(0,3).map((p,i)=>`<div class="leader"><span class="rank ${['gold','silver','bronze'][i]}">${i+1}</span><span style="flex:1">#${p.number} ${esc(p.first)} ${esc(p.last[0]||'')}.</span><b>${f3(calcAVG(p.stats))}</b></div>`).join('')}</div>
    <div class="card"><h3>💪 RBI</h3>${[...teamPlayers()].sort((a,b)=>b.stats.rbi-a.stats.rbi).slice(0,3).map((p,i)=>`<div class="leader"><span class="rank ${['gold','silver','bronze'][i]}">${i+1}</span><span style="flex:1">#${p.number} ${esc(p.first)} ${esc(p.last[0]||'')}.</span><b>${p.stats.rbi}</b></div>`).join('')}</div>
    <div class="card"><h3>🔥 Pitching Ks</h3>${[...teamPlayers()].filter(p=>p.stats.ip>0).sort((a,b)=>b.stats.pk-a.stats.pk).slice(0,3).map((p,i)=>`<div class="leader"><span class="rank ${['gold','silver','bronze'][i]}">${i+1}</span><span style="flex:1">#${p.number} ${esc(p.first)} ${esc(p.last[0]||'')}.</span><b>${p.stats.pk} K</b></div>`).join('')||'<p class="muted">No pitching stats yet.</p>'}</div>
  </div>
  <div class="card"><div style="display:flex;align-items:center;gap:10px"><h3 style="flex:1;margin:0">📊 Season Batting — tap a header to sort</h3><button class="btn-secondary" onclick="exportStatsCSV()">📥 Export CSV</button></div>
  <div class="table-wrap"><table><tr><th>#</th><th>Player</th>${['AB','H','HR','RBI','R','SB','AVG','OBP','SLG','OPS'].map(th).join('')}<th></th></tr>
  ${ps.map(p=>`<tr><td>${p.number}</td><td><b>${esc(pname(p))}</b><br><span class="muted">${esc(p.pos)}</span></td><td>${p.stats.ab}</td><td>${p.stats.h}</td><td>${p.stats.hr}</td><td>${p.stats.rbi}</td><td>${p.stats.r}</td><td>${p.stats.sb}</td><td><b>${f3(calcAVG(p.stats))}</b></td><td>${f3(calcOBP(p.stats))}</td><td>${f3(calcSLG(p.stats))}</td><td>${f3(calcOBP(p.stats)+calcSLG(p.stats))}</td><td><button class="btn-outline" onclick="openStatModal('${p.id}')">+ Log</button></td></tr>`).join('')}</table></div></div>
  <div class="card"><h3>🎯 Pitching</h3><div class="table-wrap"><table><tr><th>Player</th><th>IP</th><th>ER</th><th>ERA</th><th>K</th><th>BB</th></tr>
  ${teamPlayers().filter(p=>p.stats.ip>0).map(p=>`<tr><td><b>#${p.number} ${esc(pname(p))}</b></td><td>${p.stats.ip}</td><td>${p.stats.er}</td><td><b>${calcERA(p.stats).toFixed(2)}</b></td><td>${p.stats.pk}</td><td>${p.stats.pbb}</td></tr>`).join('')||'<tr><td colspan=6 class="muted">No pitching lines yet — log some in + Log.</td></tr>'}</table></div>
  <canvas class="chart" id="avgChart" height="220"></canvas></div>`;
  drawChart();
}
function drawChart(){
  const c=$('#avgChart'); if(!c) return; const ctx=c.getContext('2d');
  const W=c.width=c.offsetWidth*2, H=c.height=440;
  const ps=[...teamPlayers()].sort((a,b)=>calcAVG(b.stats)-calcAVG(a.stats)).slice(0,8);
  const max=Math.max(...ps.map(p=>calcAVG(p.stats)),.1);
  ctx.clearRect(0,0,W,H); ctx.fillStyle='#0f1e33'; ctx.font='700 26px Inter'; ctx.fillText('TOP 8 — BATTING AVG', 20, 40);
  ps.forEach((p,i)=>{ const bw=(W-260)*(calcAVG(p.stats)/max); const y=70+i*44;
    ctx.fillStyle='#e2e8f0'; ctx.fillRect(230,y,W-260,26);
    ctx.fillStyle= i===0?'#f59e0b':team().color; ctx.fillRect(230,y,Math.max(bw,8),26);
    ctx.fillStyle='#0f1e33'; ctx.font='600 22px Inter'; ctx.fillText(`#${p.number} ${p.first}`, 20, y+22);
    ctx.fillStyle='#64748b'; ctx.fillText(f3(calcAVG(p.stats)), 240+Math.max(bw,8)+8 > W-90? W-90 : 240+Math.max(bw,8)+8, y+22);
  });
}
function exportStatsCSV(){
  const rows=[['#','Player','Pos','AB','H','2B','3B','HR','RBI','R','BB','K','SB','AVG','OBP','SLG','OPS','IP','ER','ERA','PK']];
  teamPlayers().forEach(p=>{const s=p.stats; rows.push([p.number,pname(p),p.pos,s.ab,s.h,s.d2,s.d3,s.hr,s.rbi,s.r,s.bb,s.k,s.sb,f3(calcAVG(s)),f3(calcOBP(s)),f3(calcSLG(s)),f3(calcOBP(s)+calcSLG(s)),s.ip,s.er,calcERA(s).toFixed(2),s.pk]);});
  dl(`${team().name.replace(/\W+/g,'_')}_stats.csv`, rows.map(r=>r.join(',')).join('\n'), 'text/csv'); toast('📥 Stats CSV downloaded!');
}

/* ---------- LINEUP ---------- */
function getLineup(){ const tid=S.activeTeamId; if(!S.lineups[tid]){ const ps=teamPlayers(); S.lineups[tid]={order:ps.map(p=>p.id), pos:Object.fromEntries(ps.map((p,i)=>[p.id,['P','C','1B','2B','3B','SS','LF','CF','RF','DP'][i]||'BN']))}; } return S.lineups[tid]; }
function renderLineup(){
  const L=getLineup(); const ps=teamPlayers(); const byId=Object.fromEntries(ps.map(p=>[p.id,p]));
  const order=L.order.filter(id=>byId[id]); ps.forEach(p=>{ if(!order.includes(p.id)) order.push(p.id); }); L.order=order;
  $('#view-lineup').innerHTML=`<div class="grid2"><div class="card"><h3>📋 Batting Order — use ↑↓</h3>
    ${order.map((id,i)=>{const p=byId[id]; return `<div class="duty-row"><b>${i+1}</b><span style="flex:1"><b>#${p.number} ${esc(pname(p))}</b> <span class="muted">AVG ${f3(calcAVG(p.stats))}</span></span><select onchange="setLineupPos('${id}',this.value)" style="border:1px solid var(--line);border-radius:8px;padding:6px">${['P','C','1B','2B','3B','SS','LF','CF','RF','DP','FLEX','BN'].map(x=>`<option ${L.pos[id]===x?'selected':''}>${x}</option>`).join('')}</select><button class="btn-secondary" onclick="moveLineup(${i},-1)">↑</button><button class="btn-secondary" onclick="moveLineup(${i},1)">↓</button></div>`;}).join('')}
    <div class="row-actions"><button class="btn-primary" onclick="save();toast('📋 Lineup saved!')">💾 Save Lineup</button><button class="btn-secondary" onclick="autoLineup()">✨ Auto-optimize (OPS)</button><button class="btn-secondary" onclick="printLineup()">🖨️ Print / Share</button></div></div>
  <div class="card"><h3>🧤 Field Diamond</h3><div style="background:linear-gradient(135deg,#16a34a,#065f46);border-radius:16px;padding:26px;position:relative;height:360px;color:#fff">
    ${fieldSpot(L,'CF','50%','6%')}${fieldSpot(L,'LF','12%','26%')}${fieldSpot(L,'RF','68%','26%')}${fieldSpot(L,'SS','32%','44%')}${fieldSpot(L,'2B','54%','44%')}${fieldSpot(L,'3B','22%','62%')}${fieldSpot(L,'1B','64%','62%')}${fieldSpot(L,'P','43%','56%')}${fieldSpot(L,'C','43%','82%')}
  </div><p class="muted">Change a player's position in the batting list and the diamond updates live. Bench (BN) players sit out this rotation. 🔄</p></div></div>`;
}
function fieldSpot(L,pos,left,top){ const ps=teamPlayers(); const id=Object.keys(L.pos).find(k=>L.pos[k]===pos); const p=ps.find(x=>x.id===id); return `<div style="position:absolute;left:${left};top:${top};background:rgba(255,255,255,.95);color:#0b1b33;border-radius:10px;padding:5px 10px;font-size:12px;font-weight:800;text-align:center;min-width:74px">${pos}<br><span style="font-weight:600">${p?('#'+p.number+' '+esc(p.first)): '—'}</span></div>`; }
function moveLineup(i,d){ const L=getLineup(); const j=i+d; if(j<0||j>=L.order.length)return; [L.order[i],L.order[j]]=[L.order[j],L.order[i]]; save(); renderLineup(); }
function setLineupPos(id,pos){ getLineup().pos[id]=pos; save(); renderLineup(); }
function autoLineup(){ const L=getLineup(); L.order=[...teamPlayers()].sort((a,b)=>calcOBP(b.stats)+calcSLG(b.stats)-(calcOBP(a.stats)+calcSLG(a.stats))).map(p=>p.id); save(); renderLineup(); toast('✨ Lineup optimized by OPS!'); }
function printLineup(){ const L=getLineup(); const ps=teamPlayers(); const byId=Object.fromEntries(ps.map(p=>[p.id,p])); const txt=`${team().name} — LINEUP\n`+L.order.map((id,i)=>`${i+1}. #${byId[id].number} ${pname(byId[id])} — ${L.pos[id]}`).join('\n'); dl('lineup.txt', txt, 'text/plain'); toast('🖨️ Lineup downloaded — screenshot or print for the dugout!'); }

/* ---------- MESSAGES ---------- */
function renderMessages(){
  const ms=S.messages.filter(m=>m.teamId===S.activeTeamId);
  const mb=$('#moreBadge'); if(mb) mb.style.display='none';
  $('#view-messages').innerHTML=`<div class="card"><div style="display:flex;gap:10px;align-items:center"><h2 style="flex:1;margin:0">💬 Team Chat & Announcements</h2><button class="btn-primary" onclick="openModal('messageModal')">📣 Announce</button></div><p class="muted">Coaches post announcements, parents reply — everyone stays in the loop.</p></div>
  <div class="card"><div class="chat-box">${ms.map(m=>`<div class="chat-msg ${m.pinned?'pinned':''}">${m.pinned?'📌 ':''}<b>${esc(m.author)}</b> <span class="muted">${esc(m.time)}</span><br>${esc(m.text)}</div>`).join('')||'<p class="muted">No messages yet.</p>'}</div>
  <div class="chat-input"><input id="chatText" placeholder="Message the team…" onkeydown="if(event.key==='Enter')sendChat()"><button class="btn-primary" onclick="sendChat()">Send</button></div></div>`;
}
function sendChat(){ const v=$('#chatText').value.trim(); if(!v)return; S.messages.push({id:uid(), teamId:S.activeTeamId, author:'Coach Miller', text:v, time:'Just now', pinned:false}); save(); renderMessages(); toast('💬 Sent to all families!'); }
function sendAnnouncement(){ const v=$('#nm-text').value.trim(); if(!v){toast('Write the announcement first ✍️');return;} S.messages.push({id:uid(), teamId:S.activeTeamId, author:'Coach Miller 📣', text:v, time:'Just now', pinned:$('#nm-pin').checked}); save(); closeModal(); if(document.querySelector('#view-messages.active'))renderMessages(); toast(`📣 Announcement sent to ${teamPlayers().length} families!`); }

/* ---------- DUTIES ---------- */
function renderDuties(){
  const ds=S.duties.filter(d=>d.teamId===S.activeTeamId);
  $('#view-duties').innerHTML=`<div class="card"><div style="display:flex;gap:10px;align-items:center"><h2 style="flex:1;margin:0">🍊 Snacks & Volunteer Duties</h2><button class="btn-primary" onclick="addDuty()">+ Add Signup</button></div><p class="muted">Every family claims a slot — coaches see gaps instantly. 🙌</p></div>
  ${ds.map(d=>`<div class="card"><h3>${esc(d.title)}</h3><p class="muted">📅 ${fmtDate(d.date)}</p>${d.slots.map((s,i)=>`<div class="duty-row"><span style="font-size:20px">${s.by?'✅':'⭕'}</span><b style="flex:1">${esc(s.role)}</b>${s.by?`<span class="chip green">${esc(s.by)}</span><button class="btn-secondary" onclick="unclaimDuty('${d.id}',${i})">Clear</button>`:`<button class="btn-primary" onclick="claimDuty('${d.id}',${i})">Claim 🙋</button>`}</div>`).join('')}<button class="btn-secondary" onclick="addSlot('${d.id}')">+ Add slot</button></div>`).join('')||'<div class="card">No signups yet.</div>'}`;
}
function addDuty(){ const t=prompt('Signup title? (e.g. Post-game snacks vs Gladstone)'); if(!t)return; S.duties.push({id:uid(), teamId:S.activeTeamId, title:t, date:todayISO(), slots:[{role:'Slot 1',by:null}]}); save(); renderDuties(); }
function addSlot(id){ const r=prompt('Slot name? (e.g. Drinks + cooler)'); if(!r)return; S.duties.find(d=>d.id===id).slots.push({role:r,by:null}); save(); renderDuties(); }
function claimDuty(id,i){ const n=prompt('Your name / family?'); if(!n)return; S.duties.find(d=>d.id===id).slots[i].by=n; save(); renderDuties(); toast('🙋 Thanks for volunteering!'); }
function unclaimDuty(id,i){ S.duties.find(d=>d.id===id).slots[i].by=null; save(); renderDuties(); }

/* ---------- DUES ---------- */
function renderDues(){
  const ps=teamPlayers(); const dues=S.dues.filter(d=>d.teamId===S.activeTeamId);
  $('#view-dues').innerHTML=`<div class="card"><div style="display:flex;gap:10px;align-items:center"><h2 style="flex:1;margin:0">💰 Dues & Fees</h2><button class="btn-primary" onclick="addDue()">+ Add Fee</button></div><p class="muted">Track who paid what. Parents see balances at a glance. 😄</p></div>
  ${dues.map(d=>{ const paid=ps.filter(p=>d.paid?.[p.id]).length; const pct=ps.length?Math.round(paid/ps.length*100):0; const collected=paid*d.amount;
  return `<div class="card"><div style="display:flex;gap:10px;align-items:center"><h3 style="flex:1;margin:0">${esc(d.title)} — $${d.amount}/player</h3><span class="chip ${pct===100?'green':'amber'}">${paid}/${ps.length} paid</span></div><p class="muted">Due ${fmtDate(d.dueDate)} • Collected $${collected} of $${d.amount*ps.length}</p><div class="progress"><div style="width:${pct}%"></div></div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">${ps.map(p=>`<button class="chip ${d.paid?.[p.id]?'green':'gray'}" style="border:none;cursor:pointer" onclick="togglePaid('${d.id}','${p.id}')" title="Tap to toggle">#${p.number} ${esc(p.first)} ${d.paid?.[p.id]?'✓ PAID':'· owes'}</button>`).join('')}</div>
  <div class="row-actions"><button class="btn-secondary" onclick="remindDues('${d.id}')">✉️ Remind unpaid</button></div></div>`;}).join('')||'<div class="card">No fees yet.</div>'}`;
}
function addDue(){ const t=prompt('Fee title? (e.g. Tournament Entry)'); if(!t)return; const a=parseFloat(prompt('Amount per player? $')||'0'); S.dues.push({id:uid(), teamId:S.activeTeamId, title:t, amount:a||0, dueDate:todayISO(), paid:{}}); save(); renderDues(); }
function togglePaid(did,pid){ const d=S.dues.find(x=>x.id===did); d.paid=d.paid||{}; d.paid[pid]=!d.paid[pid]; save(); renderDues(); }
function remindDues(did){ const d=S.dues.find(x=>x.id===did); const unpaid=teamPlayers().filter(p=>!d.paid?.[p.id]); if(!unpaid.length){toast('Everyone paid! 🎉');return;} window.location.href=`mailto:${unpaid.map(p=>p.parentEmail).filter(Boolean).join(',')}?subject=${encodeURIComponent(`Reminder: ${d.title} $${d.amount} due ${fmtDate(d.dueDate)}`)}&body=${encodeURIComponent(`Hi! Friendly reminder that ${d.title} ($${d.amount}) is due ${fmtDate(d.dueDate)}.\n\nThanks!\n— ${team().name}`)}`; toast(`✉️ Nudging ${unpaid.length} families…`); }

/* ---------- MEDIA ---------- */
function renderMedia(){
  const ms=S.media.filter(m=>m.teamId===S.activeTeamId);
  $('#view-media').innerHTML=`<div class="card"><div style="display:flex;gap:10px;align-items:center"><h2 style="flex:1;margin:0">📸 Highlights & Moments</h2><button class="btn-primary" onclick="addHighlight()">+ Add Highlight</button></div><p class="muted">Save the bombs, diving catches & dugout moments. 🎬</p></div>
  <div class="photo-grid">${ms.map(m=>`<div class="ph" title="${esc(m.title)}"><span style="font-size:52px">${m.emoji}</span></div>`).join('')}</div>
  <div class="card" style="margin-top:14px"><h3>🏅 Season Story</h3>${ms.map(m=>`<div class="leader"><span style="font-size:24px">${m.emoji}</span><span style="flex:1"><b>${esc(m.title)}</b><br><span class="muted">${fmtDate(m.date)}</span></span></div>`).join('')}</div>`;
}
function addHighlight(){ const t=prompt('Highlight title? (e.g. Walk-off double!)'); if(!t)return; const e=prompt('Pick an emoji for it: 💣 🔥 🧤 ⚡ 🏆','🔥')||'🥎'; S.media.unshift({id:uid(), teamId:S.activeTeamId, emoji:e, title:t, date:todayISO()}); save(); renderMedia(); toast('📸 Highlight saved!'); }

/* ---------- DRILLS ---------- */
const DRILLS=[
  {e:'🎯',t:'Tee Progression — Inside/Outside',d:'10 swings middle, 10 inside, 10 outside. Goal: line drives back through the middle. 15 min.',lvl:'All levels'},
  {e:'⚡',t:'Rapid-Fire Grounders',d:'Coach rolls 20 grounders in 90 seconds. Fielders focus on funnel + quick transfer. Great warmup.',lvl:'Beginner+'},
  {e:'🔥',t:'Bullpen Command Game',d:'Pitchers get points for hitting spots: corners=2, knees=1. First to 15 wins.',lvl:'Pitchers'},
  {e:'🧤',t:'Cutoffs & Relays Circuit',d:'Set up 3 relay stations. Time each group. Teaches loud calls + leading the target.',lvl:'Intermediate'},
  {e:'🏃',t:'Home-to-First Sprint Ladder',d:'Time every player home-to-first. Post the leaderboard — kids love beating their PR.',lvl:'All levels'},
  {e:'🧠',t:'Situational IQ Quiz',d:'"Runners 1st & 3rd, 1 out, ball hit to you at SS — go!" Walk through 10 scenarios.',lvl:'Advanced'},
  {e:'💪',t:'Long Toss + Arm Care',d:'10-min progressive long toss, then bands. Non-negotiable before bullpens.',lvl:'Pitchers'},
  {e:'🎉',t:'Dugout Energy Builder',d:'Each practice ends with a 2-min celebration drill — walk-up songs + tunnel.',lvl:'Culture'},
];
function renderDrills(){
  $('#view-drills').innerHTML=`<div class="card"><h2 style="margin:0">🏋️ Practice Library</h2><p class="muted">Coach-approved softball drills — tap "Add to Practice" to attach one to your next session. 📋</p></div>
  ${DRILLS.map((x,i)=>`<div class="drill"><div style="display:flex;gap:10px;align-items:center"><span style="font-size:28px">${x.e}</span><div style="flex:1"><b>${x.t}</b> <span class="chip blue">${x.lvl}</span><p class="muted" style="margin:4px 0 0">${x.d}</p></div><button class="btn-outline" onclick="attachDrill(${i})">+ Practice</button></div></div>`).join('')}`;
}
function attachDrill(i){ const nx=upcoming(teamEvents()).find(e=>e.type==='Practice'); if(!nx){toast('No upcoming practice — create one first! 📅');return;} nx.notes=(nx.notes?nx.notes+' | ':'')+DRILLS[i].t; save(); toast(`✅ <b>${DRILLS[i].t}</b> added to ${fmtDate(nx.date)} practice!`); }

/* ---------- SETTINGS ---------- */
function renderSettings(){
  const t=team();
  $('#view-settings').innerHTML=`<div class="grid2">
  <div class="card"><h3>⚙️ Team Settings</h3>
    <div class="form-grid" style="grid-template-columns:1fr">
      <label>Team name<input id="s-name" value="${esc(t.name)}"></label>
      <label>Age group<input id="s-age" value="${esc(t.age)}"></label>
      <label>Season<input id="s-season" value="${esc(t.season)}"></label>
      <label>Record (W-L-T)<div style="display:flex;gap:6px"><input id="s-w" type="number" value="${t.record.w}" style="width:70px"><input id="s-l" type="number" value="${t.record.l}" style="width:70px"><input id="s-t" type="number" value="${t.record.t}" style="width:70px"></div></label>
    </div><button class="btn-primary" onclick="saveSettings()">💾 Save</button></div>
  <div class="card"><h3>🔗 GameChanger Connection</h3><p class="muted">Save your GameChanger team name so the Scores tab can link to your streams.</p>
    <div class="form-grid" style="grid-template-columns:1fr"><label>GC team name<input id="s-gc" value="${esc(t.gcName||'')}" placeholder="Escanaba Eskymos 14U"></label><label>Public stream URL (optional)<input id="s-gcurl" value="${esc(t.gcUrl||'')}" placeholder="https://web.gc.com/teams/…"></label></div>
    <div class="row-actions"><button class="btn-primary" onclick="saveGCSettings()">💾 Save</button><button class="btn-secondary" onclick="window.open('https://www.gamechanger.io/search/teams?q=${encodeURIComponent(t.gcName||t.name)}','_blank')">🔎 Find in GameChanger</button></div></div></div>
  <div class="grid3">
    <div class="card"><h3>👥 All Teams (${S.teams.length})</h3>${S.teams.map(x=>`<div class="duty-row"><span style="font-size:20px">${x.emoji}</span><b style="flex:1">${esc(x.name)}</b>${x.id!==S.activeTeamId?`<button class="btn-secondary" onclick="deleteTeam('${x.id}')">Delete</button>`:'<span class="chip green">ACTIVE</span>'}</div>`).join('')}<button class="btn-outline" onclick="openModal('teamModal')">+ New Team</button></div>
    <div class="card"><h3>💾 Data</h3><p class="muted">Everything saves on this device automatically. Export a backup before the season ends!</p><div class="row-actions"><button class="btn-secondary" onclick="exportJSON()">📥 Backup JSON</button><button class="btn-secondary" onclick="document.getElementById('importFile').click()">📤 Restore</button><input type="file" id="importFile" accept=".json" style="display:none" onchange="importJSON(event)"></div></div>
    <div class="card"><h3>💡 DiamondHub Tips</h3><ul style="font-size:13px;line-height:1.9;padding-left:18px;margin:0"><li>Live scoring posts to the team feed instantly 📻</li><li>RSVP, snacks & dues live in one place ✅</li><li>Build lineups with the interactive field view 🧤</li><li>Export any event to Apple, Google or Outlook 📥</li><li>Link GameChanger streams from the Scores tab 🔗</li></ul></div>
  </div>`;
}
function saveSettings(){ const t=team(); t.name=$('#s-name').value; t.age=$('#s-age').value; t.season=$('#s-season').value; t.record={w:+$('#s-w').value||0,l:+$('#s-l').value||0,t:+$('#s-t').value||0}; save(); renderTeamBits(); renderSettings(); toast('⚙️ Saved!'); }
function saveGCSettings(){ const t=team(); t.gcName=$('#s-gc').value; t.gcUrl=$('#s-gcurl').value; save(); toast('🔗 GameChanger link saved! See the Scores tab.'); }
function deleteTeam(id){ if(S.teams.length<=1){toast('Keep at least one team 🙂');return;} if(!confirm('Delete this team and all its data?'))return; S.teams=S.teams.filter(t=>t.id!==id); S.activeTeamId=S.teams[0].id; save(); renderTeamBits(); showView('home'); }
function createTeam(){ const n=$('#nt-name').value.trim(); if(!n){toast('Name your team first 🥎');return;} const t={id:uid(), name:n, age:$('#nt-age').value||'Softball', season:$('#nt-season').value||'Fall 2026', color:$('#nt-color').value, emoji:$('#nt-emoji').value||'🥎', record:{w:0,l:0,t:0}, gcName:$('#nt-gc').value||n, gcUrl:''}; S.teams.push(t); S.activeTeamId=t.id; save(); closeModal(); renderTeamBits(); showView('home'); toast(`🎉 <b>${esc(n)}</b> created! Add players to get rolling.`); }
function exportJSON(){ dl('diamondhub_backup.json', JSON.stringify(S,null,1), 'application/json'); toast('📥 Backup downloaded!'); }
function importJSON(ev){ const f=ev.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{ try{S=JSON.parse(r.result); save(); renderTeamBits(); showView('home'); toast('📤 Backup restored!');}catch(e){toast('❌ That file didn\'t work.');} }; r.readAsText(f); }

/* ---------- SEARCH / NOTIFS / MODALS ---------- */
function globalSearch(q){ const box=$('#searchResults'); q=q.trim().toLowerCase(); if(!q){box.classList.add('hidden');return;}
  const hits=[...teamPlayers().filter(p=>pname(p).toLowerCase().includes(q)).map(p=>({t:`👤 #${p.number} ${pname(p)}`,fn:`playerDetail('${p.id}')`})), ...teamEvents().filter(e=>e.title.toLowerCase().includes(q)).map(e=>({t:`📅 ${e.title} — ${fmtDate(e.date)}`,fn:`showView('schedule')`})), ...teamGames().filter(g=>g.opponent.toLowerCase().includes(q)).map(g=>({t:`🥎 vs ${g.opponent}`,fn:`showView('live')`}))].slice(0,8);
  box.innerHTML=hits.map(h=>`<div onclick="${h.fn};document.querySelector('#searchResults').classList.add('hidden')">${esc(h.t)}</div>`).join('')||'<div>No matches</div>'; box.classList.remove('hidden'); }
function toggleSearchRow(){ const r=$('#searchRow'); r.classList.toggle('hidden'); if(!r.classList.contains('hidden')) $('#globalSearch').focus(); }
function toggleNotifications(){ const p=$('#notifPanel'); p.classList.toggle('hidden'); if(p.classList.contains('hidden'))return;
  const nx=upcoming(teamEvents())[0];
  p.innerHTML=`<div class="notif"><b>⏰ Reminder</b>${nx?`${esc(nx.title)} — ${fmtDate(nx.date)} ${fmtTime(nx.time)}`:'No upcoming events.'}</div><div class="notif"><b>🍊 Volunteers needed</b>Car wash still needs 3 more helpers!</div><div class="notif"><b>💰 Dues</b>4 players still owe tournament fees.</div><div class="notif"><b>📣 Coach posted</b>Check the latest announcement in Team Chat.</div>`;
  $('#notifCount').style.display='none'; }
function openModal(id){ $('#modalOverlay').classList.remove('hidden'); document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden')); $('#'+id).classList.remove('hidden'); $('#quickMenu').classList.add('hidden'); if(id==='eventModal'&&!$('#ne-date').value)$('#ne-date').value=todayISO(); }
function closeModal(){ $('#modalOverlay').classList.add('hidden'); }
function quickAddMenu(){ $('#quickMenu').classList.toggle('hidden'); }

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  load();
  document.querySelectorAll('.tab-item').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
  $('#teamBtn').addEventListener('click', e=>{ e.stopPropagation(); $('#teamDropdown').classList.toggle('hidden'); });
  document.addEventListener('click',e=>{
    if(!e.target.closest('#searchRow') && !e.target.closest('.icon-btn')) $('#searchResults').classList.add('hidden');
    if(!e.target.closest('#notifPanel')&&!e.target.closest('#notifBtn')) $('#notifPanel').classList.add('hidden');
    if(!e.target.closest('#teamDropdown')&&!e.target.closest('#teamBtn')) $('#teamDropdown').classList.add('hidden');
    if(!e.target.closest('#quickMenu')) $('#quickMenu').classList.add('hidden');
  });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });
  renderTeamBits(); showView('home');
  const nx=upcoming(teamEvents())[0];
  setTimeout(()=>toast(nx?`👋 Welcome back, Coach! Next up: <b>${esc(nx.title)}</b> — ${fmtDate(nx.date)}.`:`👋 Welcome to <b>DiamondHub</b>! 🥎`),600);
});
