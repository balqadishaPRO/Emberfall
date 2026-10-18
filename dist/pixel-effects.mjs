// Tiny six-frame pixel atlases: one draw call per burst, no particle entities.
const cache=new Map(),SIZE=64,FRAMES=6;
export function pixelAtlas(kind,color){const key=kind+color;let image=cache.get(key);if(image)return image;
 image=document.createElement('canvas');image.width=SIZE*FRAMES;image.height=SIZE;const c=image.getContext('2d');
 for(let f=0;f<FRAMES;f++){const p=f/(FRAMES-1),count=kind==='death'?16:kind==='frost'?12:kind==='holy'?10:12;
  for(let i=0;i<count;i++){const a=i/count*Math.PI*2+.19*(i%3),speed=9+(i*7%15),r=4+p*speed,x=Math.round(Math.cos(a)*r),y=Math.round(Math.sin(a)*r+(kind==='ember'?-p*9:kind==='death'?p*p*7:0)),size=i%3===0?4:3;
   c.fillStyle=i%3===0?'#fff6d5':color;c.globalAlpha=1-p*.65;c.fillRect(f*SIZE+32+x,32+y,size,size);
   if(kind==='frost'||kind==='holy'){c.fillRect(f*SIZE+32+x-1,32+y+1,size+2,1);c.fillRect(f*SIZE+32+x+1,32+y-1,1,size+2)}
   if(f<3){c.globalAlpha=.3;c.fillStyle=color;c.fillRect(f*SIZE+32+Math.round(x*.65),32+Math.round(y*.65),2,2)}
  }
  if(f<2){c.globalAlpha=.8;c.fillStyle='#fff5c9';c.fillRect(f*SIZE+29,29,6,6)}
 }c.globalAlpha=1;if(cache.size>=64)cache.delete(cache.keys().next().value);cache.set(key,image);return image;
}
export function drawPixels(c,kind,color,x,y,r,progress,reduced=false){const frame=reduced?3:Math.min(FRAMES-1,Math.floor(progress*FRAMES)),size=Math.min(120,Math.max(40,r*2.7));c.drawImage(pixelAtlas(kind,color),frame*SIZE,0,SIZE,SIZE,Math.round(x-size/2),Math.round(y-size/2),size,size)}

const rings=new Map(),shots=new Map();
export function drawPixelRing(c,x,y,rx,ry,color,filled=false){const key=color+filled;let image=rings.get(key);if(!image){image=document.createElement('canvas');image.width=image.height=128;const p=image.getContext('2d');p.fillStyle=color;
 for(let yy=-60;yy<=60;yy+=2)for(let xx=-60;xx<=60;xx+=2){const d=xx*xx+yy*yy;if(d>=58*58&&d<=60*60)p.fillRect(xx+63,yy+63,2,2);else if(filled&&d<58*58&&((xx+yy)%8===0)){p.globalAlpha=.16;p.fillRect(xx+63,yy+63,2,2);p.globalAlpha=1}}
 if(rings.size>=48)rings.delete(rings.keys().next().value);rings.set(key,image)}const smooth=c.imageSmoothingEnabled;c.imageSmoothingEnabled=false;c.drawImage(image,0,0,128,128,Math.round(x-rx*64/61),Math.round(y-ry*64/61),rx*128/61,ry*128/61);c.imageSmoothingEnabled=smooth;
}
export function pixelBeam(c,x,y,x2,y2,color,size=3){const n=Math.max(1,Math.min(64,Math.ceil(Math.hypot(x2-x,y2-y)/5)));c.fillStyle=color;c.beginPath();for(let i=0;i<=n;i++){const t=i/n;c.rect(Math.round((x+(x2-x)*t)/2)*2-Math.floor(size/2),Math.round((y+(y2-y)*t)/2)*2-Math.floor(size/2),size,size)}c.fill()}
export function pixelArc(c,x,y,r,a,b,color){c.fillStyle=color;for(let i=0;i<18;i++){const t=a+(b-a)*i/17;c.fillRect(Math.round((x+Math.cos(t)*r)/2)*2,Math.round((y+Math.sin(t)*r)/2)*2,3,3)}}
export function drawPixelShot(c,b,color,enemy,time,reduced=false){const kind=b.kind||'arrow',key=kind+color+enemy;let image=shots.get(key);if(!image){image=document.createElement('canvas');image.width=40*16;image.height=40*4;const p=image.getContext('2d');
 for(let dir=0;dir<16;dir++)for(let f=0;f<4;f++){const a=dir/16*Math.PI*2,dx=Math.cos(a),dy=Math.sin(a),cx=dir*40+20,cy=f*40+20,arrow=kind==='arrow'||kind==='volley';
  for(let i=-7;i<=4;i++){const x=Math.round(dx*i*1.5),y=Math.round(dy*i*1.5);p.fillStyle=i<0?color+'99':color;p.fillRect(cx+x-2,cy+y-2,4,4)}
  if(arrow){for(const d of [-1,1])for(let j=0;j<4;j++){const x=Math.round(dx*(8-j)-dy*j*d),y=Math.round(dy*(8-j)+dx*j*d);p.fillStyle='#fff1c2';p.fillRect(cx+x,cy+y,2,2);p.fillStyle=color;p.fillRect(cx-Math.round(dx*9+dy*j*d),cy-Math.round(dy*9-dx*j*d),2,2)}}
  else{const r=kind==='ice'?5:kind==='holy'?5:6+(f%2);for(let yy=-r;yy<=r;yy+=2)for(let xx=-r;xx<=r;xx+=2)if(Math.abs(xx)+Math.abs(yy)<=r+2){p.fillStyle=color;p.fillRect(cx+xx,cy+yy,2,2)}p.fillStyle='#fff6dc';p.fillRect(cx-2,cy-2,4,4);p.fillStyle=color;for(let j=0;j<3;j++){const t=j*3+f%3;p.fillRect(cx-Math.round(dx*(10+t))+j%2*3,cy-Math.round(dy*(10+t))-j%2*3,2,2)}}
 }if(shots.size>=48)shots.delete(shots.keys().next().value);shots.set(key,image)}
 const angle=((Math.round(Math.atan2(b.vy,b.vx)/Math.PI/2*16)%16)+16)%16,frame=reduced?0:Math.floor(time*10)%4,smooth=c.imageSmoothingEnabled;c.imageSmoothingEnabled=false;c.drawImage(image,angle*40,frame*40,40,40,Math.round(b.x)-20,Math.round(b.y)-20,40,40);c.imageSmoothingEnabled=smooth;
}

const fields=new Map(),swings=new Map();
// Entire element fields share one eight-frame texture; particles are never game entities.
export function drawField(c,kind,color,x,y,r,progress,reduced=false){const key=kind+color;let image=fields.get(key);if(!image){image=document.createElement('canvas');image.width=128*8;image.height=128;const p=image.getContext('2d');
 for(let f=0;f<8;f++){const t=f/7,count=kind==='electric'?18:kind==='holy'?18:24;for(let i=0;i<count;i++){const a=i*2.399963,spread=(.2+.8*t)*(12+(i*17%43)),xx=Math.round(64+Math.cos(a)*spread),yy=Math.round(64+Math.sin(a)*spread),ox=f*128;p.globalAlpha=(1-t*.75)*(i%3?.8:1);p.fillStyle=i%5===0?'#fff5d4':color;
  if(kind==='electric'){for(let j=0;j<4;j++){const px=xx+(j%2?2:0)-Math.floor(j/2),py=yy+j*2-3;p.fillRect(ox+px,py,2,2)}if(i%6===0){p.fillRect(ox+xx-2,yy,6,1);p.fillRect(ox+xx,yy-2,1,6)}}
  else if(kind==='fire'){const rise=Math.round(t*9),h=4+(i+f)%6;p.fillRect(ox+xx,yy-rise,3,h);p.fillRect(ox+xx+1,yy-rise-3,2,4);p.fillStyle='#ffe4a4';p.fillRect(ox+xx+1,yy-rise+2,2,3)}
  else if(kind==='frost'){p.fillRect(ox+xx-4,yy,9,2);p.fillRect(ox+xx,yy-4,2,9);p.fillRect(ox+xx-2,yy-2,6,6);p.fillStyle='#e3ffff';p.fillRect(ox+xx,yy-1,2,4)}
  else if(kind==='nature'){p.fillRect(ox+xx,yy,5,3);p.fillRect(ox+xx+2,yy-2,3,7);if(i%3===0)p.fillRect(ox+xx-2,yy+5,2,3)}
  else if(kind==='holy'){p.fillRect(ox+xx-3,yy,8,2);p.fillRect(ox+xx,yy-3,2,8)}
  else if(kind==='arcane'){for(let j=0;j<4;j++){p.fillRect(ox+xx+j,yy+j,2,2);p.fillRect(ox+xx-j,yy+j,2,2)}}
  else{p.fillRect(ox+xx,yy+Math.round(t*t*5),3+i%3,3+i%2);p.globalAlpha*=.35;p.fillRect(ox+xx-3,yy+5,6,2)}
 }}p.globalAlpha=1;if(fields.size>=24)fields.delete(fields.keys().next().value);fields.set(key,image)}const f=reduced?3:Math.min(7,Math.floor(progress*8)),size=r*2.2;c.drawImage(image,f*128,0,128,128,Math.round(x-size/2),Math.round(y-size/2),size,size);
}
export function drawSwing(c,x,y,r,angle,progress,claws=false){const key=claws?'claws':'steel';let image=swings.get(key);if(!image){image=document.createElement('canvas');image.width=96*6;image.height=96*8;const p=image.getContext('2d');for(let dir=0;dir<8;dir++)for(let f=0;f<6;f++){const a=dir*Math.PI/4,end=a-1.2+f/5*2.4;for(let claw=0;claw<(claws?3:1);claw++)for(let j=0;j<32;j++){const q=j/31,theta=end-1.25+q*1.25,rr=39-claw*8,xx=Math.round(f*96+48+Math.cos(theta)*rr),yy=Math.round(dir*96+48+Math.sin(theta)*rr);p.globalAlpha=.12+.82*q;p.fillStyle=claws?'#d39bfa':'#d7c68c';const w=claws?3:3+Math.round(q*5);p.fillRect(Math.round(xx-w/2),Math.round(yy-w/2),w,w);if(q>.65){p.fillStyle='#fff5dc';p.fillRect(xx-1,yy-1,3,3)}if(j%7===0){p.fillStyle=claws?'#e8bbff':'#f8da86';p.fillRect(xx+Math.round(Math.cos(theta)*7),yy+Math.round(Math.sin(theta)*7),2,2)}}}p.globalAlpha=1;swings.set(key,image)}const dir=((Math.round(angle/(Math.PI/4))%8)+8)%8,f=Math.min(5,Math.max(0,Math.floor(progress*6))),size=r*2.4;c.drawImage(image,f*96,dir*96,96,96,Math.round(x-size/2),Math.round(y-size/2),size,size)}
