import {sceneIndex,scenes,getSceneMap,warmNextScene,drawAmbience} from './worlds.mjs?v=ember-16';
import {drawStatus,drawMotion,drawRoots,drawFlameMantle,drawSpiritBlade,drawQuake,drawMeteor,drawField,drawSwing,drawPixelRing,pixelBeam,drawPixelShot,drawPixels} from './pixel-effects.mjs?v=ember-16';
import {MAP,classes,monsters,meleeClasses,primaryRange,primaryInterval,totalShield} from './engine.mjs?v=ember-16';
import {paintPixelActor,ANIMATION} from './pixel-art.mjs?v=ember-16';
const spriteCache=new Map();
const PET_COLORS={wolf:'#b8cda1',stormpet:'#f3dc76',frostpet:'#9cd6e9',firepet:'#ce8f63',healerpet:'#88dc9d',slowpet:'#a0b4e2',guardianpet:'#f2d58b'};
const FORM_COLORS={ravager:'#bf9370',broodmother:'#b4c96c',hexer:'#bb88d6',warden:'#abb29a',frostking:'#8cdef0',dragon:'#eb9562'};
const FROST=new Set(['#96efff','#91e9ff','#54ecff','#38e4ff','#79eaff','#91d7f4']),HOLY=new Set(['#caffab','#bdf5a7','#3dff8b','#b8ffff']),FIRE=new Set(['#ffab67','#ffc17b','#ffbc72','#f2a079','#ff784b','#ed9870']);
const school=e=>e.kind==='death'||e.kind==='hurt'?'death':FROST.has(e.color)?'frost':HOLY.has(e.color)?'holy':FIRE.has(e.color)?'ember':'spark';
const HERO_HEADS={archer:58,fighter:60,assassin:48,mage:65,tank:53,healer:59,shapeshifter:62};
const HEIGHTS={bat:33,brute:47,charger:35,ravager:35,broodmother:45,spitter:35,shaman:54,hexer:54,wraith:45,warden:55,frostking:57,dragon:59};
function sprite(kind,color){const key=kind+color;if(!spriteCache.has(key)){
 const wide=['dragon','firepet','broodmother','frostking','shapeshifter','assassin'].includes(kind),x=kind==='fighter'?-72:wide?-56:-48,y=-68,w=kind==='fighter'?144:wide?112:96,h=96,ratio=1,fw=Math.ceil(w*ratio),fh=h*ratio,image=document.createElement('canvas');const frames=ANIMATION.frames;image.width=fw*frames;image.height=fh*2;const c=image.getContext('2d');
 for(let dir=0;dir<2;dir++)for(let frame=0;frame<frames;frame++){c.save();c.translate(frame*fw,dir*fh);c.scale(ratio,ratio);c.translate(-x,-y);if(dir)c.scale(-1,1);paintPixelActor(c,kind,color,frame);c.restore()}
 let flash=null;if(classes.some(cl=>cl.id===kind)){flash=document.createElement('canvas');flash.width=image.width;flash.height=image.height;const f=flash.getContext('2d');f.drawImage(image,0,0);f.globalCompositeOperation='source-in';f.fillStyle='#ff303c';f.fillRect(0,0,flash.width,flash.height)}if(spriteCache.size>=40)spriteCache.delete(spriteCache.keys().next().value);spriteCache.set(key,{image,flash,x,y,w,h,fw,fh});}return spriteCache.get(key)}
export class Renderer{
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});this.background=typeof document.querySelector==='function'?document.querySelector('#terrain'):null;this.backgroundCtx=this.background?.getContext('2d',{alpha:false});this.backgroundDirty=true;this.scene=0;this.layoutKey='default';this.previousMap=null;this.transition=1;this.map=getSceneMap(0);warmNextScene(0);this.camX=0;this.camY=0;this.busy=false;this.coolFrames=0;this.frameCost=0;this.targetFPS=60;this.drawList=[];this.reducedMotion=typeof window!=='undefined'&&!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;try{const motion=globalThis.localStorage?.getItem('emberfall-motion');if(motion==='full'||motion==='reduced')this.reducedMotion=motion==='reduced'}catch{}this.resize();this.prepare()}
 resize(){const r=this.canvas.getBoundingClientRect();this.w=r.width||1200;this.h=r.height||800;this.dpr=Math.min(globalThis.devicePixelRatio||1,this.busy?1:1.5,Math.sqrt(1800000/(this.w*this.h)));this.scale=Math.max(.7,Math.min(1.5,this.w/960,this.h/650));this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);this.ctx.imageSmoothingEnabled=false;if(this.background){this.background.width=this.canvas.width;this.background.height=this.canvas.height;this.backgroundDirty=true}}
 visible(e,pad=60){return Math.abs(e.x-this.camX)<this.w/this.scale/2+pad&&Math.abs(e.y-this.camY)<this.h/this.scale/2+pad}
 prepare(){if(typeof window==='undefined'||!window.requestIdleCallback)return;const queue=[...classes.map(c=>[c.id,c.color]),...Object.entries(monsters).map(([kind,m])=>[kind,m.color]),...Object.entries(PET_COLORS)];const build=()=>{const next=queue.shift();if(next)sprite(...next);if(queue.length)window.requestIdleCallback(build,{timeout:250})};window.requestIdleCallback(build,{timeout:100})}
 image(kind,color,x,y,size=1,facing=1,frame=0,flash=0){const c=this.ctx,scale=kind==='brute'?size*1.08:size,a=sprite(kind,color);c.drawImage(a.image,frame*a.fw,facing<0?a.fh:0,a.fw,a.fh,Math.round(x)+a.x*scale,Math.round(y)+a.y*scale,a.w*scale,a.h*scale);if(flash>0&&a.flash){c.globalAlpha=Math.min(.85,flash/.12);c.drawImage(a.flash,frame*a.fw,facing<0?a.fh:0,a.fw,a.fh,Math.round(x)+a.x*scale,Math.round(y)+a.y*scale,a.w*scale,a.h*scale);c.globalAlpha=1}}
 pose(g,entity,flying=false){
  if(entity.freeze>0||entity.stun>0)return ANIMATION.idle;
  if(this.reducedMotion)return entity.attackAnim>0?ANIMATION.attack+4:ANIMATION.idle;
  const phase=(entity.id||0)*.37;
  if(entity.hitFlash>0||entity.hit>0)return ANIMATION.hurt+Math.min(5,Math.floor((1-Math.min(1,(entity.hitFlash||entity.hit)/.24))*6));
  if(entity.telegraph>0||entity.windup>0)return ANIMATION.cast+Math.floor(g.time*12+phase)%6;
  if(entity.activeTime>0&&['mage','healer','tank','shapeshifter'].includes(entity.classId))return ANIMATION.cast+Math.floor(g.time*14)%6;
  if(entity.attackAnim>0){const duration=entity===g?Math.min(.25,primaryInterval(g)):PET_COLORS[entity.kind]?.22:.45,elapsed=(entity===g?.25:PET_COLORS[entity.kind]?.22:.45)-entity.attackAnim;return ANIMATION.attack+Math.min(7,Math.max(0,Math.floor(elapsed/duration*8)))}
  if(entity.moving||flying)return ANIMATION.walk+Math.floor((flying?g.time*12:entity.walk||g.time*10)+phase)%8;
  return ANIMATION.idle+Math.floor(g.time*3+phase)%4;
 }
 draw(g){const started=performance.now(),nextScene=sceneIndex(g.time),layout=g.layoutKey||'default';if(layout!==this.layoutKey||this.run!==g){this.run=g;this.layoutKey=layout;this.scene=nextScene;this.previousMap=null;this.transition=1;this.map=getSceneMap(nextScene,g.obstacles,layout);this.backgroundDirty=true;warmNextScene(nextScene,g.obstacles,layout)}else if(nextScene!==this.scene){this.previousMap=this.map;this.previousScene=this.scene;this.transitionStart=g.time;this.scene=nextScene;this.map=getSceneMap(nextScene,g.obstacles,layout);this.backgroundDirty=true;warmNextScene(nextScene,g.obstacles,layout)}if(this.previousMap){this.transition=Math.min(1,Math.max(0,(g.time-this.transitionStart)/(this.reducedMotion?.35:.9)));if(this.transition>=1){this.previousMap=null;this.backgroundDirty=true}}const heavy=g.enemies.length>64||g.bullets.length+g.enemyBullets.length>180;if(heavy&&!this.busy){this.busy=true;this.coolFrames=0;this.resize()}else if(this.busy&&!heavy&&++this.coolFrames>120){this.busy=false;this.coolFrames=0;this.resize()}else if(heavy)this.coolFrames=0;const c=this.ctx,w=this.w/this.scale,h=this.h/this.scale,clamp=(v,a,b)=>a>b?(a+b)/2:Math.max(a,Math.min(b,v));this.camX=clamp(g.x,MAP.left+w/2,MAP.right-w/2);this.camY=clamp(g.y,MAP.top+h/2,MAP.bottom-h/2);
 const tx=Math.round(w/2-this.camX),ty=Math.round(h/2-this.camY);c.setTransform(this.dpr,0,0,this.dpr,0,0);c.imageSmoothingEnabled=false;
 if(this.backgroundCtx){if(this.backgroundDirty||this.previousMap||tx!==this.backgroundX||ty!==this.backgroundY){const bg=this.backgroundCtx;bg.setTransform(this.dpr,0,0,this.dpr,0,0);this.paintBackdrop(bg,tx,ty);this.backgroundX=tx;this.backgroundY=ty;this.backgroundDirty=false}c.clearRect(0,0,this.w,this.h)}else this.paintBackdrop(c,tx,ty);
 c.save();c.scale(this.scale,this.scale);c.translate(tx,ty);
 if(this.previousMap)drawAmbience(c,this.previousScene,g.time,this.reducedMotion,g.obstacles,1-this.transition);drawAmbience(c,this.scene,g.time,this.reducedMotion,g.obstacles,this.previousMap?this.transition:1);
 for(const z of g.hazards){if(!this.visible(z,z.r+10))continue;drawPixelRing(c,z.x,z.y,z.r,z.r,z.delay>0?'#ffe05c':z.color,true);if(z.delay>0){c.fillStyle='#fff3c9';c.fillRect(Math.round(z.x)-1,Math.round(z.y)-7,3,8);c.fillRect(Math.round(z.x)-1,Math.round(z.y)+4,3,3)}}
 if(meleeClasses.has(g.classId)&&g.status!=='ready'){const radius=primaryRange(g);c.globalAlpha=.4;drawPixelRing(c,g.x,g.y,radius,radius,'#d5e6b9');c.globalAlpha=1}

 // Persistent ability silhouettes remain visible even when the burst pool is busy.
 if(g.stats.fireaura){c.globalAlpha=.9;drawFlameMantle(c,g.x,g.y,105,g.time,this.reducedMotion);c.globalAlpha=.5;drawPixelRing(c,g.x,g.y,105,105,'#ffad63');c.globalAlpha=1}
 if(g.stats.orbits){c.globalAlpha=.45;drawPixelRing(c,g.x,g.y,g.stats.radius,g.stats.radius,'#b9dcb4');c.globalAlpha=1;for(let i=0;i<g.stats.orbits;i++){const a=g.time*2.5+i*Math.PI*2/g.stats.orbits,x=g.x+Math.cos(a)*g.stats.radius,y=g.y+Math.sin(a)*g.stats.radius;drawSpiritBlade(c,x,y,this.reducedMotion?0:a+Math.PI/2)}}

 const moth=g.pets.find(p=>p.kind==='slowpet');if(moth){c.globalAlpha=.35;drawPixelRing(c,g.x,g.y,145+(moth.rank-1)*25,145+(moth.rank-1)*25,'#94b6df');c.globalAlpha=1}
 const entities=this.drawList;entities.length=0;for(const e of g.enemies)if(this.visible(e))entities.push(e);for(const p of g.pets)if(this.visible(p))entities.push(p);entities.push(g);entities.sort((a,b)=>a.y-b.y);
 for(const item of entities){const hero=item===g,companion=!hero&&!('hp' in item),e=!hero&&!companion?item:null;
  drawMotion(c,g,item,companion?item.kind!=='wolf':!!e&&['bat','wraith','frostking','dragon'].includes(e.kind),this.reducedMotion);
  if(hero){const cl=classes.find(c=>c.id===g.classId);this.image(g.classId,g.form?FORM_COLORS[g.form]:cl.color,g.x,g.y,1,g.facing,this.pose(g,g),g.hitFlash);if(g.levelGuard>0||totalShield(g)>0||g.activeTime>0&&g.classId==='tank'){drawPixelRing(c,g.x,g.y-11,25,34,g.levelGuard>0?'#c8ffff':g.shieldFlash>0?'#ecffff':'#71c8f5')}}
  else if(companion){const target=item.targetId?g.enemies.find(e=>e.id===item.targetId):null;this.image(item.kind,PET_COLORS[item.kind],item.x,item.y,.68,target?(target.x<item.x?-1:1):(item.facing||1),this.pose(g,item,item.kind!=='wolf'))}
  else{
   const size=e.boss?1.8:e.mini?1.4:1;this.image(e.kind,e.color,e.x,e.y,size,e.x>g.x?-1:1,this.pose(g,e,['bat','wraith','frostking','dragon'].includes(e.kind)));
   drawStatus(c,g,e,this.reducedMotion);
   if(e.rooted>0){drawRoots(c,e.x,e.y,28,Math.min(1,((e.rootMax||1)-e.rooted)*3),this.reducedMotion)}
   if(e.freeze>0||e.stun>0){drawPixelRing(c,e.x,e.y-10*size,21*size,31*size,e.freeze>0?'#9aeaff':'#f1dc92')}
   if(e.telegraph>0||e.windup>0){const a=e.telegraph>0?Math.atan2(e.dy,e.dx):e.aimAngle,len=e.telegraph>0?260:Math.min(400,Math.hypot(g.x-e.x,g.y-e.y));pixelBeam(c,e.x,e.y,e.x+Math.cos(a)*len,e.y+Math.sin(a)*len,'#ff5b7c',4)}
   if(e.contactWindup>0){drawPixelRing(c,e.x,e.y,e.r+15,e.r+15,'#ff7287')}
   if(e.boss||e.mini||e.hp<e.maxHP){const width=e.boss?86:e.mini?64:28,y=e.y-(HEIGHTS[e.kind]||43)*size-10;c.fillStyle='#0d1d16';c.fillRect(e.x-width/2-1,y-1,width+2,6);c.fillStyle=e.boss?'#ff946e':e.mini?'#d2a0ec':'#afc78a';c.fillRect(e.x-width/2,y,width*Math.max(0,e.hp/e.maxHP),4);if(e.boss||e.mini){c.font='11px Ember Pixel,monospace';c.textAlign='center';c.fillStyle='#f5efd9';c.fillText(e.name,e.x,y-6)}}
  }
 }
 for(const b of g.bullets)if(this.visible(b,20))this.projectile(b,false,g);for(const b of g.enemyBullets)if(this.visible(b,20))this.projectile(b,true,g);
 for(const m of g.meteors||[])if(this.visible(m,m.r+360))drawMeteor(c,m,this.reducedMotion);
 this.meleeFX(g);this.effects(g);if(g.status!=='ready'&&g.status!=='dead'){this.vitalBar(g);this.attackBar(g)}c.restore();this.frameCost=this.frameCost*.9+(performance.now()-started)*.1;this.targetFPS=this.frameCost>8?30:60;
 }
 paintBackdrop(c,tx,ty){c.imageSmoothingEnabled=false;c.fillStyle=scenes[this.previousMap?this.previousScene:this.scene].ground;c.fillRect(0,0,this.w,this.h);if(this.previousMap){c.globalAlpha=this.transition;c.fillStyle=scenes[this.scene].ground;c.fillRect(0,0,this.w,this.h);c.globalAlpha=1}c.save();c.scale(this.scale,this.scale);c.translate(tx,ty);if(this.previousMap)c.drawImage(this.previousMap,MAP.left,MAP.top);c.globalAlpha=this.previousMap?this.transition:1;c.drawImage(this.map,MAP.left,MAP.top);c.globalAlpha=1;c.restore()}
 meleeFX(g){if(!meleeClasses.has(g.classId))return;const c=this.ctx;c.imageSmoothingEnabled=false;if(g.classId==='fighter'&&g.activeTime>0){const radius=140+g.stats.tempest*15,phase=this.reducedMotion?.6:g.time*4%1,angle=this.reducedMotion?0:g.time*8;drawSwing(c,g.x,g.y,radius,angle,phase);drawSwing(c,g.x,g.y,radius*.88,angle+Math.PI,phase)}else if(g.attackAnim>0){drawSwing(c,g.x,g.y,primaryRange(g),g.aimAngle,this.reducedMotion?.6:1-Math.min(1,g.attackAnim/.25),g.classId==='shapeshifter')}c.imageSmoothingEnabled=false}
 portrait(canvas,id,frame=0){const cl=classes.find(c=>c.id===id),a=sprite(id,cl.color),c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,160,132);c.drawImage(a.image,Math.max(0,Math.min(31,frame))*a.fw,0,a.fw,a.fh,80+a.x*1.5,100+a.y*1.5,a.w*1.5,a.h*1.5)}
 vitalBar(g){const c=this.ctx,x=Math.round(g.x)-20,y=Math.round(g.y)-HERO_HEADS[g.classId]-21,shield=totalShield(g);c.fillStyle='#0c1b21';c.fillRect(x-1,y-1,42,9);c.fillStyle='#61382f';c.fillRect(x,y,40,7);c.fillStyle='#f28b76';c.fillRect(x,y,40*Math.max(0,g.health/g.stats.maxHealth),7);if(shield>0){c.fillStyle=g.shieldFlash>0?'#d9faff':'#66bfff';c.fillRect(x,y,40*Math.min(1,shield/g.stats.maxHealth),3)}}
 attackBar(g){const c=this.ctx,ready=g.attack<=0,progress=Math.max(0,Math.min(1,1-g.attack/primaryInterval(g))),x=Math.round(g.x)-16,y=Math.round(g.y)-HERO_HEADS[g.classId]-9;c.fillStyle='#091714e6';c.fillRect(x-1,y-1,34,6);c.fillStyle='#43544a';c.fillRect(x,y,32,4);c.fillStyle=ready?'#d0ef99':'#e3bf7e';c.fillRect(x,y,32*progress,4);c.fillStyle='#f8f3cf';if(progress>0)c.fillRect(x+Math.max(0,32*progress-1),y,1,4)}
 effects(g){const c=this.ctx;c.imageSmoothingEnabled=false;for(const e of g.effects){if(!this.visible(e,e.r+30)&&!(e.kind==='bolt'&&Math.abs(e.x2-this.camX)<this.w/this.scale/2+30&&Math.abs(e.y2-this.camY)<this.h/this.scale/2+30))continue;const age=1-e.life/e.max,p=this.reducedMotion?1:age,r=e.r*(.4+.6*p),style=school(e);c.globalAlpha=Math.min(1,e.life/.08);
  if(['spark','muzzle','death','hurt'].includes(e.kind)){if(e.kind==='death'&&e.actorKind){c.globalAlpha=1-age;this.image(e.actorKind,e.actorColor,e.x,e.y+8+Math.round(age*8),e.actorScale*(1-age*.15),1,ANIMATION.hurt+Math.min(5,Math.floor(age*6)));c.globalAlpha=1-age*.5}drawPixels(c,style,e.color,e.x,e.y,e.kind==='muzzle'?12:e.r,age,this.reducedMotion);continue}
  if(e.kind==='critical'){drawPixels(c,'holy','#ffdfa0',e.x,e.y,24,age,this.reducedMotion);pixelBeam(c,e.x-9,e.y+8,e.x+9,e.y-8,'#fff0bd',1)}
  else if(e.kind==='evade'){drawField(c,'arcane','#b8b3db',e.x,e.y,e.r,age,this.reducedMotion)}
  else if(e.kind==='roots'){drawRoots(c,e.x,e.y,e.r,age,this.reducedMotion)}
  else if(e.kind==='sacrifice'){c.globalAlpha=1-age;this.image('guardianpet','#fff1a3',e.x,e.y-(this.reducedMotion?0:age*85),.85,1,ANIMATION.cast+3);c.globalAlpha=1;pixelBeam(c,e.x,e.y-15,e.x2,e.y2-20,'#fff1a3',5);drawField(c,'holy','#fff1a3',e.x2,e.y2,90,age,this.reducedMotion);drawPixelRing(c,e.x2,e.y2-15,30+age*15,40+age*15,'#9bdfff')}
  else if(e.kind==='shield-hit'){drawPixelRing(c,e.x,e.y,32,42,'#d9faff');drawPixels(c,'holy','#86d6ff',e.x,e.y,30,age,this.reducedMotion)}
  else if(e.kind==='rapidfire'){drawField(c,'electric','#ffe269',e.x,e.y,48,age,this.reducedMotion)}
  else if(e.kind==='cleaver'){const phase=this.reducedMotion?.6:age,angle=e.x2+phase*Math.PI*2;drawSwing(c,e.x,e.y,e.r,angle,phase);if(!this.reducedMotion)drawSwing(c,e.x,e.y,e.r,angle+Math.PI,phase);drawSpiritBlade(c,e.x+Math.cos(angle)*e.r*.8,e.y+Math.sin(angle)*e.r*.8,angle+Math.PI/2,1.45)}
  else if(e.kind==='quake'){drawQuake(c,e.x,e.y,e.r,age,this.reducedMotion)}
  else if(e.kind==='meteor-impact'){drawField(c,'fire',e.color,e.x,e.y,e.r,age,this.reducedMotion);drawQuake(c,e.x,e.y,e.r*.8,age,this.reducedMotion)}
  else if(e.kind==='orbit-hit'){pixelBeam(c,e.x-10,e.y-10,e.x2+10,e.y2+10,'#f1ffe1',3);drawPixels(c,'spark',e.color,e.x2,e.y2,e.r,age,this.reducedMotion)}
  else if(e.kind==='bolt'){const dx=e.x2-e.x,dy=e.y2-e.y,a=e.x+dx*.3-dy*.06,b=e.y+dy*.3+dx*.06,d=e.x+dx*.62+dy*.04,f=e.y+dy*.62-dx*.04;pixelBeam(c,e.x,e.y,a,b,e.color,4);pixelBeam(c,a,b,d,f,e.color,4);pixelBeam(c,d,f,e.x2,e.y2,e.color,4);drawField(c,'electric',e.color,e.x2,e.y2,28,age,this.reducedMotion)}
  else if(e.kind==='dash'){pixelBeam(c,e.x,e.y-12,e.x2,e.y2-12,e.color,4);pixelBeam(c,e.x,e.y+5,e.x2,e.y2+5,'#d7b0eb',2)}
  else{const kind=['electric','fire','frost','nature','earth','holy','arcane','cyclone'].includes(e.kind)?e.kind:e.kind==='cast'?({mage:'frost',healer:'holy',tank:'earth',shapeshifter:'arcane',fighter:'cyclone'}[g.classId]||'earth'):style==='ember'?'fire':style==='spark'?'earth':style;drawField(c,kind==='cyclone'?'earth':kind,e.color,e.x,e.y,e.r,age,this.reducedMotion);c.globalAlpha*=.22;drawPixelRing(c,e.x,e.y,r,r,e.color);c.globalAlpha=1}

 }c.globalAlpha=1;c.imageSmoothingEnabled=false}
 projectile(b,enemy,g){const color=b.color||(enemy?'#ff5b79':b.kind==='ice'?'#91e9ff':b.kind==='fire'?'#ffbf67':b.kind==='holy'?'#caffab':'#ead998');drawPixelShot(this.ctx,b,color,enemy,g.time,this.reducedMotion)}
}
