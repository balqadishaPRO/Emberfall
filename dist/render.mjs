import {MAP,classes} from './engine.mjs?v=ember-5';
const W=MAP.right-MAP.left,H=MAP.bottom-MAP.top;
const sprites=new Map();
const palette={skin:'#e8c298',dark:'#18221f',bone:'#d7d6b4',metal:'#a6bec3',wood:'#8f623c'};
function sprite(kind,color){
 const key=kind+color;if(sprites.has(key))return sprites.get(key);
 const image=document.createElement('canvas');image.width=32;image.height=36;const c=image.getContext('2d');
 const box=(x,y,w,h,fill)=>{c.fillStyle=fill;c.fillRect(x,y,w,h)},eye=(x,y)=>box(x,y,2,2,'#fff2bc');
 if(['wolf','charger','ravager'].includes(kind)){
  box(4,18,20,10,palette.dark);box(5,17,18,9,kind==='wolf'?'#c0ccbf':'#a58965');box(20,13,9,11,color);box(26,19,6,4,color);box(21,9,3,5,color);box(4,25,4,7,palette.dark);box(18,25,4,7,palette.dark);box(1,15,5,4,color);eye(25,16);if(kind!=='wolf'){box(19,8,4,3,'#eee1b1');box(18,11,3,5,'#eee1b1')}
 }else if(['bat','frostpet','firepet','dragon','broodmother'].includes(kind)){
  const body=kind==='frostpet'?'#d8f1f2':color;box(11,13,10,15,palette.dark);box(12,12,8,15,body);box(4,13,8,5,color);box(1,10,5,5,color);box(20,13,8,5,color);box(27,10,5,5,color);box(5,18,5,3,color);box(23,18,5,3,color);box(10,7,12,9,body);eye(12,10);eye(18,10);box(15,14,3,3,'#f2c76d');if(kind==='broodmother')for(let i=0;i<4;i++){box(2,18+i*3,10,2,color);box(21,18+i*3,10,2,color)}if(['firepet','dragon'].includes(kind)){box(14,27,5,6,color);box(18,30,7,3,color);box(10,4,3,5,'#eac892')}
 }else if(['stormpet','healerpet','slowpet','guardianpet'].includes(kind)){
  box(11,10,10,16,palette.dark);box(12,9,8,16,color);box(8,15,4,8,color);box(20,15,4,8,color);eye(13,13);eye(18,13);if(kind==='healerpet'){box(14,18,4,9,'#fffbe2');box(12,21,8,3,'#fffbe2')}if(kind==='slowpet'){box(6,9,5,16,color);box(21,9,5,16,color);box(13,18,6,2,'#272548')}if(kind==='guardianpet'){box(10,4,12,2,'#ffe78e');box(9,25,14,3,'#ffe78e')}
 }else{
  const hero=classes.some(cl=>cl.id===kind),skeleton=['walker','ranger'].includes(kind),bulky=['brute','warden','tank'].includes(kind),ghost=['wraith','frostking'].includes(kind);
  box(9,12,14,16,palette.dark);box(10,13,12,14,color);if(bulky){box(5,13,22,7,color);box(7,20,18,9,color);box(10,15,12,10,'#a5b8b1')}
  box(10,27,5,7,palette.dark);box(18,27,5,7,palette.dark);box(9,32,6,2,'#7f7857');box(18,32,7,2,'#7f7857');box(8,4,16,12,palette.dark);box(10,5,12,10,skeleton?palette.bone:hero?palette.skin:color);box(11,9,3,2,palette.dark);box(18,9,3,2,palette.dark);
  if(['mage','shaman','hexer','healer','assassin','shapeshifter'].includes(kind)){box(8,2,16,5,color);box(6,5,4,11,color);box(22,5,3,11,color);box(11,0,10,3,color)}
  if(ghost){box(6,14,20,14,color);box(4,27,7,4,color);box(13,27,7,6,color);box(23,27,6,3,color)}
  if(['fighter','assassin','shapeshifter','walker','brute','warden'].includes(kind)){box(25,12,3,17,palette.metal);box(23,24,7,3,'#d2a45b');if(kind==='assassin')box(4,15,3,12,palette.metal)}
  if(['archer','ranger'].includes(kind)){box(26,8,2,21,palette.wood);box(28,11,2,15,palette.wood);box(23,9,1,19,'#e1d4a9')}
  if(['mage','shaman','hexer','healer'].includes(kind)){box(27,6,2,27,palette.wood);box(24,4,8,6,kind==='healer'?'#d4ffe0':'#91e7ff');box(26,2,4,10,kind==='healer'?'#d4ffe0':'#91e7ff')}
  if(kind==='tank'){box(1,13,10,17,'#223645');box(2,14,8,13,'#7fb6d2');box(5,15,2,11,'#e7eac8')}
  if(skeleton){box(12,17,8,2,palette.bone);box(12,21,8,2,palette.bone);box(15,15,2,10,palette.bone)}
 }
 sprites.set(key,image);return image;
}
function mapImage(){const image=document.createElement('canvas');image.width=W;image.height=H;const c=image.getContext('2d');c.fillStyle='#253a2b';c.fillRect(0,0,W,H);
 for(let y=0;y<H;y+=32)for(let x=0;x<W;x+=32){const n=((x*17+y*31)>>>3)%19;c.fillStyle=n<5?'#2c4230':'#273c2c';c.fillRect(x,y,32,32);if(n<4){c.fillStyle='#48603c';c.fillRect(x+8,y+18,2,5);c.fillRect(x+12,y+15,2,6)}}
 c.fillStyle='#8b856337';c.fillRect(0,H/2-24,W,48);c.fillRect(W/2-24,0,48,H);
 c.fillStyle='#7b8860';for(let i=0;i<4;i++){c.fillRect(W/2-54,H/2-60+i*36,7,10);c.fillRect(W/2+50,H/2-60+i*36,7,10)}
 for(const o of MAP.obstacles){const x=o.x-MAP.left,y=o.y-MAP.top;c.fillStyle='#182a21';c.fillRect(x-o.r,y-o.r*.7,o.r*2,o.r*1.5);c.fillStyle='#53604d';c.fillRect(x-o.r+4,y-o.r*.7,o.r*1.6,o.r);c.fillStyle='#758065';c.fillRect(x-o.r+8,y-o.r*.7+4,o.r*.7,9);c.fillStyle='#374d39';c.fillRect(x+4,y-3,o.r*.8,o.r*.7)}
 for(let x=0;x<W;x+=24){c.fillStyle='#162c24';c.fillRect(x,0,22,17);c.fillRect(x,H-17,22,17);c.fillStyle='#65715b';c.fillRect(x+2,2,18,7);c.fillRect(x+2,H-15,18,6)}
 for(let y=0;y<H;y+=24){c.fillStyle='#162c24';c.fillRect(0,y,17,22);c.fillRect(W-17,y,17,22);c.fillStyle='#65715b';c.fillRect(2,y+2,7,18);c.fillRect(W-15,y+2,6,18)}return image;
}
export class Renderer{
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.map=mapImage();this.camX=0;this.camY=0;this.resize()}
 resize(){const r=this.canvas.getBoundingClientRect();this.w=r.width||1200;this.h=r.height||800;this.dpr=Math.min(globalThis.devicePixelRatio||1,1.5);this.scale=Math.max(.7,Math.min(1.5,this.w/960,this.h/650));this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);this.ctx.imageSmoothingEnabled=false}
 visible(e,pad=60){return Math.abs(e.x-this.camX)<this.w/this.scale/2+pad&&Math.abs(e.y-this.camY)<this.h/this.scale/2+pad}
 image(kind,color,x,y,size=1,facing=1){const c=this.ctx;c.save();c.translate(Math.round(x),Math.round(y));c.scale(facing,size);c.drawImage(sprite(kind,color),-16*size,-28,32*size,36);c.restore()}
 draw(g){const c=this.ctx,w=this.w/this.scale,h=this.h/this.scale,clamp=(v,a,b)=>a>b?(a+b)/2:Math.max(a,Math.min(b,v));this.camX=clamp(g.x,MAP.left+w/2,MAP.right-w/2);this.camY=clamp(g.y,MAP.top+h/2,MAP.bottom-h/2);
 c.setTransform(this.dpr,0,0,this.dpr,0,0);c.imageSmoothingEnabled=false;c.fillStyle='#102019';c.fillRect(0,0,this.w,this.h);c.save();c.scale(this.scale,this.scale);c.translate(Math.round(w/2-this.camX),Math.round(h/2-this.camY));c.drawImage(this.map,MAP.left,MAP.top);
 for(const z of g.hazards){if(!this.visible(z,z.r+10))continue;c.beginPath();c.arc(z.x,z.y,z.r,0,Math.PI*2);c.fillStyle=z.delay>0?'#faca391c':z.color+'55';c.fill();c.strokeStyle=z.delay>0?'#ffe05c':z.color;c.lineWidth=2;c.stroke();if(z.delay>0){c.fillStyle='#fff3c9';c.font='bold 11px monospace';c.textAlign='center';c.fillText('!',z.x,z.y+4)}}
 if(g.stats.orbits){c.beginPath();c.arc(g.x,g.y,g.stats.radius,0,Math.PI*2);c.strokeStyle='#d2d5af77';c.lineWidth=2;c.stroke()}
 const moth=g.pets.find(p=>p.kind==='slowpet');if(moth){c.beginPath();c.arc(g.x,g.y,145+(moth.rank-1)*25,0,Math.PI*2);c.strokeStyle='#94b6df55';c.lineWidth=1;c.stroke()}
 const entities=[...g.enemies.map(e=>({e,x:e.x,y:e.y})),...g.pets.map(p=>({p,x:p.x,y:p.y})),{hero:true,x:g.x,y:g.y}].sort((a,b)=>a.y-b.y);
 for(const item of entities){if(!this.visible(item))continue;const e=item.e;
  if(item.hero){const cl=classes.find(c=>c.id===g.classId);this.image(g.classId,g.form?({ravager:'#bf9370',broodmother:'#b4c96c',hexer:'#bb88d6',warden:'#abb29a',frostking:'#8cdef0',dragon:'#eb9562'}[g.form]):cl.color,g.x,g.y,1,g.facing);if(g.levelGuard>0||g.shield>0||g.activeTime>0&&g.classId==='tank'){c.strokeStyle=g.levelGuard>0?'#c8ffff':'#85c6e8';c.lineWidth=2;c.strokeRect(g.x-21,g.y-34,42,47)}}
  else if(item.p){const colors={wolf:'#b8cda1',stormpet:'#f3dc76',frostpet:'#9cd6e9',firepet:'#ce8f63',healerpet:'#88dc9d',slowpet:'#a0b4e2',guardianpet:'#f2d58b'};this.image(item.p.kind,colors[item.p.kind],item.x,item.y,.55,1)}
  else{
   const size=e.boss?1.8:e.mini?1.4:1;this.image(e.kind,e.color,e.x,e.y,size,e.x>g.x?-1:1);
   if(e.freeze>0||e.stun>0){c.strokeStyle=e.freeze>0?'#9aeaff':'#f1dc92';c.lineWidth=1;c.strokeRect(e.x-18*size,e.y-29*size,36*size,38*size)}
   if(e.telegraph>0||e.windup>0){const a=e.telegraph>0?Math.atan2(e.dy,e.dx):e.aimAngle,len=e.telegraph>0?260:Math.min(400,Math.hypot(g.x-e.x,g.y-e.y));c.beginPath();c.moveTo(e.x,e.y);c.lineTo(e.x+Math.cos(a)*len,e.y+Math.sin(a)*len);c.strokeStyle='#ff5b7c';c.lineWidth=e.telegraph>0?4:2;c.stroke()}
   if(e.contactWindup>0){c.strokeStyle='#ff7287';c.lineWidth=2;c.strokeRect(e.x-19,e.y-31,38,42)}
   if(e.boss||e.mini||e.hp<e.maxHP){const width=e.boss?86:e.mini?64:28,y=e.y-32*size-6;c.fillStyle='#0d1d16';c.fillRect(e.x-width/2-1,y-1,width+2,6);c.fillStyle=e.boss?'#ff946e':e.mini?'#d2a0ec':'#afc78a';c.fillRect(e.x-width/2,y,width*Math.max(0,e.hp/e.maxHP),4);if(e.boss||e.mini){c.font='bold 10px monospace';c.textAlign='center';c.fillStyle='#f5efd9';c.fillText(e.name,e.x,y-6)}}
  }
 }
 for(const b of g.bullets)if(this.visible(b,20))this.projectile(b,false);for(const b of g.enemyBullets)if(this.visible(b,20))this.projectile(b,true);
 c.restore();
 }
 projectile(b,enemy){const c=this.ctx,color=enemy?(b.color||'#ff5b79'):b.kind==='ice'?'#91e9ff':b.kind==='fire'?'#ffbf67':b.kind==='holy'?'#caffab':'#ead998';c.save();c.translate(Math.round(b.x),Math.round(b.y));c.rotate(Math.atan2(b.vy,b.vx));c.fillStyle=enemy?'#23141c':'#1c2c21';c.fillRect(-10,-4,18,8);c.fillStyle=color;c.fillRect(-9,-2,15,4);c.fillStyle='#fff6de';c.fillRect(2,-2,5,4);c.restore()}
}
