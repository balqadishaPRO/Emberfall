import {MAP,classes} from './engine.mjs?v=ember-6';
import {buildMap,paintIllustration,paintProjectile} from './illustrations.mjs?v=ember-6';
const spriteCache=new Map(),projectileCache=new Map();
function sprite(kind,color){const key=kind+color;if(!spriteCache.has(key)){const image=document.createElement('canvas');image.width=224;image.height=224;const c=image.getContext('2d');c.scale(2,2);c.translate(56,76);paintIllustration(c,kind,color);spriteCache.set(key,image)}return spriteCache.get(key)}
function projectileSprite(kind,color,enemy){const key=kind+color+enemy;if(!projectileCache.has(key)){const image=document.createElement('canvas');image.width=80;image.height=40;const c=image.getContext('2d');c.scale(2,2);c.translate(22,10);paintProjectile(c,kind,color,enemy);projectileCache.set(key,image)}return projectileCache.get(key)}
export class Renderer{
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.map=buildMap();this.camX=0;this.camY=0;this.resize()}
 resize(){const r=this.canvas.getBoundingClientRect();this.w=r.width||1200;this.h=r.height||800;this.dpr=Math.min(globalThis.devicePixelRatio||1,1.5);this.scale=Math.max(.7,Math.min(1.5,this.w/960,this.h/650));this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);this.ctx.imageSmoothingEnabled=true}
 visible(e,pad=60){return Math.abs(e.x-this.camX)<this.w/this.scale/2+pad&&Math.abs(e.y-this.camY)<this.h/this.scale/2+pad}
 image(kind,color,x,y,size=1,facing=1){const c=this.ctx,pet=['wolf','stormpet','frostpet','firepet','healerpet','slowpet','guardianpet'].includes(kind),scale=pet?size:kind==='brute'?size*1.08:size;c.save();c.translate(Math.round(x),Math.round(y));c.scale(facing*scale,scale);c.drawImage(sprite(kind,color),-56,-76,112,112);c.restore()}
 draw(g){const c=this.ctx,w=this.w/this.scale,h=this.h/this.scale,clamp=(v,a,b)=>a>b?(a+b)/2:Math.max(a,Math.min(b,v));this.camX=clamp(g.x,MAP.left+w/2,MAP.right-w/2);this.camY=clamp(g.y,MAP.top+h/2,MAP.bottom-h/2);
 c.setTransform(this.dpr,0,0,this.dpr,0,0);c.imageSmoothingEnabled=true;c.fillStyle='#102019';c.fillRect(0,0,this.w,this.h);c.save();c.scale(this.scale,this.scale);c.translate(Math.round(w/2-this.camX),Math.round(h/2-this.camY));c.drawImage(this.map,MAP.left,MAP.top);
 for(const z of g.hazards){if(!this.visible(z,z.r+10))continue;c.beginPath();c.arc(z.x,z.y,z.r,0,Math.PI*2);c.fillStyle=z.delay>0?'#faca391c':z.color+'55';c.fill();c.strokeStyle=z.delay>0?'#ffe05c':z.color;c.lineWidth=2;c.stroke();if(z.delay>0){c.fillStyle='#fff3c9';c.font='bold 11px monospace';c.textAlign='center';c.fillText('!',z.x,z.y+4)}}
 if(g.stats.orbits){c.beginPath();c.arc(g.x,g.y,g.stats.radius,0,Math.PI*2);c.strokeStyle='#d2d5af77';c.lineWidth=2;c.stroke()}
 const moth=g.pets.find(p=>p.kind==='slowpet');if(moth){c.beginPath();c.arc(g.x,g.y,145+(moth.rank-1)*25,0,Math.PI*2);c.strokeStyle='#94b6df55';c.lineWidth=1;c.stroke()}
 const entities=[...g.enemies.map(e=>({e,x:e.x,y:e.y})),...g.pets.map(p=>({p,x:p.x,y:p.y})),{hero:true,x:g.x,y:g.y}].sort((a,b)=>a.y-b.y);
 for(const item of entities){if(!this.visible(item))continue;const e=item.e;
  if(item.hero){const cl=classes.find(c=>c.id===g.classId);this.image(g.classId,g.form?({ravager:'#bf9370',broodmother:'#b4c96c',hexer:'#bb88d6',warden:'#abb29a',frostking:'#8cdef0',dragon:'#eb9562'}[g.form]):cl.color,g.x,g.y,1,g.facing);if(g.levelGuard>0||g.shield>0||g.activeTime>0&&g.classId==='tank'){c.strokeStyle=g.levelGuard>0?'#c8ffff':'#85c6e8';c.lineWidth=2;c.beginPath();c.ellipse(g.x,g.y-11,25,34,0,0,Math.PI*2);c.stroke()}}
  else if(item.p){const colors={wolf:'#b8cda1',stormpet:'#f3dc76',frostpet:'#9cd6e9',firepet:'#ce8f63',healerpet:'#88dc9d',slowpet:'#a0b4e2',guardianpet:'#f2d58b'};this.image(item.p.kind,colors[item.p.kind],item.x,item.y,.55,1)}
  else{
   const size=e.boss?1.8:e.mini?1.4:1;this.image(e.kind,e.color,e.x,e.y,size,e.x>g.x?-1:1);
   if(e.freeze>0||e.stun>0){c.strokeStyle=e.freeze>0?'#9aeaff':'#f1dc92';c.lineWidth=1;c.beginPath();c.ellipse(e.x,e.y-10*size,21*size,31*size,0,0,Math.PI*2);c.stroke()}
   if(e.telegraph>0||e.windup>0){const a=e.telegraph>0?Math.atan2(e.dy,e.dx):e.aimAngle,len=e.telegraph>0?260:Math.min(400,Math.hypot(g.x-e.x,g.y-e.y));c.beginPath();c.moveTo(e.x,e.y);c.lineTo(e.x+Math.cos(a)*len,e.y+Math.sin(a)*len);c.strokeStyle='#ff5b7c';c.lineWidth=e.telegraph>0?4:2;c.stroke()}
   if(e.contactWindup>0){c.strokeStyle='#ff7287';c.lineWidth=2;c.beginPath();c.arc(e.x,e.y,e.r+15,0,Math.PI*2);c.stroke()}
   if(e.boss||e.mini||e.hp<e.maxHP){const width=e.boss?86:e.mini?64:28,y=e.y-({bat:33,brute:47,charger:35,ravager:35,broodmother:45,spitter:35,shaman:54,hexer:54,wraith:45,warden:55,frostking:57,dragon:59}[e.kind]||43)*size-10;c.fillStyle='#0d1d16';c.fillRect(e.x-width/2-1,y-1,width+2,6);c.fillStyle=e.boss?'#ff946e':e.mini?'#d2a0ec':'#afc78a';c.fillRect(e.x-width/2,y,width*Math.max(0,e.hp/e.maxHP),4);if(e.boss||e.mini){c.font='bold 10px monospace';c.textAlign='center';c.fillStyle='#f5efd9';c.fillText(e.name,e.x,y-6)}}
  }
 }
 for(const b of g.bullets)if(this.visible(b,20))this.projectile(b,false);for(const b of g.enemyBullets)if(this.visible(b,20))this.projectile(b,true);
 c.restore();
 }
 projectile(b,enemy){const c=this.ctx,color=enemy?(b.color||'#ff5b79'):b.kind==='ice'?'#91e9ff':b.kind==='fire'?'#ffbf67':b.kind==='holy'?'#caffab':'#ead998';c.save();c.translate(Math.round(b.x),Math.round(b.y));c.rotate(Math.atan2(b.vy,b.vx));c.drawImage(projectileSprite(b.kind,color,enemy),-22,-10,40,20);c.restore()}
}
