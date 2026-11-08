import {heroPose,heroPixels,HERO_SCALE} from './characters/hero.js';
import {orcPose,orcPixels,ORC_SCALE} from './characters/orc.js';
import {drawRig} from './characters/draw.js';
import {createFrame,clearFrame,createFx,composite} from '../vendor/pixelfx/src/core/fx.js';
import * as thrust from '../vendor/pixelfx/src/fx/melee/thrust.js';
import * as slash from '../vendor/pixelfx/src/fx/melee/sword-slash.js';
import * as fire from '../vendor/pixelfx/src/fx/fire/fire-ring.js';
import * as ice from '../vendor/pixelfx/src/fx/moves/ice-lance-throw.js';
import * as lance from '../vendor/pixelfx/src/fx/ice/ice-lance.js';
import * as charge from '../vendor/pixelfx/src/fx/arcane/spell-charge.js';
import * as burst from '../vendor/pixelfx/src/fx/ice/snowflake-burst.js';
import * as lightning from '../vendor/pixelfx/src/fx/lightning/chain-lightning.js';
import * as beam from '../vendor/pixelfx/src/fx/arcane/arcane-beam.js';
import * as blessing from '../vendor/pixelfx/src/fx/holy/resurrection.js';
import * as skull from '../vendor/pixelfx/src/fx/critters/flying-skull.js';
const modules={j:thrust,k:slash,'1':fire,'2':ice,'3':lightning,'4':beam,'5':blessing};
export class Renderer{
 constructor(canvas){this.c=canvas;this.ctx=canvas.getContext('2d');this.frame=createFrame(640,360);this.rgba=new Uint8ClampedArray(640*360*4);this.fxCanvas=document.createElement('canvas');this.fxCanvas.width=640;this.fxCanvas.height=360;this.fc=this.fxCanvas.getContext('2d');this.active=null;this.skulls=new Map();this.motion=matchMedia('(prefers-reduced-motion: reduce)').matches;this.bg=this.background();this.actor=this.heroActor();}
 heroActor(){const old=this.ctx,b=document.createElement('canvas');b.width=96;b.height=80;this.ctx=b.getContext('2d');this.ctx.translate(40,-214);this.hero({x:0,time:0,action:null,blessedUntil:0,immuneUntil:0},0);this.ctx=old;const rgba=b.getContext('2d').getImageData(0,0,96,80).data,mask=new Uint8Array(96*80),pixels=new Uint32Array(96*80);for(let i=0;i<mask.length;i++){mask[i]=rgba[i*4+3]>0?1:0;pixels[i]=(rgba[i*4+3]<<24)|(rgba[i*4+2]<<16)|(rgba[i*4+1]<<8)|rgba[i*4];}return {mask:{w:96,h:80,data:mask},pixels,x:-40,y:-72,w:96,h:80,k:2,head:[0,-57],chest:[0,-39]};}
 rect(x,y,w,h,col){const c=this.ctx;c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
 poly(pts,col){const c=this.ctx;c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y)));c.closePath();c.fill();}
 background(){const b=document.createElement('canvas');b.width=640;b.height=360;const c=this.ctx,original=this.ctx;this.ctx=b.getContext('2d');const g=this.ctx.createLinearGradient(0,0,0,290);g.addColorStop(0,'#111326');g.addColorStop(.65,'#503646');g.addColorStop(1,'#c06d46');this.ctx.fillStyle=g;this.ctx.fillRect(0,0,640,360);
 for(let i=0;i<90;i++){let x=(i*137)%640,y=(i*53)%160;this.rect(x,y,i%4===0?2:1,1,'#c4b9a2');}
 this.poly([[0,205],[40,175],[100,194],[145,165],[220,205],[300,177],[365,210],[420,180],[500,192],[580,167],[640,195],[640,290],[0,290]],'#252333');
 for(let i=0;i<8;i++){const x=i*92-15,y=100+(i*37)%65;this.rect(x,y,12,170,'#343445');this.rect(x+4,y,3,165,'#565366');this.rect(x-4,y-7,22,8,'#5c5664');if(i%2===0){this.rect(x,y-16,67,9,'#494351');this.rect(x+53,y-7,12,160,'#363643');}}
 this.poly([[0,246],[55,228],[110,243],[186,224],[240,255],[310,240],[400,250],[450,229],[520,245],[640,224],[640,300],[0,300]],'#292936');
 this.rect(0,286,640,74,'#1a1c29');this.rect(0,287,640,4,'#777078');
 for(let y=293;y<360;y+=13)for(let x=-20;x<650;x+=43){const xx=x+(y%2)*19;this.rect(xx,y,41,11,['#343341','#3e3c46','#292b38'][(x+20+y)%3]);this.rect(xx,y,41,1,'#514b52');if((x+y)%5===0)this.rect(xx+7,y+8,4,1,'#a15d43');}
 for(let i=0;i<25;i++){const x=i*83%640,y=276+i*17%12;this.poly([[x,y],[x+4,y-5],[x+11,y-3],[x+14,y+4],[x,y+4]],'#4e4750');}
 
 // Reproducible hand-authored material detail. Broken drums, flutes, mortar, weathering and distant cloud banks.
 for(let i=0;i<8;i++){const x=i*92-15,y=100+(i*37)%65;
  for(let yy=y+8;yy<270;yy+=10){this.rect(x,yy,12,1,'#242738');this.rect(x+1,yy+1,2,6,'#5b5361');this.rect(x+8,yy+1,2,6,'#292c3c');if((yy+i)%3===0)this.rect(x+4,yy+5,3,1,'#71616b');}
  this.poly([[x-4,y-7],[x+7,y-10],[x+18,y-7],[x+16,y-4],[x-4,y-4]],'#81717a');
  this.poly([[x+7,y+29],[x+3,y+36],[x+7,y+42],[x+5,y+53]],'#1d2233');
  for(let j=0;j<8;j++)this.rect(x-3+j*3,y-15+(j%3),2,2,'#71616a');
 }
 for(let i=0;i<38;i++){const x=i*119%640,y=80+i*41%132;this.poly([[x-40,y],[x-20,y-4],[x-8,y-1],[x+7,y-6],[x+30,y],[x+60,y+4],[x-46,y+4]],i%2?'#342b3d':'#2c293c');}
 for(let i=0;i<1100;i++){const x=i*137%640,y=290+i*29%70;this.rect(x,y,1+i%3,1,i%3?'#242634':'#64535a');}
 for(let i=0;i<14;i++){let x=i*59%640,y=286;this.poly([[x,y],[x+3,y-3],[x+12,y-5],[x+24,y+2],[x+20,y+6],[x+3,y+7]],'#1a1e2b');this.poly([[x,y],[x+12,y-5],[x+24,y+2],[x+13,y+1]],'#6e6167');}
 // Foreground fallen fluted column ends, below the fighting plane.
 for(const x of [14,614]){this.poly([[x-24,323],[x-15,302],[x+22,316],[x+17,338]],'#111827');this.poly([[x-19,320],[x-13,306],[x+19,319],[x+15,330]],'#4e4a58');for(let j=0;j<3;j++)this.poly([[x-15,310+j*5],[x+16,321+j*4],[x+15,323+j*4],[x-16,312+j*5]],'#77707a');}
 this.ctx=original;return b;}
 hero(g,move){const c=this.ctx,q=heroPose(g,move);
 drawRig(c,heroPixels(q),q,g.x,286,HERO_SCALE);
 // v1.0 status indicators retained independently of the character construction.
 c.save();c.translate(Math.round(g.x),286);
 if(g.time<g.blessedUntil){c.strokeStyle='#f7e2a2';c.lineWidth=1;c.beginPath();c.ellipse(0,-29,23,35,0,0,Math.PI*2);c.stroke();this.rect(-14,-69,28,2,'#ffeebc');}
 if(g.time<g.immuneUntil){this.rect(-16,-32,3,9,'#fff4cc');this.rect(17,-32,3,9,'#fff4cc');}c.restore();}
 boss(e,t){const c=this.ctx,q=orcPose(e,t);drawRig(c,orcPixels(q),q,e.x,286,ORC_SCALE,true);
 // v1.0 boss telegraph/HP/hit feedback retained; combat state is read-only.
 c.save();c.translate(Math.round(e.x),286);
 if(e.wind>t){this.rect(-25,-103,50,3,'#f3bc68');c.fillStyle='#fff0c5';c.font='bold 12px monospace';c.fillText('!',-4,-108);}
 for(let i=0;i<4;i++)this.rect(-18+i*10,-101,8,3,i<e.hp?'#e8be76':'#353341');
 if(e.flash>t){this.rect(-39,-54,3,15,'#fff1b6');this.rect(34,-55,3,16,'#fff1b6');this.rect(-4,-103,9,2,'#fff1b6');}c.restore();}
 render(g,move=0){const c=this.ctx;c.imageSmoothingEnabled=false;c.drawImage(this.bg,0,0);const t=g.time;
 // portal is independently drawn pixel masonry and rotating concentric sparks
 c.save();c.translate(579,228);for(let i=0;i<24;i++){const a=i*Math.PI/12;this.rect(Math.cos(a)*27-4,Math.sin(a)*57-4,8,9,i%2?'#777080':'#4c4d63');}
 for(let j=0;j<4;j++){c.strokeStyle=['#15182d','#24456a','#408daa','#a8dcda'][j];c.lineWidth=3;c.beginPath();c.ellipse(0,0,23-j*3,51-j*4,0,0,Math.PI*2);c.stroke();}
 for(let i=0;i<45;i++){const a=i*.7+(this.motion?0:t)*1.1;this.rect(Math.cos(a)*25,Math.sin(a)*53,2,2,i%3?'#ffb556':'#e4f3e5');}c.restore();
 clearFrame(this.frame);
 for(const e of g.enemies){if(e.kind==='boss')this.boss(e,t);else{let fx=this.skulls.get(e.id);if(!fx){fx=createFx(skull,{x:e.x,y:286,hover:26,seed:e.id});this.skulls.set(e.id,fx);}fx.options.x=e.x;const d=Math.max(0,t-(fx.last??0));fx.update(d);fx.last=t;fx.draw(this.frame);}}
 for(const id of this.skulls.keys())if(!g.enemies.some(e=>e.id===id))this.skulls.delete(id);
 this.hero(g,move);
 const a=g.action;
 if(a){if(this.active!==a){this.active=a;this.fx=null;this.iceFx=null;}
 const mod=modules[a.key],origin=a.origin;
 if(a.key==='2'){
 let m=a.age<1.2?charge:a.fired?burst:lance;
 if(this.iceMod!==m||!this.iceFx){this.iceMod=m;this.iceFx=createFx(m,{x:origin+18,y:262,seed:3});this.iceAge=a.age;}
 this.iceFx.options.x=m===charge?origin+18:m===burst?a.stopX:a.projectile;this.iceFx.update(Math.max(0,a.age-this.iceAge));this.iceAge=a.age;this.iceFx.draw(this.frame);
 }else{
 let age=a.age,delay=0;if(a.key==='j')delay=.46;if(a.key==='k')delay=.55;if(a.key==='1')delay=.32;if(a.key==='3')delay=.46;if(a.key==='4')delay=.3;
 if(a.key==='5')age*=4.8;
 if(age>=delay){if(!this.fx){let targets=a.key==='3'?(a.targets.length?a.targets.map(p=>[p.x-origin,p.y]):[[60,-25],[110,-25],[160,-25]]):undefined;
 this.fx=createFx(mod,{x:origin,y:286,targets,length:335,actor:this.actor});this.fxAge=0;}
 // Chain coordinates track the actual target geometry selected by collision logic.
 if(a.key==='3'&&a.targets.length&&this.chainTargets!==a.targets){this.chainTargets=a.targets;this.fx=createFx(mod,{x:origin,y:286,targets:a.targets.map(p=>[p.x-origin,p.y])});this.fxAge=0;}
 const targetAge=age-delay;this.fx.update(Math.max(0,targetAge-this.fxAge));this.fxAge=targetAge;this.fx.draw(this.frame);}
 }
 }else{this.active=null;this.fx=null;this.iceFx=null;this.iceMod=null;}
 composite(this.frame,this.rgba);this.fc.putImageData(new ImageData(this.rgba,640,360),0,0);c.drawImage(this.fxCanvas,0,0);
 }
}
