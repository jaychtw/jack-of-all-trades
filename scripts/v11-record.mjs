// Local-only controlled character animation recording. No production mutation hook is added.
// Use installed Chromium and ffmpeg; Playwright's expected ffmpeg executable can be linked
// to the installed free system binary under a task-local PLAYWRIGHT_BROWSERS_PATH.
import {chromium} from '@playwright/test';import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1280,height:720},recordVideo:{dir:'/tmp/jack-v11-recording',size:{width:1280,height:720}}});
try{const page=await context.newPage();await page.addInitScript(()=>{Element.prototype.requestFullscreen=()=>Promise.reject(Error('inspection viewport stays fixed'));});await page.goto('http://127.0.0.1:5173/jack-of-all-trades/');await page.locator('#start').click();
// Arrange actors through the pre-existing development-only inspector; game simulation,
// input serialization, action timing and drawing then run normally.
await page.evaluate(()=>{const g=window.__game.g;g.nextSpawn=1e8;g.spawn('boss',575)});
for(const key of ['j','k','1','2','3','4','5']){await page.keyboard.press(key);await page.waitForFunction(()=>!window.__game.g.action,{},{timeout:7000});await page.waitForTimeout(120);}
await page.evaluate(()=>{const g=window.__game.g;g.enemies=[];g.spawn('boss',g.x+35)});await page.waitForTimeout(3800);await page.screenshot({path:'docs/v1.1/evidence/recording-end.png'});
await context.close();await fs.copyFile(await page.video().path(),'docs/v1.1/evidence/character-acting.webm');console.log('Recorded real browser action playback and a king windup/impact/recovery cycle.');
}finally{await context.close().catch(()=>{});await browser.close();}
