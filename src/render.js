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
 heroActor(){const old=this.ctx,b=document.createElement('canvas');b.width=96;b.height=80;this.ctx=b.getContext('2d');this.ctx.translate(40,-214);this.hero({x:0,time:0,action:null,blessedUntil:0,immuneUntil:0},0);this.ctx=old;const rgba=b.getContext('2d').getImageData(0,0,96,80).data,mask=new Uint8Array(96*80),pixels=new Uint32Array(96*80);for(let i=0;i<mask.length;i++){mask[i]=rgba[i*4+3]>0?1:0;pixels[i]=(rgba[i*4+3]<<24)|(rgba[i*4+2]<<16)|(rgba[i*4+1]<<8)|rgba[i*4];}return {mask:{w:96,h:80,data:mask},pixels,x:-40,y:-72,w:96,h:80,k:2,head:[0,-63],chest:[0,-30]};}
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
 hero(g,move){const c=this.ctx,t=g.time,a=g.action,age=a?.age??0;let lean=0,arm=0,bob=(!a&&move)?Math.sin(t*16)*1.5:Math.sin(t*3)*.5;
 if(a){const p=Math.min(1,age/a.duration);lean=Math.sin(p*Math.PI)*3;arm=a.key==='j'?Math.sin(p*Math.PI)*12:a.key==='k'?Math.sin(p*Math.PI)*7:4;}
 c.save();c.translate(Math.round(g.x),Math.round(286+bob));
 const r=(x,y,w,h,col)=>this.rect(x,y,w,h,col);const p=(v,col)=>this.poly(v,col);
 // Independently authored segmented Roman silhouette: articulated boots, lamellar blue steel, crest and waving cape.
 p([[-5,-43],[-16,-39],[-27-Math.sin(t*7)*4,-18],[-17,-20],[-26,-9],[-8,-16],[4,-29]],'#351c32');
 p([[-7,-43],[-15,-38],[-22-Math.sin(t*7)*3,-22],[-14,-25],[-20,-14],[-6,-20],[0,-30]],'#a83042');
 p([[-11,-38],[-14,-28],[-20,-22],[-12,-25],[-10,-19],[-4,-29]],'#e65c52');
 const stride=!a&&move?Math.sin(t*16)*4:0;
 r(-8-stride,-15,7,13,'#24394f');r(4+stride,-15,7,13,'#25394f');r(-7-stride,-14,4,7,'#7692ac');r(5+stride,-13,4,8,'#a9bfd1');r(-10-stride,-3,11,4,'#171d2c');r(4+stride,-3,12,4,'#171d2c');r(-9-stride,-3,9,1,'#8ba6b6');r(5+stride,-3,9,1,'#c7ced1');
 c.translate(lean,0);
 p([[-10,-36],[7,-37],[12,-30],[7,-17],[-8,-17],[-13,-28]],'#172435');
 p([[-8,-34],[6,-35],[9,-29],[5,-20],[-7,-20],[-10,-29]],'#567893');r(-7,-33,3,9,'#a7c7dc');r(-3,-31,8,2,'#8ba8bf');r(-8,-20,16,3,'#c79955');r(-2,-20,3,3,'#f9dd91');
 p([[-9,-17],[9,-17],[13,-9],[5,-10],[1,-14],[-3,-9],[-13,-11]],'#3a536c');r(-9,-15,3,4,'#a2bed1');r(6,-15,3,4,'#a2bed1');
 r(-13,-34,8,6,'#1a2638');r(-12,-34,7,3,'#a6bccb');r(5,-36,10,7,'#1a2638');r(6,-36,9,3,'#b8cfdd');r(7,-33,7,2,'#6b8ba2');
 // face beneath Roman cheek plates; face stays right even when walking left
 p([[-7,-49],[5,-51],[12,-46],[12,-42],[8,-41],[8,-35],[-5,-36],[-9,-43]],'#131b2b');
 p([[-6,-48],[4,-50],[10,-46],[8,-43],[-5,-43]],'#8bacc5');r(-5,-48,8,2,'#d8e5eb');r(-6,-42,4,7,'#7c9ab5');r(-3,-44,14,2,'#e4bd70');r(3,-41,7,2,'#090e19');r(7,-40,4,5,'#d49b70');r(2,-38,4,4,'#647d94');
 p([[-11,-48],[-10,-55],[-6,-61],[0,-63],[7,-60],[11,-55],[8,-49],[5,-51],[2,-55],[-3,-56],[-6,-49]],'#481c30');
 p([[-9,-49],[-8,-55],[-4,-59],[1,-60],[6,-57],[8,-54],[6,-51],[0,-55],[-4,-54],[-6,-49]],'#c53c48');r(-2,-60,2,5,'#f16b60');r(3,-58,2,5,'#e15b55');
 // articulated front gauntlet and sword rotate through windup / impact / recovery
 let angle=-1.02;if(a?.key==='j')angle=age<.46?-0.25:age<.7?0:-.8;
 else if(a?.key==='k')angle=age<.55?-2.4:age<.75?.7:-.8;
 else if(a)angle=-.2;
 c.save();c.translate(12+arm,-27);c.rotate(angle);r(-8,-3,12,6,'#273d54');r(-7,-3,10,2,'#b7d3e3');r(1,-3,6,7,'#95b3c8');r(5,-7,3,14,'#e5b868');p([[8,-2],[33,-2],[39,0],[33,2],[8,2]],'#b2d7e9');r(8,-2,25,1,'#f4f5df');c.restore();
 if(g.time<g.blessedUntil){c.strokeStyle='#f7e2a2';c.lineWidth=1;c.beginPath();c.ellipse(0,-29,23,35,0,0,Math.PI*2);c.stroke();r(-14,-69,28,2,'#ffeebc');}
 if(g.time<g.immuneUntil){r(-16,-32,3,9,'#fff4cc');r(17,-32,3,9,'#fff4cc');}
 c.restore();}
 boss(e,t){const c=this.ctx;c.save();c.translate(Math.round(e.x),286);const r=(...v)=>this.rect(...v),p=(...v)=>this.poly(...v);const wind=e.wind>t,phase=wind?1-(e.wind-t)/.85:0,recover=e.recover>t;const breath=Math.sin(t*3);c.translate(0,Math.round(breath));
 p([[-27,-61],[23,-60],[33,-13],[19,-19],[24,-5],[4,-14],[-23,-11]],'#70283e');
 r(-16,-24,12,22,'#212833');r(6,-24,14,22,'#202733');r(-19,-7,17,8,'#151d28');r(5,-7,20,8,'#151d28');r(-17,-7,13,2,'#82909a');r(8,-7,14,2,'#82909a');
 p([[-24,-57],[19,-60],[28,-43],[19,-24],[-21,-25],[-29,-42]],'#15202a');p([[-20,-55],[16,-56],[24,-42],[16,-28],[-18,-28],[-24,-40]],'#4c6441');p([[-18,-52],[0,-55],[8,-43],[0,-32],[-18,-35]],'#75894e');
 r(-22,-28,43,6,'#593c35');r(-6,-30,12,10,'#c1b8a0');r(-4,-28,3,3,'#1c2027');r(2,-28,3,3,'#1c2027');r(-2,-23,5,3,'#77705f');
 // fur mantle and spiked shoulder plates
 p([[-23,-65],[-10,-60],[0,-64],[10,-61],[22,-66],[30,-55],[25,-49],[17,-52],[12,-48],[6,-54],[-1,-50],[-9,-53],[-16,-49],[-28,-53],[-32,-60]],'#5b5153');
 for(let i=-27;i<28;i+=5)r(i,-59+(i%3),4,4,'#a38f7e');
 p([[-29,-60],[-18,-62],[-10,-54],[-16,-46],[-33,-48],[-37,-54]],'#28333d');r(-31,-57,16,2,'#88939c');p([[-29,-61],[-30,-69],[-24,-60]],'#d6cbbb');p([[22,-61],[26,-68],[27,-58]],'#d6cbbb');
 // green tusked head, angry brow, enormous jaw and jewelled crown
 p([[-15,-80],[6,-83],[15,-76],[15,-62],[8,-55],[-12,-58],[-20,-68]],'#1b2926');p([[-14,-78],[5,-80],[12,-74],[11,-63],[4,-58],[-11,-61],[-16,-68]],'#728a49');r(-16,-73,12,3,'#27392b');r(0,-74,11,3,'#27392b');r(-13,-71,5,2,'#f0c36b');r(2,-72,5,2,'#f0c36b');r(-11,-65,19,7,'#1c2126');r(-10,-64,16,2,'#e5d8a5');p([[-13,-61],[-14,-69],[-9,-63]],'#fff0c1');p([[8,-61],[11,-70],[12,-62]],'#fff0c1');r(-9,-59,15,2,'#8d9c5b');
 p([[-17,-80],[-21,-92],[-12,-87],[-7,-95],[-1,-87],[7,-94],[9,-85],[17,-89],[12,-79]],'#704c32');p([[-15,-81],[-18,-89],[-11,-84],[-7,-92],[-2,-84],[6,-91],[7,-82],[14,-86],[11,-80]],'#e3b75c');r(-5,-85,4,4,'#db394e');
 // left-facing heavy hammer: visible raising telegraph then downstroke
 c.save();c.translate(-25,-46);c.rotate(wind?-.7-phase*1.7:recover?.7:-.5);r(-9,-3,16,9,'#79944d');r(-25,0,37,5,'#644332');r(-22,0,31,1,'#c69b5a');r(-34,-13,17,26,'#16202b');r(-33,-11,15,22,'#687886');r(-31,-10,10,3,'#a8bac0');r(-31,4,11,5,'#3b4a5e');p([[-34,-11],[-42,-15],[-35,-4]],'#e0ceb1');p([[-33,10],[-40,15],[-33,4]],'#e0ceb1');p([[-21,-13],[-19,-21],[-17,-13]],'#e0ceb1');c.restore();
 if(wind){r(-25,-103,50,3,'#f3bc68');c.fillStyle='#fff0c5';c.font='bold 12px monospace';c.fillText('!',-4,-108);}
 for(let i=0;i<4;i++)r(-18+i*10,-101,8,3,i<e.hp?'#e8be76':'#353341');
 if(e.flash>t){c.strokeStyle='#fff7da';c.strokeRect(-34,-97,69,99);}c.restore();}
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
