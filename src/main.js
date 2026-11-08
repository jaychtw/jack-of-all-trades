import './style.css';import {Game,Save,ACTIONS} from './simulation.js';import {Renderer} from './render.js';import {words} from './i18n.js';import {Audio} from './audio.js';
const $=id=>document.getElementById(id);let storage;try{storage=localStorage;}catch{storage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};}
const save=new Save(storage),audio=new Audio(),renderer=new Renderer($('game'));let screen='title',manualPause=false,autoPause=false,portrait=false,last=0,move=0;const keys=new Set(),pointers=new Map();let lastUi='';
const g=new Game(run=>{save.finish(run);screen='over';clearInput();ui(true);});
const actionKeys=['j','k','1','2','3','4','5'],icons=['†','⚔','♨','❄','ϟ','✦','♧'],colors=['#f6d591','#b7d9ff','#ffad6c','#9ce5ff','#d2d4ff','#d9aaff','#f9e4a3'];
actionKeys.forEach((key,i)=>{const b=document.createElement('button');b.className='action';b.dataset.key=key;b.style.setProperty('--accent',colors[i]);b.innerHTML=`<strong>${icons[i]} <small>${key.toUpperCase()}</small></strong><span></span><i class="progress"></i>`;b.addEventListener('pointerdown',e=>{e.preventDefault();b.focus({preventScroll:true});cast(key);});b.addEventListener('click',e=>{if(e.detail===0)cast(key)});$('actions').append(b);});
function w(){return words[save.data.lang]};function fmt(t){const n=Math.floor(t);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;}
function clearInput(){keys.clear();pointers.clear();move=0;document.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}
function pause(){if(screen!=='play')return;g.paused=manualPause||autoPause||portrait;}
function cast(k){if(screen==='play')g.cast(k);}
async function full(){clearInput();try{if(document.fullscreenElement)await document.exitFullscreen();else await $('app').requestFullscreen();}catch{}ui(true);}
function start(){clearInput();manualPause=false;autoPause=false;g.reset();screen='play';pause();audio.next=0;audio.note=0;audio.unlock();ui(true);$('pause').focus({preventScroll:true});}
$('start').onclick=()=>{full();start();};$('restart').onclick=start;$('back').onclick=()=>{screen='title';clearInput();ui(true);$('start').focus();};
function resume(){manualPause=false;autoPause=false;pause();ui(true);$('pause').focus();}
$('resume').onclick=resume;$('pause').onclick=()=>{if(g.paused)resume();else{manualPause=true;pause();clearInput();ui(true);$('resume').focus();}};
function language(){save.data.lang=save.data.lang==='en'?'zh-TW':'en';save.write();ui(true);}
function mute(){save.data.muted=!save.data.muted;save.write();audio.muted=save.data.muted;audio.unlock();ui(true);}
for(const id of ['lang','title-lang'])$(id).onclick=language;for(const id of ['mute','title-mute'])$(id).onclick=mute;for(const id of ['fullscreen','title-full'])$(id).onclick=full;
document.querySelectorAll('[data-move]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);pointers.set(e.pointerId,+b.dataset.move);b.classList.add('held');});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,e=>{pointers.delete(e.pointerId);b.classList.remove('held');});});
window.addEventListener('keydown',e=>{const key=e.key.toLowerCase();if(['arrowleft','arrowright',' ','escape'].includes(key))e.preventDefault();if(e.repeat)return;if((key==='p'||key==='escape')&&screen==='play'){$('pause').click();return;}if(screen!=='play')return;if(['a','d','arrowleft','arrowright'].includes(key))keys.add(key);if(ACTIONS[key]){e.preventDefault();cast(key);}});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
function inactive(){clearInput();if(screen==='play'){autoPause=true;pause();ui(true);}}
window.addEventListener('blur',inactive);document.addEventListener('visibilitychange',()=>{if(document.hidden)inactive();});document.addEventListener('fullscreenchange',()=>{clearInput();layout();});
function layout(){portrait=innerHeight>innerWidth;clearInput();pause();$('rotate').hidden=!portrait;ui(true);}window.addEventListener('resize',layout);
function label(id,text){$(id).textContent=text;$(id).setAttribute('aria-label',text);}
function ui(force=false){const t=w(),stamp=[screen,save.data.lang,g.hp,g.kills,g.wave,g.completed,Math.floor(g.time),g.paused,g.action?.key,Math.ceil(g.blessedUntil-g.time),save.data.muted,save.available,audio.failed].join('|');if(!force&&stamp===lastUi)return;lastUi=stamp;document.documentElement.lang=save.data.lang;
 $('title').hidden=screen!=='title';$('arena').hidden=screen==='title';$('overlay').hidden=screen==='play'&&!g.paused||screen==='title';
 label('start',t.start);$('start').classList.toggle('zh',save.data.lang==='zh-TW');label('title-lang',t.lang);label('lang',t.lang);for(const id of ['mute','title-mute'])label(id,save.data.muted?t.unmute:t.mute);
 label('fullscreen',document.fullscreenElement?t.exitFull:t.full);$('title-full').setAttribute('aria-label',document.fullscreenElement?t.exitFull:t.full);$('title-full').title=t.full;
 label('pause',g.paused?t.resume:t.pause);label('resume',t.resume);label('restart',t.restart);label('back',t.title);$('help').textContent=t.help;$('game').setAttribute('aria-label',t.arena);
 $('hp').textContent=`${t.hp} ${'♥'.repeat(g.hp)}${'♡'.repeat(5-g.hp)}`;$('score').textContent=`${t.time} ${fmt(g.time)}  ·  ${t.kills} ${g.kills}\n${t.wave} ${g.wave} · ${g.bossSpawned?t.king:t.skulls+' '+g.skullDeaths+'/5'}`;
 $('status').textContent=!save.available?t.storage:audio.failed?t.audio:g.time<g.blessedUntil?`${t.blessed} ◇ ${Math.max(0,g.blessedUntil-g.time).toFixed(0)}s`:g.action?`${t.casting}: ${t.actions[actionKeys.indexOf(g.action.key)]}`:g.time<5?t.hint:'';
 $('overlay-title').textContent=screen==='over'?t.over:t.paused;const b=save.data.best;$('results').textContent=screen==='over'?`${t.time}: ${fmt(g.time)} · ${t.kills}: ${g.kills}\n${t.waves}: ${g.completed}\n${t.best}: ${fmt(b.time)} · ${t.kills}: ${b.kills} · ${t.waves}: ${b.waves}`:t.help;
 $('resume').hidden=screen==='over';$('restart').hidden=screen!=='over';$('back').hidden=screen!=='over';
 document.querySelectorAll('[data-move]').forEach(b=>{const text=+b.dataset.move<0?t.left:t.right;b.textContent=+b.dataset.move<0?'←':'→';b.setAttribute('aria-label',text);b.title=text;});
 document.querySelectorAll('.action').forEach((b,i)=>{b.querySelector('span').textContent=t.actions[i];b.setAttribute('aria-label',`${t.actions[i]} (${actionKeys[i].toUpperCase()})`);b.title=b.getAttribute('aria-label');b.disabled=!!g.action||g.paused||screen!=='play';});
 if(screen==='over')$('restart').focus({preventScroll:true});
}
function frame(now){const dt=last?Math.min((now-last)/1000,.05):0;last=now;move=(keys.has('d')||keys.has('arrowright')||[...pointers.values()].includes(1)?1:0)-(keys.has('a')||keys.has('arrowleft')||[...pointers.values()].includes(-1)?1:0);if(screen==='play'){pause();g.step(dt,move);if(!g.paused)audio.music(g.time);}audio.muted=save.data.muted;for(const e of g.events)audio.effect(e);g.events=[];if(screen!=='title')renderer.render(g,move);ui();document.querySelectorAll('.action').forEach(b=>b.querySelector('.progress').style.width=g.action?.key===b.dataset.key?`${100*g.action.age/g.action.duration}%`:'0');requestAnimationFrame(frame);}
layout();ui(true);requestAnimationFrame(frame);
// Development-only inspection hook, removed from production by Vite.
if(import.meta.env.DEV)window.__game={g,save,start,renderer,get screen(){return screen}};
