// Original Orc King pose choreography using the PixelFX act interpolator and derivative IK rig.
import {poseAt} from '../../vendor/pixelfx/src/core/act.js';
import {posed,STAND} from './orc-rig.js';
export const ORC_SCALE=2;
const ready={...STAND,weapon:'hammer',sa:-.88,fx:12,fy:-25,bx:7,by:-28,ffx:7,fbx:-7,crouch:2};
const raised={...ready,two:true,sa:-1.9,fx:0,fy:-49,ffx:9,fbx:-9,crouch:4,lean:-4,hy:-1};
const impact={...ready,two:true,sa:.63,fx:10,fy:-35,lean:6,crouch:7,ffx:11,fbx:-10,toeB:true,hy:1};
export const ORC_WINDUP=[[0,ready],[.3,{...raised,sa:-2.2}],[.75,raised],[.85,impact,'snap']];
export const ORC_RECOVERY=[[0,impact],[.2,{...impact,lean:4,crouch:6}],[1.1,{...ready,crouch:4,fx:15,fy:-22}],[2,ready]];
const walk=[[0,{...ready,ffx:10,fbx:-9}],[.25,{...ready,ffx:1,fbx:0,ffy:-7,crouch:1}],[.5,{...ready,ffx:-9,fbx:10}],[.75,{...ready,ffx:0,fbx:1,fby:-7,crouch:1}],[1,{...ready,ffx:10,fbx:-9}]];
export function orcPose(e,time){
 if(e.wind>time)return poseAt(ORC_WINDUP,.85-(e.wind-time));
 if(e.recover>time)return poseAt(ORC_RECOVERY,2-(e.recover-time));
 return poseAt(walk,time%1);
}
export function orcPixels(pose){return posed(pose);}
