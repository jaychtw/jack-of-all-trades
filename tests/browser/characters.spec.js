import {test,expect} from '@playwright/test';import fs from 'node:fs';
const fixture='tests/fixtures/characters.html';
test('v1.0 scene/portal/skulls and seven spell layers remain pixel-identical',async({page})=>{
 await page.goto(fixture);await page.waitForFunction(()=>window.inspect);
 const result=await page.evaluate(()=>{
 const {old,candidate}=window.renderers;
 const compare=(a,b)=>{let n=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])n++;return n};
 const bg=compare(old.bg.getContext('2d').getImageData(0,0,640,360).data,candidate.bg.getContext('2d').getImageData(0,0,640,360).data);
 const methods=[old.hero,old.boss,candidate.hero,candidate.boss];old.hero=old.boss=candidate.hero=candidate.boss=()=>{};
 const actor=candidate.actor;candidate.actor=old.actor; // isolate unchanged spell art from the necessarily replaced character mask
 const cases=[];
 for(const [key,age]of [[null,0],['j',.54],['k',.64],['1',1.1],['2',1.5],['3',.8],['4',2.5],['5',.4]]){
 window.inspect(key,age,'walk',2);// Entire canvas comparison includes portal, floor, skull and isolated FX layers
 const A=old.ctx.getImageData(0,0,640,360).data,B=candidate.ctx.getImageData(0,0,640,360).data;
 cases.push({key:key??'scene',age,changedChannels:compare(A,B)});
 }
 [old.hero,old.boss,candidate.hero,candidate.boss]=methods;candidate.actor=actor;
 return{backgroundChangedChannels:bg,cases,blessingMask:'Fixed to v1.0 only during isolation; candidate uses its original demo-derived character mask in gameplay.'};
 });
 fs.writeFileSync('docs/v1.1/evidence/unchanged-visual-layers.json',JSON.stringify(result,null,2));expect(result.backgroundChangedChannels).toBe(0);for(const c of result.cases)expect(c.changedChannels,c.key).toBe(0);
});
test('source/v1.0/candidate comparison and acted frame sequences for all seven abilities and king phases',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(fixture);await page.waitForFunction(()=>window.inspect);
 const samples={j:[0,.3,.46,.53,.8,1.2],k:[0,.3,.55,.61,.9,1.4],1:[0,.3,.64,.92,2,4.2],2:[0,.4,.8,1.2,2,4.7],3:[0,.25,.46,.63,1.3,2.2],4:[0,.15,.3,1.5,3,3.29],5:[0,.15,.3,.5,.75,.99]};
 await page.evaluate(()=>window.inspect(null,0,'walk',1));await page.locator('.triptych').screenshot({path:'docs/v1.1/evidence/source-v1-candidate.png'});await page.screenshot({path:'docs/v1.1/evidence/comparison-walk.png',fullPage:true});
 for(const [key,times]of Object.entries(samples)){
 const frames=[];
 for(const age of times){await page.evaluate(({key,age})=>window.inspect(key,age,'walk',1),{key,age});frames.push(await page.locator('#new').screenshot());}
 // Browser composes actual captured frames into a labeled strip; no asset substitution or illustration generation.
 await page.evaluate(async({key,times,frames})=>{let strip=document.createElement('div');strip.id='strip';strip.style.cssText='display:flex;background:#151923;width:2400px';for(let i=0;i<frames.length;i++){const box=document.createElement('div');box.innerText=`${key} · ${times[i].toFixed(2)}s`;const img=new Image();img.src='data:image/png;base64,'+frames[i];await img.decode();box.append(img);strip.append(box);}document.body.append(strip);},{key,times,frames:frames.map(b=>b.toString('base64'))});
 await page.locator('#strip').screenshot({path:`docs/v1.1/evidence/hero-${key}-sequence.png`});await page.locator('#strip').evaluate(e=>e.remove());
 }
 const states=[['wind',0],['wind',.35],['wind',.8],['recovery',0],['recovery',.7],['recovery',1.99]];const frames=[];
 for(const [state,age]of states){await page.evaluate(({state,age})=>window.inspect(null,age,state,1),{state,age});frames.push(await page.locator('#new').screenshot());}
 await page.evaluate(async({frames,states})=>{const strip=document.createElement('div');strip.id='strip';strip.style.cssText='display:flex;background:#151923;width:2400px';for(let i=0;i<frames.length;i++){const box=document.createElement('div');box.innerText=states[i].join(' · ');const img=new Image();img.src='data:image/png;base64,'+frames[i];await img.decode();box.append(img);strip.append(box);}document.body.append(strip);},{frames:frames.map(b=>b.toString('base64')),states});
 await page.locator('#strip').screenshot({path:'docs/v1.1/evidence/king-hammer-sequence.png'});expect(errors).toEqual([]);
});
