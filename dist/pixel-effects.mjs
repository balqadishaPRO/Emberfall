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
