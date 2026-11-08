// Original synthesized score: a quiet modal ostinato; all samples created locally.
export class Audio {
 constructor(){this.muted=false;this.failed=false;this.next=0;this.note=0;}
 async unlock(){try{this.ctx??=new (window.AudioContext||window.webkitAudioContext)();await this.ctx.resume();}catch{this.failed=true;}}
 tone(f,d=.16,type='triangle',gain=.025){if(this.muted||!this.ctx||this.ctx.state!=='running')return;try{const o=this.ctx.createOscillator(),g=this.ctx.createGain(),t=this.ctx.currentTime;o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(this.ctx.destination);o.start();o.stop(t+d);}catch{this.failed=true;}}
 effect(e){if(e.type==='cast'){this.tone({j:330,k:185,1:100,2:700,3:950,4:220,5:880}[e.key],.35,e.key==='3'?'sawtooth':'triangle',.04);if(e.key==='5')this.tone(1320,.6);}if(e.type==='hit')this.tone(75,.1,'square',.02);if(e.type==='hurt')this.tone(55,.3,'sawtooth',.03);if(e.type==='wind')this.tone(110,.6,'triangle');}
 music(time){if(time<this.next)return;this.next=time+.36;const notes=[146.83,220,293.66,349.23,293.66,220,174.61,220,130.81,196,261.63,329.63,261.63,196,164.81,196];this.tone(notes[this.note++%notes.length],.65,'sine',.025);if(this.note%4===0)this.tone(notes[(this.note-1)%notes.length]/2,1,'triangle',.025);}
}
