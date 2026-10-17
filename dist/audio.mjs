// Original procedural score and effects. No downloads or third-party audio assets.
const midi=n=>440*2**((n-69)/12);
export class GameAudio {
 constructor(){this.settings={music:.32,effects:.6,muted:false};try{const saved=JSON.parse(localStorage.getItem('emberfall-audio')||'null');if(saved){for(const k of ['music','effects'])if(Number.isFinite(saved[k]))this.settings[k]=Math.max(0,Math.min(1,saved[k]));this.settings.muted=saved.muted===true}}catch{}this.ctx=null;this.voices=0;this.nextBeat=0;this.beat=0;this.lastCue={};this.mode='ready'}
 unlock(){try{const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return false;if(!this.ctx){this.ctx=new Audio();this.master=this.ctx.createGain();this.music=this.ctx.createGain();this.effects=this.ctx.createGain();const limiter=this.ctx.createDynamicsCompressor();limiter.threshold.value=-16;limiter.ratio.value=8;this.music.connect(this.master);this.effects.connect(this.master);this.master.connect(limiter);limiter.connect(this.ctx.destination);this.nextBeat=this.ctx.currentTime+.05;this.apply()}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});return true}catch{return false}}
 apply(){if(!this.ctx)return;const t=this.ctx.currentTime;this.master.gain.setTargetAtTime(this.settings.muted?0:.65,t,.04);this.music.gain.setTargetAtTime(this.settings.music*(this.mode==='playing'?1:.4),t,.15);this.effects.gain.setTargetAtTime(this.settings.effects,t,.04)}
 set(key,value){if(key==='muted')this.settings.muted=!!value;else if(['music','effects'].includes(key))this.settings[key]=Math.max(0,Math.min(1,Number(value)||0));this.apply();try{localStorage.setItem('emberfall-audio',JSON.stringify(this.settings))}catch{}}
 note(freq,duration=.12,type='sine',volume=.08,when=null,bus='effects',end=freq){if(!this.ctx||this.voices>=48)return;const t=when??this.ctx.currentTime;const osc=this.ctx.createOscillator(),gain=this.ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(Math.max(20,freq),t);osc.frequency.exponentialRampToValueAtTime(Math.max(20,end),t+duration);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.012);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);osc.connect(gain);gain.connect(this[bus]);this.voices++;osc.onended=()=>{osc.disconnect();gain.disconnect();this.voices--};osc.start(t);osc.stop(t+duration+.02)}
 noise(duration=.1,volume=.06,frequency=1300){if(!this.ctx||this.voices>=40)return;const c=this.ctx,n=c.createBuffer(1,Math.ceil(c.sampleRate*duration),c.sampleRate),data=n.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length)**2;const src=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.7;gain.gain.value=volume;src.buffer=n;src.connect(filter);filter.connect(gain);gain.connect(this.effects);this.voices++;src.onended=()=>{src.disconnect();filter.disconnect();gain.disconnect();this.voices--};src.start();src.stop(c.currentTime+duration+.01)}
 cue(kind){if(!this.ctx||this.settings.muted||this.ctx.state!=='running')return;const t=this.ctx.currentTime,limits={bow:.12,spell:.16,slash:.15,kill:.1,hostile:.3,hurt:.3};if(t-(this.lastCue[kind]??-99)<(limits[kind]??.1))return;this.lastCue[kind]=t;
  if(kind==='bow'){this.noise(.07,.07,2300);this.note(780,.07,'triangle',.035,null,'effects',220)}
  else if(kind==='slash'){this.noise(.15,.15,1000);this.note(190,.1,'triangle',.045,null,'effects',65)}
  else if(kind==='spell'){this.note(620,.22,'sine',.06,null,'effects',180);this.noise(.12,.035,3500)}
  else if(kind==='hostile')this.note(320,.09,'triangle',.035,null,'effects',140);
  else if(kind==='hurt'){this.noise(.2,.24,420);this.note(105,.22,'sawtooth',.09,null,'effects',42)}
  else if(kind==='kill')this.note(580,.06,'triangle',.025,null,'effects',800);
  else if(kind==='boss'||kind==='roar'){this.note(65,.75,'sawtooth',.1);this.note(98,.75,'triangle',.06);this.noise(.55,.12,300)}
  else if(kind==='level'||kind==='start'){[60,64,67,72].forEach((n,i)=>this.note(midi(n),.45,'sine',.1,t+i*.09))}
  else if(kind==='active'){this.noise(.3,.11,1800);[48,55,60].forEach((n,i)=>this.note(midi(n),.35,'triangle',.08,t+i*.05))}
  else if(kind==='dead'){[52,48,45].forEach((n,i)=>this.note(midi(n),.6,'triangle',.09,t+i*.2))}
  else this.note(600,.07,'sine',.04);
 }
 update(mode,hidden=false){const changed=this.mode!==mode;this.mode=mode;if(!this.ctx)return;if(hidden){if(this.ctx.state==='running')this.ctx.suspend().catch(()=>{});return}if(changed)this.apply();if(this.ctx.state!=='running'||this.settings.muted||this.settings.music===0){this.nextBeat=this.ctx.currentTime+.05;return}const t=this.ctx.currentTime;if(this.nextBeat<t-.2)this.nextBeat=t+.05;
  // 8-bar A-minor progression, plucked melody, warm bass, and a soft pulse at 88 BPM.
  const step=60/88/2,roots=[45,41,48,43],melody=[0,7,12,7,3,10,7,3,0,7,15,12,7,3,10,7];
  while(this.nextBeat<t+.12){const b=this.beat++,root=roots[Math.floor(b/16)%4],time=this.nextBeat;if(b%8===0){for(const offset of [0,7,12])this.note(midi(root+offset),2.6,'sine',.055,time,'music')}
   if(b%4===0)this.note(midi(root-12),.6,'triangle',.09,time,'music');this.note(midi(root+12+melody[b%16]),.3,'sine',b%2?.035:.065,time,'music');if(mode==='playing'&&b%4===0)this.note(75,.13,'sine',.07,time,'music',28);this.nextBeat+=step;
  }
 }
}
