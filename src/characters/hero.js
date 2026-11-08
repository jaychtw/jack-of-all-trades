// PixelFX 0.3.0, a84159688af3ca37a4be05a0d422b94451b2e24e.
// Actual unmodified demonstration rig and act sampler, not a redrawn approximation.
import {posed, STAND} from '../../vendor/pixelfx/src/core/rig.js';
import {poseAt} from '../../vendor/pixelfx/src/core/act.js';
import {READY} from '../../vendor/pixelfx/src/core/poses.js';
import * as thrust from '../../vendor/pixelfx/src/fx/melee/thrust.js';
import * as slash from '../../vendor/pixelfx/src/fx/melee/sword-slash.js';
import * as fire from '../../vendor/pixelfx/src/fx/fire/fire-ring.js';
import * as ice from '../../vendor/pixelfx/src/fx/moves/ice-lance-throw.js';
import * as lightning from '../../vendor/pixelfx/src/fx/lightning/chain-lightning.js';
import * as beam from '../../vendor/pixelfx/src/fx/arcane/arcane-beam.js';
import * as blessing from '../../vendor/pixelfx/src/fx/holy/resurrection.js';
export const HERO_SCALE=1.5; // uniform display scale only; native construction, palette and proportions are unchanged
export const HERO_ACTS={j:thrust,k:slash,1:fire,2:ice,3:lightning,4:beam,5:blessing};
const idle={...READY,weapon:'sword',sa:-.9};
// Locomotion uses the same foot/hand targets and 12-fps act interpolation, solving all joints via PixelFX IK.
const walk=[
 [0,{...idle,ffx:9,fbx:-8,ffy:-4,fby:-4,fx:8,bx:6}],
 [.2,{...idle,ffx:1,fbx:0,ffy:-7,fby:-4,crouch:2,fx:11,bx:3}],
 [.4,{...idle,ffx:-8,fbx:9,ffy:-4,fby:-4,fx:12,bx:2}],
 [.6,{...idle,ffx:0,fbx:1,ffy:-4,fby:-7,crouch:2,fx:10,bx:5}],
 [.8,{...idle,ffx:9,fbx:-8,ffy:-4,fby:-4,fx:8,bx:6}]
];
export function heroPose(g,move=0){
 const a=g.action;
 if(!a)return move?poseAt(walk,(g.time*(move<0?-1:1)% .8+.8)%.8):{...idle,crouch:3+(Math.floor(g.time*3)%2)};
 const mod=HERO_ACTS[a.key],from=mod.act.poses[0][0];let time;
 if(a.key==='5')time=a.age*4.8;
 else if(a.key==='4')time=a.age<.3?from*(1-a.age/.3):(a.age-.3)%mod.meta.duration;
 else time=a.age+from;
 return poseAt(mod.act.poses,time);
}
export function heroPixels(pose){return posed(pose);}
export {STAND};
