export const ACTIONS = {
 j:{id:'melee/thrust',duration:1.21,impact:.53,damage:1,range:75},
 k:{id:'melee/sword-slash',duration:1.41,impact:.61,damage:2,range:52},
 '1':{id:'fire/fire-ring',duration:4.22,impact:.92,damage:2,range:92},
 '2':{id:'moves/ice-lance-throw',duration:4.74,impact:1.2,damage:2},
 '3':{id:'lightning/chain-lightning',duration:2.26,impact:.63,damage:2},
 '4':{id:'arcane/arcane-beam',duration:3.3,impact:3.3,damage:2,range:350},
 '5':{id:'holy/resurrection',duration:1,impact:0,damage:0}
};
export class Game {
 constructor(onEnd=()=>{}) {this.onEnd=onEnd;this.reset();}
 reset(){Object.assign(this,{time:0,hp:5,x:90,kills:0,completed:0,wave:1,spawned:0,skullDeaths:0,bossSpawned:false,nextSpawn:2,enemies:[],action:null,blessedUntil:0,immuneUntil:0,paused:false,dead:false,serial:0,events:[]});}
 spawn(kind,x=575){const e={id:++this.serial,kind,x,hp:kind==='boss'?4:1,r:kind==='boss'?23:13,recover:0,wind:0,flash:0};this.enemies.push(e);this.events.push({type:'spawn',kind});return e;}
 cast(key){if(this.paused||this.dead||this.action||!ACTIONS[key])return false;
 this.action={key,...ACTIONS[key],age:0,hit:new Set(),fired:false,origin:this.x,projectile:this.x+34,targets:[]};
 if(key==='5')this.blessedUntil=this.time+5;
 this.events.push({type:'cast',key});return true;}
 hurt(n){if(this.dead||this.time+1e-8<this.immuneUntil||this.time+1e-8<this.blessedUntil)return false;
 this.hp=Math.max(0,this.hp-n);this.immuneUntil=this.time+1;this.events.push({type:'hurt'});
 if(!this.hp){this.dead=true;this.action=null;this.onEnd({time:this.time,kills:this.kills,waves:this.completed});}return true;}
 hit(e,a){if(e.hp<=0||a.hit.has(e.id))return;a.hit.add(e.id);e.hp=Math.max(0,e.hp-a.damage);e.flash=this.time+.18;this.events.push({type:'hit',x:e.x});
 if(e.hp===0){this.kills++;if(e.kind==='skull')this.skullDeaths++;else {this.completed++;this.wave++;this.spawned=0;this.skullDeaths=0;this.bossSpawned=false;this.nextSpawn=this.time+2;}}}
 step(dt,move=0){if(this.paused||this.dead)return; // bounded substeps prevent tunnelling and make all clocks gameplay-only
 for(let rest=dt;rest>1e-9&&!this.dead;){const d=Math.min(rest,1/120);this.tick(d,move);rest-=d;}}
 tick(dt,move){this.time+=dt;
 if(this.spawned<5&&this.time+1e-8>=this.nextSpawn){this.spawn('skull');this.spawned++;this.nextSpawn+=2;}
 if(this.spawned===5&&this.skullDeaths===5&&!this.bossSpawned){this.spawn('boss');this.bossSpawned=true;}
 const living=()=>this.enemies.filter(e=>e.hp>0);
 if(!this.action){const barrier=Math.min(548,...living().map(e=>e.x-e.r-12));this.x=Math.max(28,Math.min(barrier,this.x+move*105*dt));}
 for(const e of living()){
 const boundary=this.x+12+e.r,gap=e.x-boundary;
 if(e.kind==='skull'){
 if(this.time+1e-8>=e.recover){e.x=Math.max(boundary,e.x-38*dt);if(e.x<=boundary+1e-7){this.hurt(1);e.recover=this.time+1;}}
 }else if(e.wind){if(this.time+1e-8>=e.wind){if(gap<49)this.hurt(2);e.wind=0;e.recover=this.time+2;this.events.push({type:'hammer',x:e.x});}}
 else if(this.time+1e-8>=e.recover){if(gap<28){e.wind=this.time+.85;this.events.push({type:'wind'});}else e.x=Math.max(boundary,e.x-25*dt);}
 }
 const a=this.action;if(a&&!this.dead){a.age+=dt;
 if(a.key==='2'&&a.age>=1.2&&!a.fired){const old=a.projectile;a.projectile+=400*dt;const target=living().filter(e=>e.x+e.r>=old&&e.x-e.r<=a.projectile).sort((a,b)=>a.x-b.x)[0];if(target){this.hit(target,a);a.fired=true;a.stopX=target.x;}}
 else if(a.key!=='2'&&!a.fired&&a.age+1e-8>=a.impact){a.fired=true;let targets=[];
 if(a.key==='j'||a.key==='k'||a.key==='4')targets=living().filter(e=>e.x+e.r>=a.origin+10&&e.x-e.r<=a.origin+(a.range??0));
 if(a.key==='1')targets=living().filter(e=>Math.abs(e.x-a.origin)-e.r<=a.range);
 if(a.key==='3'){let from=a.origin;const pool=living().filter(e=>e.x>=a.origin&&e.x-e.r<=a.origin+210);while(targets.length<3&&pool.length){pool.sort((a,b)=>Math.abs(a.x-from)-Math.abs(b.x-from));const e=pool.shift();targets.push(e);from=e.x;}}
 a.targets=targets.map(e=>({x:e.x,y:e.kind==='boss'?-37:-25}));targets.forEach(e=>this.hit(e,a));}
 if(a.age+1e-8>=a.duration)this.action=null;
 }
 this.enemies=this.enemies.filter(e=>e.hp>0);
 }
}
export class Save {
 constructor(storage){this.storage=storage;this.available=true;this.data={lang:'en',muted:false,best:{time:0,kills:0,waves:0}};try{const d=JSON.parse(storage.getItem('jack-of-all-trades')||'null');if(d){if(['en','zh-TW'].includes(d.lang))this.data.lang=d.lang;if(typeof d.muted==='boolean')this.data.muted=d.muted;if(d.best&&['time','kills','waves'].every(k=>Number.isFinite(d.best[k])&&d.best[k]>=0))this.data.best=d.best;}}catch{this.available=false;}}
 write(){try{this.storage.setItem('jack-of-all-trades',JSON.stringify(this.data));}catch{this.available=false;}}
 finish(run){const b=this.data.best;if(run.time>b.time||(run.time===b.time&&run.kills>b.kills)){this.data.best=run;this.write();}}
}
