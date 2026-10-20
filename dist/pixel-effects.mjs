import {box,stroke,polygon,oval} from './pixel-art.mjs?v=ember-16';
// Tiny six-frame pixel atlases: one draw call per burst, no particle entities.
const cache=new Map(),SIZE=96,FRAMES=12;
export function pixelAtlas(kind,color){const key=kind+color;let image=cache.get(key);if(image)return image;
 image=document.createElement('canvas');image.width=SIZE*FRAMES;image.height=SIZE;const c=image.getContext('2d');
 for(let f=0;f<FRAMES;f++){const p=f/(FRAMES-1),count=kind==='death'?16:kind==='frost'?12:kind==='holy'?10:12;
  for(let i=0;i<count;i++){const a=i/count*Math.PI*2+.19*(i%3),speed=9+(i*7%15),r=4+p*speed,x=Math.round(Math.cos(a)*r),y=Math.round(Math.sin(a)*r+(kind==='ember'?-p*9:kind==='death'?p*p*7:0)),size=i%3===0?2:1;
   c.fillStyle=i%3===0?'#fff6d5':color;c.globalAlpha=1-p*.65;c.fillRect(f*SIZE+48+x,48+y,size,size);
   if(kind==='frost'||kind==='holy'){c.fillRect(f*SIZE+48+x-1,48+y+1,size+2,1);c.fillRect(f*SIZE+48+x+1,48+y-1,1,size+2)}
   if(f<3){c.globalAlpha=.3;c.fillStyle=color;c.fillRect(f*SIZE+48+Math.round(x*.65),48+Math.round(y*.65),2,2)}
  }
  if(f<2){c.globalAlpha=.8;c.fillStyle='#fff5c9';c.fillRect(f*SIZE+46,46,4,4)}
 }c.globalAlpha=1;if(cache.size>=64)cache.delete(cache.keys().next().value);cache.set(key,image);return image;
}
export function drawPixels(c,kind,color,x,y,r,progress,reduced=false){const frame=reduced?3:Math.min(FRAMES-1,Math.floor(progress*FRAMES)),size=Math.min(120,Math.max(40,r*2.7));c.drawImage(pixelAtlas(kind,color),frame*SIZE,0,SIZE,SIZE,Math.round(x-size/2),Math.round(y-size/2),size,size)}

const rings=new Map(),shots=new Map();
export function drawPixelRing(c,x,y,rx,ry,color,filled=false){const key=color+filled;let image=rings.get(key);if(!image){image=document.createElement('canvas');image.width=image.height=256;const p=image.getContext('2d');p.fillStyle=color;for(let yy=-123;yy<=123;yy++)for(let xx=-123;xx<=123;xx++){const d=xx*xx+yy*yy;if(d>=121*121&&d<=123*123)p.fillRect(xx+127,yy+127,1,1);else if(filled&&d<121*121&&(xx+yy)%11===0){p.globalAlpha=.12;p.fillRect(xx+127,yy+127,1,1);p.globalAlpha=1}}if(rings.size>=48)rings.delete(rings.keys().next().value);rings.set(key,image)}c.drawImage(image,0,0,256,256,Math.round(x-rx*64/61),Math.round(y-ry*64/61),rx*128/61,ry*128/61)}

export function pixelBeam(c,x,y,x2,y2,color,size=3){const n=Math.max(1,Math.min(640,Math.ceil(Math.hypot(x2-x,y2-y))));c.fillStyle=color;c.beginPath();for(let i=0;i<=n;i++){const t=i/n;c.rect(Math.round(x+(x2-x)*t)-Math.floor(size/2),Math.round(y+(y2-y)*t)-Math.floor(size/2),size,size)}c.fill()}
export function pixelArc(c,x,y,r,a,b,color){c.fillStyle=color;for(let i=0;i<18;i++){const t=a+(b-a)*i/17;c.fillRect(Math.round((x+Math.cos(t)*r)/2)*2,Math.round((y+Math.sin(t)*r)/2)*2,3,3)}}
export function drawPixelShot(c,b,color,enemy,time,reduced=false){const kind=b.kind||'arrow',key=kind+color+enemy,S=64,D=32,F=6;let image=shots.get(key);if(!image){image=document.createElement('canvas');image.width=S*D;image.height=S*F;const p=image.getContext('2d');for(let d=0;d<D;d++)for(let f=0;f<F;f++){const a=d/D*Math.PI*2,dx=Math.cos(a),dy=Math.sin(a),px=-dy,py=dx,x=d*S+32,y=f*S+32;if(['arrow','volley','phantom'].includes(kind)){stroke(p,x-dx*17,y-dy*17,x+dx*12,y+dy*12,'#25353b',3);stroke(p,x-dx*16,y-dy*16,x+dx*12,y+dy*12,color);polygon(p,[[x+dx*18,y+dy*18],[x+dx*9+px*3,y+dy*9+py*3],[x+dx*11,y+dy*11],[x+dx*9-px*3,y+dy*9-py*3]],'#f2e9ce');for(const q of [-1,1])stroke(p,x-dx*12,y-dy*12,x-dx*18+px*3*q,y-dy*18+py*3*q,color);if(kind==='phantom')for(let i=0;i<4;i++)box(p,x-dx*(20+i*2)+px*((i+f)%3-1)*2,y-dy*(20+i*2)+py*((i+f)%3-1)*2,1,1,'#dfc4ff')}else if(kind==='ice'){polygon(p,[[x+dx*14,y+dy*14],[x+px*4,y+py*4],[x-dx*9,y-dy*9],[x-px*4,y-py*4]],color);stroke(p,x-dx*6,y-dy*6,x+dx*12,y+dy*12,'#efffff');for(let i=0;i<6;i++)box(p,x-dx*(10+i*2)+px*((i+f)%3-1)*3,y-dy*(10+i*2)+py*((i+f)%3-1)*3,1,1,color)}else{for(let i=0;i<18;i++){const angle=i*2.399963,r=3+(i+f)%5;box(p,x+Math.cos(angle)*r,y+Math.sin(angle)*r,2,2,color)}oval(p,x,y,5,5,color);oval(p,x+1,y-1,3,3,'#fff0c7');for(let i=0;i<9;i++)box(p,x-dx*(7+i*2)+px*((i+f)%3-1)*3,y-dy*(7+i*2)+py*((i+f)%3-1)*3,1+i%2,1,color)}}if(shots.size>=20)shots.delete(shots.keys().next().value);shots.set(key,image)}const dir=((Math.round(Math.atan2(b.vy,b.vx)/(Math.PI*2)*D)%D)+D)%D,f=reduced?2:Math.floor(time*18)%F;c.drawImage(image,dir*S,f*S,S,S,Math.round(b.x)-24,Math.round(b.y)-24,48,48)}

const fields=new Map(),swings=new Map();
const blades=new Map();
let rootAtlas;
export function drawRoots(c,x,y,r,progress,reduced=false){
 if(!rootAtlas){rootAtlas=document.createElement('canvas');rootAtlas.width=256*12;rootAtlas.height=256;const p=rootAtlas.getContext('2d');
  for(let f=0;f<12;f++)for(let i=0;i<10;i++){const a=i*Math.PI/5+.2,reach=18+f*8,dx=Math.cos(a),dy=Math.sin(a),ox=f*256+128,oy=128;let ax=ox,ay=oy;
   for(let j=1;j<=4;j++){const d=reach*j/4,bend=(j%2?1:-1)*5,bx=ox+dx*d-dy*bend,by=oy+dy*d+dx*bend;pixelBeam(p,ax,ay,bx,by,'#503d2c',3);pixelBeam(p,ax,ay-1,bx,by-1,'#97ba65',1);if(j>1){pixelBeam(p,bx,by,bx-dy*9,by+dx*9,'#71964b',2);p.fillStyle='#b8d77d';p.fillRect(Math.round(bx-dy*9),Math.round(by+dx*9),2,1)}ax=bx;ay=by}
  }
 }
 const frame=reduced?9:Math.min(11,Math.max(0,Math.floor(progress*12))),size=r*2.3;c.drawImage(rootAtlas,frame*256,0,256,256,Math.round(x-size/2),Math.round(y-size/2),size,size);
}
export function drawFlameMantle(c,x,y,r,time,reduced=false){
 const key='mantle';let image=fields.get(key);if(!image){image=document.createElement('canvas');image.width=256*12;image.height=256;const p=image.getContext('2d');
  for(let f=0;f<12;f++)for(let i=0;i<64;i++){const a=i*Math.PI*2/64,rad=i%3===0?70:108,xx=Math.round(f*256+128+Math.cos(a)*rad),yy=Math.round(128+Math.sin(a)*rad),h=7+(i*3+f*2)%10;
   p.fillStyle='#b64624';p.fillRect(xx-3,yy-h,5,h+3);p.fillStyle='#ff862f';p.fillRect(xx-2,yy-h+2,3,h);p.fillRect(xx,yy-h-3,2,5);p.fillStyle='#ffe39a';p.fillRect(xx-1,yy-4,3,6);
  }fields.set(key,image)}
 const frame=reduced?2:Math.floor(time*16)%12,size=r*2.25;c.drawImage(image,frame*256,0,256,256,Math.round(x-size/2),Math.round(y-size/2),size,size);
}
// Fine steel swords, cached in 32 directions.
export function drawSpiritBlade(c,x,y,angle,size=1){const S=80,D=32;let image=blades.get('spirit');if(!image){image=document.createElement('canvas');image.width=S*D;image.height=S;const p=image.getContext('2d');for(let i=0;i<D;i++){const a=i/D*Math.PI*2,dx=Math.cos(a),dy=Math.sin(a),px=-dy,py=dx,xx=i*S+40,yy=40;polygon(p,[[xx+px*3,yy+py*3],[xx+dx*24+px*2,yy+dy*24+py*2],[xx+dx*30,yy+dy*30],[xx+dx*24-px*2,yy+dy*24-py*2],[xx-px*3,yy-py*3]],'#527e8b');stroke(p,xx,yy,xx+dx*27,yy+dy*27,'#eef5d9');stroke(p,xx+px,yy+py,xx+dx*24+px,yy+dy*24+py,'#a4c7bf');stroke(p,xx+px*6,yy+py*6,xx-px*6,yy-py*6,'#e1be77',2);stroke(p,xx-dx*2,yy-dy*2,xx-dx*11,yy-dy*11,'#71556e',3);box(p,xx-dx*12,yy-dy*12,2,2,'#efd191')}blades.set('spirit',image)}const dir=((Math.round(angle/(Math.PI*2/D))%D)+D)%D;c.drawImage(image,dir*S,0,S,S,Math.round(x-32*size),Math.round(y-32*size),64*size,64*size)}
export function drawQuake(c,x,y,r,progress,reduced=false){
 const p=reduced?.7:progress,reach=r*Math.min(1,.2+p*2);c.globalAlpha*=1-p*.65;
 drawPixelRing(c,x,y,reach,reach,'#f1d392');
 for(let i=0;i<9;i++){const a=i*Math.PI*2/9+.2,dx=Math.cos(a),dy=Math.sin(a);let ax=x+dx*15,ay=y+dy*15;
  for(let j=1;j<=3;j++){const d=reach*j/3,bend=(j%2?1:-1)*9,bx=x+dx*d-dy*bend,by=y+dy*d+dx*bend;pixelBeam(c,ax,ay,bx,by,'#322a26',3);pixelBeam(c,ax,ay-2,bx,by-2,'#e8c486',1);ax=bx;ay=by}
  c.fillStyle='#d7c89b';const hop=reduced?0:Math.sin(Math.min(1,p*2)*Math.PI)*18;c.fillRect(Math.round(x+dx*reach*.7),Math.round(y+dy*reach*.7-hop),3,2);
 }
 drawField(c,'earth','#d7c89b',x,y,r,progress,reduced);
}
export function drawMeteor(c,m,reduced=false){const p=1-m.life/m.max,height=reduced?65:360*(1-p),x=m.x-height*.3,y=m.y-height;c.globalAlpha=.45;drawPixelRing(c,m.x,m.y,m.r,m.r,'#ffbd75',true);c.globalAlpha=.18;oval(c,m.x,m.y,5+p*7,2+p*2,'#182029');c.globalAlpha=1;for(let i=0;i<30;i++){const t=i/30,xx=x-t*31+Math.sin(i+p*18)*(2+t*4),yy=y-t*96;c.globalAlpha=1-t*.75;box(c,xx,yy,1+i%2,1+i%3,i%4?'#eda155':'#ffe4a0')}c.globalAlpha=1;polygon(c,[[x-8,y-6],[x-3,y-10],[x+5,y-8],[x+10,y-2],[x+7,y+7],[x-4,y+9],[x-10,y+2]],'#3b343d');polygon(c,[[x-7,y-5],[x-2,y-8],[x+4,y-6],[x+6,y],[x-2,y+5],[x-7,y+1]],'#825c4d');stroke(c,x-4,y-7,x-2,y+4,'#f4c27b',2);stroke(c,x+3,y-6,x+5,y+3,'#d98d56');stroke(c,x-1,y+3,x+4,y+5,'#ffc47a');box(c,x-4,y-5,2,2,'#fff0b9');box(c,x+4,y+3,1,2,'#f6d08c')}
// Entire element fields share one eight-frame texture; particles are never game entities.
export function drawField(c,kind,color,x,y,r,progress,reduced=false){const key=kind+color;let image=fields.get(key);if(!image){image=document.createElement('canvas');image.width=256*12;image.height=256;const p=image.getContext('2d');
 for(let f=0;f<12;f++){const t=f/11,count=kind==='electric'?40:kind==='holy'?40:64;for(let i=0;i<count;i++){const a=i*2.399963,spread=(.2+.8*t)*(25+(i*37%87)),xx=Math.round(128+Math.cos(a)*spread),yy=Math.round(128+Math.sin(a)*spread),ox=f*256;p.globalAlpha=(1-t*.75)*(i%3?.8:1);p.fillStyle=i%5===0?'#fff5d4':color;
  if(kind==='electric'){for(let j=0;j<4;j++){const px=xx+(j%2?2:0)-Math.floor(j/2),py=yy+j*2-3;p.fillRect(ox+px,py,2,2)}if(i%6===0){p.fillRect(ox+xx-2,yy,6,1);p.fillRect(ox+xx,yy-2,1,6)}}
  else if(kind==='fire'){const rise=Math.round(t*9),h=4+(i+f)%6;p.fillRect(ox+xx,yy-rise,3,h);p.fillRect(ox+xx+1,yy-rise-3,2,4);p.fillStyle='#ffe4a4';p.fillRect(ox+xx+1,yy-rise+2,2,3)}
  else if(kind==='frost'){p.fillRect(ox+xx-4,yy,9,2);p.fillRect(ox+xx,yy-4,2,9);p.fillRect(ox+xx-2,yy-2,6,6);p.fillStyle='#e3ffff';p.fillRect(ox+xx,yy-1,2,4)}
  else if(kind==='nature'){p.fillRect(ox+xx,yy,5,3);p.fillRect(ox+xx+2,yy-2,3,7);if(i%3===0)p.fillRect(ox+xx-2,yy+5,2,3)}
  else if(kind==='holy'){p.fillRect(ox+xx-3,yy,8,2);p.fillRect(ox+xx,yy-3,2,8)}
  else if(kind==='arcane'){for(let j=0;j<4;j++){p.fillRect(ox+xx+j,yy+j,2,2);p.fillRect(ox+xx-j,yy+j,2,2)}}
  else{p.fillRect(ox+xx,yy+Math.round(t*t*5),3+i%3,3+i%2);p.globalAlpha*=.35;p.fillRect(ox+xx-3,yy+5,6,2)}
 }}p.globalAlpha=1;if(fields.size>=24)fields.delete(fields.keys().next().value);fields.set(key,image)}const f=reduced?5:Math.min(11,Math.floor(progress*12)),size=r*2.2;c.drawImage(image,f*256,0,256,256,Math.round(x-size/2),Math.round(y-size/2),size,size);
}
export function drawSwing(c,x,y,r,angle,progress,claws=false){const key=claws?'claws':'steel';let image=swings.get(key);if(!image){image=document.createElement('canvas');image.width=160*12;image.height=160*16;const p=image.getContext('2d');for(let dir=0;dir<16;dir++)for(let f=0;f<12;f++){const a=dir*Math.PI/8,end=a-1.2+f/11*2.4;for(let claw=0;claw<(claws?3:1);claw++)for(let j=0;j<90;j++){const q=j/89,theta=end-1.25+q*1.25,rr=67-claw*13,xx=Math.round(f*160+80+Math.cos(theta)*rr),yy=Math.round(dir*160+80+Math.sin(theta)*rr);p.globalAlpha=.12+.82*q;p.fillStyle=claws?'#d39bfa':'#d7c68c';const w=claws?1:1+Math.round(q*3);p.fillRect(Math.round(xx-w/2),Math.round(yy-w/2),w,w);if(q>.65){p.fillStyle='#fff5dc';p.fillRect(xx-1,yy-1,3,3)}if(j%7===0){p.fillStyle=claws?'#e8bbff':'#f8da86';p.fillRect(xx+Math.round(Math.cos(theta)*7),yy+Math.round(Math.sin(theta)*7),2,2)}}}p.globalAlpha=1;swings.set(key,image)}const dir=((Math.round(angle/(Math.PI/8))%16)+16)%16,f=Math.min(11,Math.max(0,Math.floor(progress*12))),size=r*2.4;c.drawImage(image,f*160,dir*160,160,160,Math.round(x-size/2),Math.round(y-size/2),size,size)}

export function drawMotion(c,g,e,flying=false,reduced=false){if(reduced)return;const t=g.time+(e.id||0)*.31;if(e.moving&&!flying){const p=t*7%1;for(let i=0;i<3;i++){c.globalAlpha=(1-p)*.3;box(c,e.x-(e.facing||1)*(6+i*3),e.y+16+p*3+i%2,1+i%2,1,'#b7ab80')}}else if(flying){for(let i=0;i<3;i++){const a=t*2+i*Math.PI*2/3;c.globalAlpha=.25;box(c,e.x+Math.cos(a)*12,e.y-8+Math.sin(a)*7,1,1,'#b6d7c9')}}c.globalAlpha=1}

export function drawStatus(c,g,e,reduced=false){const t=reduced?0:g.time,phase=(t*14+e.id)%12;if(e.burn>0)for(let i=0;i<4;i++){const f=(phase+i*3)%12;c.globalAlpha=1-f/16;box(c,e.x-9+i*6,e.y-6-f*2,1+i%2,2,i%2?'#edb465':'#f7d99a')}if(e.poison>0)for(let i=0;i<3;i++){const f=(phase+i*4)%12;c.globalAlpha=.7-f/24;box(c,e.x-8+i*7,e.y+9-f,2,1,'#b8d16e')}if(e.freeze>0){c.globalAlpha=.8;for(let i=0;i<3;i++)polygon(c,[[e.x-12+i*12,e.y+7],[e.x-14+i*12,e.y-1-i%2*4],[e.x-10+i*12,e.y+5]],'#b4e3db')}c.globalAlpha=1}
