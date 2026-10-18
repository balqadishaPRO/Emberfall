import {MAP} from './engine.mjs?v=ember-11';
import {buildMap} from './illustrations.mjs?v=ember-11';
export const scenes=[
 {id:'forest',name:'The Hollow Wood',ground:'#14291f',wash:'#28472c',light:'#73965a',dark:'#0c1e17',stone:'#68755b',side:'#374b3c',accent:'#b3be86',ambient:'#bddb80'},
 {id:'desert',name:'The Sunken Dunes',ground:'#705b40',wash:'#94764d',light:'#b89b67',dark:'#4c4432',stone:'#c0a36b',side:'#79613e',accent:'#e3c995',ambient:'#dfbd7d'},
 {id:'hell',name:'The Ember Depths',ground:'#302427',wash:'#513031',light:'#77433a',dark:'#1c1a22',stone:'#65504d',side:'#322c37',accent:'#cf7953',ambient:'#eea064'},
 {id:'heaven',name:'The Celestial Garden',ground:'#617d84',wash:'#78939a',light:'#a5b8b5',dark:'#435c69',stone:'#d4d8c0',side:'#8ea9aa',accent:'#ead7a0',ambient:'#f0e6b1'},
 {id:'glacier',name:'The Frostbound Reach',ground:'#405e72',wash:'#527b8b',light:'#88acba',dark:'#2c455c',stone:'#bedbe0',side:'#6c9eb5',accent:'#c5eef0',ambient:'#bde7f1'},
 {id:'swamp',name:'The Mireglow Marsh',ground:'#263b34',wash:'#3e5041',light:'#637550',dark:'#192d2b',stone:'#726d50',side:'#3c4638',accent:'#91b175',ambient:'#9dca8e'},
 {id:'crystal',name:'The Amethyst Hollows',ground:'#302c49',wash:'#49415f',light:'#706188',dark:'#211f37',stone:'#aa91c8',side:'#625080',accent:'#c6ace5',ambient:'#b7a3dc'},
 {id:'autumn',name:'The Crimson Grove',ground:'#483b31',wash:'#67503c',light:'#9d714b',dark:'#302c2a',stone:'#987853',side:'#554432',accent:'#c59c62',ambient:'#d4a174'},
 {id:'astral',name:'The Astral Expanse',ground:'#1f2d43',wash:'#2e4259',light:'#506d89',dark:'#151f34',stone:'#7292a5',side:'#3b4c6e',accent:'#b4cce5',ambient:'#adc5e5'},
 {id:'clockwork',name:'The Clockwork Ruins',ground:'#424a49',wash:'#58605a',light:'#7c8372',dark:'#2d393a',stone:'#a89670',side:'#5a625b',accent:'#dcc28a',ambient:'#d0bc8d'}
];
export const sceneIndex=time=>Math.floor(Math.max(0,Number.isFinite(time)?time:0)/60)%scenes.length;
export const sceneAt=time=>scenes[sceneIndex(time)];
const maps=new Map();export const SCENE_CACHE_LIMIT=3;
const hash=(x,y)=>{let n=Math.imul(x+91,374761393)+Math.imul(y+37,668265263);n^=n>>>13;return(Math.imul(n,1274126177)>>>0)/4294967296};
function poly(c,p,fill,stroke){c.beginPath();c.moveTo(...p[0]);for(let i=1;i<p.length;i++)c.lineTo(...p[i]);c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke()}}
function ellipse(c,x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill()}
function line(c,p,color,w=2){c.beginPath();c.moveTo(...p[0]);for(let i=1;i<p.length;i++)c.lineTo(...p[i]);c.strokeStyle=color;c.lineWidth=w;c.stroke()}
function pillar(c,s,x,y,r){const w=r*.65,h=r*1.2;ellipse(c,x+5,y+10,r*1.05,r*.45,s.dark+'99');poly(c,[[x-r,y-5],[x,y-r*.6],[x+r,y-4],[x+r,y+8],[x,y+r*.5],[x-r,y+8]],s.side,s.dark);poly(c,[[x-w,y-h],[x+w,y-h],[x+w,y],[x,y+10],[x-w,y]],s.stone,s.dark);poly(c,[[x,y-h],[x+w,y-h],[x+w,y],[x,y+10]],s.side);poly(c,[[x-w-4,y-h],[x,y-h-12],[x+w+4,y-h],[x,y-h+10]],s.light,s.dark);line(c,[[x-w+4,y-h+7],[x-w+4,y-1]],s.accent,2)}
export function paintObstacle(c,s,x,y,r){
 if(s.id==='desert'){pillar(c,s,x,y,r);poly(c,[[x-r*.5,y-r*1.2],[x,y-r*1.85],[x+r*.5,y-r*1.2],[x,y-r*.95]],s.accent,s.side);for(let i=0;i<3;i++)line(c,[[x-r*.4,y-r*.8+i*8],[x-3,y-r*.65+i*8]],s.side,2)}
 else if(s.id==='hell'){pillar(c,s,x,y,r);ellipse(c,x,y-r*1.3,r*.65,9,'#27202b');poly(c,[[x-r*.7,y-r*.6],[x-r*.95,y-r*1.2],[x-r*.4,y-r*.9]],s.side,s.dark);poly(c,[[x+r*.5,y-r*.6],[x+r*.85,y-r*1.05],[x+r*.7,y]],s.side,s.dark);line(c,[[x-8,y-r*.5],[x-3,y-r*.35],[x-7,y-2]],s.accent,2)}
 else if(s.id==='heaven'){pillar(c,s,x,y,r);for(const d of [-1,1]){poly(c,[[x+d*r*.2,y-r],[x+d*r*1.05,y-r*1.35],[x+d*r*.85,y-r*.6],[x+d*r*.3,y-r*.4]],'#c6d3c3',s.side);for(let i=0;i<3;i++)line(c,[[x+d*r*.35,y-r*.6-i*5],[x+d*r*.8,y-r*.85-i*4]],s.accent,1)}ellipse(c,x,y-r*1.55,r*.4,4,s.accent)}
 else if(s.id==='glacier'||s.id==='crystal'){ellipse(c,x+5,y+12,r,r*.5,s.dark+'99');for(let i=0;i<5;i++){const dx=(i-2)*r*.3,dy=i%2*8,h=r*(i===2?1.7:1+.1*i);poly(c,[[x+dx-10,y+dy],[x+dx-13,y-h*.6],[x+dx,y-h],[x+dx+13,y-h*.55],[x+dx+10,y+dy]],i%2?s.stone:s.side,s.dark);poly(c,[[x+dx,y-h],[x+dx+13,y-h*.55],[x+dx+10,y+dy],[x+dx,y+dy-8]],s.light);line(c,[[x+dx-1,y-h+10],[x+dx-7,y-h*.55]],s.accent,1)}}
 else if(s.id==='swamp'||s.id==='autumn'){ellipse(c,x+6,y+10,r,r*.5,s.dark+'aa');poly(c,[[x-r*.8,y+8],[x-r*.4,y-r*.5],[x-r*.35,y-r*1.5],[x+r*.35,y-r*1.5],[x+r*.4,y-r*.4],[x+r*.8,y+8],[x+9,y+3],[x,y+12],[x-13,y+3]],s.side,s.dark);poly(c,[[x-8,y-r*1.5],[x+8,y-r*1.5],[x+15,y+2],[x,y+7]],s.stone);ellipse(c,x,y-r*1.5,r*.35,6,s.accent);for(const d of [-1,1])line(c,[[x+d*10,y-r*.7],[x+d*r*.7,y-r],[x+d*r*.8,y-r*1.5]],s.side,8);if(s.id==='autumn')for(let i=0;i<7;i++){const a=i/7*Math.PI*2;ellipse(c,x+Math.cos(a)*r*.65,y-r*1.25+Math.sin(a)*r*.4,r*.42,r*.3,i%2?'#8d5d3e':'#a87345')}else{ellipse(c,x-7,y-r*.7,7,13,s.dark);for(let i=0;i<3;i++){const mx=x+(i-1)*r*.6;line(c,[[mx,y],[mx,y-11]],s.stone,3);ellipse(c,mx,y-12,9,4,i%2?'#829263':'#a39976')}}}
 else if(s.id==='astral'){ellipse(c,x,y+12,r,r*.4,s.dark+'aa');poly(c,[[x-r*.8,y-18],[x-r*.3,y-r*1.25],[x+r*.5,y-r*1.4],[x+r*.9,y-30],[x+r*.5,y-2],[x-r*.5,y]],s.stone,s.dark);poly(c,[[x-r*.3,y-r*1.25],[x+r*.5,y-r*1.4],[x+r*.9,y-30],[x,y-21]],s.light);poly(c,[[x,y-21],[x+r*.9,y-30],[x+r*.5,y-2],[x+2,y+4]],s.side);line(c,[[x-12,y-20],[x-4,y-35],[x+7,y-25]],s.accent,2)}
 else if(s.id==='clockwork'){pillar(c,s,x,y,r);const gy=y-r*.75;for(let i=0;i<12;i++){const a=i/12*Math.PI*2,xx=x+Math.cos(a)*r*.63,yy=gy+Math.sin(a)*r*.63;c.save();c.translate(xx,yy);c.rotate(a);c.fillStyle=s.accent;c.fillRect(-5,-5,10,10);c.restore()}ellipse(c,x,gy,r*.6,r*.6,s.accent);ellipse(c,x,gy,r*.42,r*.42,s.side);ellipse(c,x,gy,7,7,s.stone);line(c,[[x,gy],[x+12,gy-10]],s.accent,3)}
}
function terrain(s,index,obstacles){const image=document.createElement('canvas');image.width=1400;image.height=980;const c=image.getContext('2d');c.translate(-MAP.left,-MAP.top);c.fillStyle=s.ground;c.fillRect(MAP.left,MAP.top,1400,980);
 for(let i=0;i<1100;i++){const x=MAP.left+hash(i,index)*1400,y=MAP.top+hash(index,i)*980,r=8+hash(i,17)*45;ellipse(c,x,y,r,r*.45,s.wash+'45')}
 for(let tx=-23;tx<23;tx++)for(let ty=-16;ty<16;ty++){const x=tx*32+hash(tx,ty)*26,y=ty*34+hash(ty,tx)*24,n=hash(tx+index*7,ty);if(s.id==='desert'){if(n>.6)line(c,[[x-16,y],[x-5,y-3],[x+9,y-2],[x+19,y+2]],s.light+'40',1)}
  else if(s.id==='hell'){if(n>.82)line(c,[[x-9,y-9],[x,y],[x-4,y+10],[x+9,y+16]],s.accent+'55',1.5)}
  else if(s.id==='heaven'){if(n>.65){poly(c,[[x-13,y],[x,y-8],[x+13,y],[x,y+8]],s.light+'35');line(c,[[x-11,y],[x,y+6],[x+11,y]],s.accent+'40',1)}}
  else if(s.id==='glacier'){if(n>.7)line(c,[[x-15,y+5],[x-3,y-3],[x+3,y+1],[x+13,y-5]],s.accent+'55',1)}
  else if(s.id==='swamp'){if(n>.82){ellipse(c,x,y,24,8,s.dark+'77');ellipse(c,x+5,y-2,6,3,s.light+'88')}else if(n<.15)for(let j=0;j<3;j++)line(c,[[x+j*3,y],[x+j*3-1,y-12-j]],s.light+'66',1)}
  else if(s.id==='crystal'){if(n>.86){poly(c,[[x-3,y+4],[x-5,y-7],[x,y-16],[x+5,y-5],[x+3,y+4]],s.light+'66');line(c,[[x,y-14],[x+1,y+2]],s.accent+'55',1)}}
  else if(s.id==='autumn'){if(n>.5){for(let j=0;j<3;j++)poly(c,[[x+j*5,y],[x+j*5+3,y-3],[x+j*5+6,y],[x+j*5+2,y+3]],j%2?'#b3834c66':'#c2825666')}}
  else if(s.id==='astral'){if(n>.9){c.fillStyle=s.light+'77';c.fillRect(x,y,2,2)}else if(n<.025)ellipse(c,x,y,24,8,s.dark+'66')}
  else if(s.id==='clockwork'){if(n>.6){poly(c,[[x-12,y-6],[x+13,y-6],[x+13,y+7],[x-12,y+7]],s.dark+'44');line(c,[[x-10,y-5],[x+12,y-5]],s.light+'66',1);c.fillStyle=s.accent+'55';c.fillRect(x-9,y-3,2,2)}}
 }
 // Shared readable arena landmarks; different material and construction per world.
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2;line(c,[[Math.cos(a)*116,Math.sin(a)*116],[Math.cos(a)*124,Math.sin(a)*124]],s.accent+'35',3)}
 for(const o of obstacles){paintObstacle(c,s,o.x,o.y,o.r);const x=o.x,y=o.y,r=o.r;if(['desert','hell','heaven','clockwork'].includes(s.id)){for(let j=0;j<3;j++){const yy=y-r*.25-j*7;line(c,[[x-r*.45,yy],[x-3,yy+3]],s.accent+'88',1);line(c,[[x+5,yy+3],[x+r*.45,yy]],s.dark+'88',1)}for(const dx of [-1,1])ellipse(c,x+dx*r*.48,y-r*.8,1.2,1.2,s.accent)}else if(s.id==='crystal'||s.id==='glacier'){for(let j=0;j<4;j++)line(c,[[x+(j-1.5)*9,y-r*.25],[x+(j-2)*10,y-r*.9]],s.accent+'77',1)}else if(s.id==='autumn'||s.id==='swamp'){for(let j=0;j<4;j++)line(c,[[x-9+j*5,y-r],[x-7+j*5,y-r*.5],[x-8+j*5,y]],s.accent+'66',1)}else if(s.id==='astral'){line(c,[[x-15,y-r*.6],[x-6,y-r*.8],[x+2,y-r*.55],[x+9,y-r*.7]],s.accent+'aa',1)}}
 for(let x=MAP.left+20;x<MAP.right;x+=60)for(const y of [MAP.top+12,MAP.bottom-12]){poly(c,[[x-25,y],[x,y-14],[x+25,y],[x+23,y+13],[x-24,y+12]],s.side,s.dark);line(c,[[x-22,y],[x,y-11],[x+22,y]],s.stone,3)}
 for(let y=MAP.top+40;y<MAP.bottom;y+=60)for(const x of [MAP.left+14,MAP.right-14]){poly(c,[[x-13,y-25],[x+8,y-30],[x+18,y],[x+8,y+25],[x-13,y+23]],s.side,s.dark);line(c,[[x-10,y-22],[x+6,y-27],[x+14,y-2]],s.stone,2)}
 for(const x of [-580,580])for(const y of [-380,380]){ellipse(c,x,y,35,12,s.dark+'55');line(c,[[x-18,y],[x,y-8],[x+18,y],[x,y+8],[x-18,y]],s.accent+'55',2)}return image;
}
export function getSceneMap(index,obstacles=MAP.obstacles,layoutKey='default'){index=((index%10)+10)%10;const key=layoutKey+':'+index;if(maps.has(key)){const map=maps.get(key);maps.delete(key);maps.set(key,map);return map}const image=index===0?buildMap(obstacles):terrain(scenes[index],index,obstacles);maps.set(key,image);while(maps.size>SCENE_CACHE_LIMIT)maps.delete(maps.keys().next().value);return image}
export function sceneCacheSize(){return maps.size}
let warmTicket=0;export function warmNextScene(index,obstacles=MAP.obstacles,layoutKey='default'){const ticket=++warmTicket;if(typeof window!=='undefined'&&window.requestIdleCallback)window.requestIdleCallback(()=>{if(ticket===warmTicket)getSceneMap((index+1)%10,obstacles,layoutKey)},{timeout:2000})}
// At most six low-contrast accents, updated at 4 Hz on the foreground layer.
export function drawAmbience(c,index,time,reduced=false,obstacles=MAP.obstacles,opacity=1){const s=scenes[index],frame=reduced?1:Math.floor(time*4)%4;c.imageSmoothingEnabled=false;c.globalAlpha=.48*opacity;
 for(let i=0;i<obstacles.length;i++){const o=obstacles[i],x=Math.round(o.x),y=Math.round(o.y-o.r*(index===2?1.3:1.5));c.fillStyle=s.ambient;
  if(index===2){for(let j=0;j<4;j++){const h=6+(j*3+frame*2+i)%9;c.fillRect(x-8+j*4,y-h,4,h)}c.fillStyle='#f1c17f';c.fillRect(x-2,y-6,4,5)}
  else if(index===3||index===6||index===8){const d=(frame+i)%4;c.fillRect(x-8+d*5,y-4-d*2,2,2);c.fillRect(x+7-d*3,y+4,2,2)}
  else if(index===5){c.fillRect(x-16+frame*4,y+o.r*.6,2,2);c.fillRect(x+15-frame*2,y+o.r*.8,2,2)}
  else if(index===4){c.fillRect(x-7+frame*3,y+frame*3,2,2)}
  else if(index===7){c.fillRect(x-8+frame*4,y+frame*5,3,2)}
  else if(index===9){c.fillRect(x-6,y+o.r*.75,2,2);if(frame===i%4)c.fillRect(x-6,y+o.r*.75-3,2,2)}
 }c.globalAlpha=1;c.imageSmoothingEnabled=true;
}
