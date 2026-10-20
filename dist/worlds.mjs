import {MAP} from './engine.mjs?v=ember-16';
import {buildPixelMap,paintPixelObstacle} from './pixel-art.mjs?v=ember-16';
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
export const paintObstacle=paintPixelObstacle;
export function getSceneMap(index,obstacles=MAP.obstacles,layoutKey='default'){index=((index%10)+10)%10;const key=layoutKey+':'+index;if(maps.has(key)){const map=maps.get(key);maps.delete(key);maps.set(key,map);return map}const image=buildPixelMap(scenes[index],index,obstacles);maps.set(key,image);while(maps.size>SCENE_CACHE_LIMIT)maps.delete(maps.keys().next().value);return image}
export function sceneCacheSize(){return maps.size}
let warmTicket=0;export function warmNextScene(index,obstacles=MAP.obstacles,layoutKey='default'){const ticket=++warmTicket;if(typeof window!=='undefined'&&window.requestIdleCallback)window.requestIdleCallback(()=>{if(ticket===warmTicket)getSceneMap((index+1)%10,obstacles,layoutKey)},{timeout:2000})}
// Twelve-phase scenery animation; at most five tiny marks per obstacle.
export function drawAmbience(c,index,time,reduced=false,obstacles=MAP.obstacles,opacity=1){const s=scenes[index],frame=reduced?4:Math.floor(time*12)%12;c.imageSmoothingEnabled=false;c.globalAlpha=.5*opacity;
 for(let i=0;i<obstacles.length;i++){const o=obstacles[i],x=Math.round(o.x),y=Math.round(o.y-o.r*(index===2?1.3:1.5)),f=(frame+i*3)%12;c.fillStyle=s.ambient;
  if(index===2){for(let j=0;j<2;j++){const h=5+(j*3+f)%8;c.fillStyle=j?'#edb36f':s.ambient;c.fillRect(x-4+j*5,y-h,2,h);c.fillStyle='#f6d99a';c.fillRect(x-4+j*5,y-3,1,3)}c.fillStyle=s.ambient;c.fillRect(x+f%5-2,y-14-f,1,1)}
  else if(index===3||index===6||index===8){for(let j=0;j<2;j++){const xx=x-10+(f+j*5)%12*2,yy=y-4+(f+j*3)%7;c.fillRect(xx-1,yy,3,1);c.fillRect(xx,yy-1,1,3)}}
  else if(index===4){for(let j=0;j<3;j++)c.fillRect(x-9+(f+j*4)%16,y+(f+j*5)%14,1,1)}
  else if(index===7){for(let j=0;j<2;j++){const xx=x-10+(f+j*6)%12*2,yy=y+(f+j*6)%12*2;c.fillRect(xx,yy,2,1);c.fillRect(xx+1,yy+1,1,1)}}
  else if(index===9){c.fillRect(x-6,y+Math.round(o.r*.75),1,1);if(f<5){c.fillRect(x-6+f,y+Math.round(o.r*.75)-f-2,1,1);c.fillRect(x-8-f,y+Math.round(o.r*.75)-f,1,1)}}
  else if(index===1){for(let j=0;j<4;j++)c.fillRect(x-18+(f*2+j*9)%36,y+Math.round(o.r)+j%2*2,1+j%2,1)}
  else{for(let j=0;j<3;j++){const a=(f+j*4)/12*Math.PI*2,xx=Math.round(x+Math.cos(a)*(12+j*6)),yy=Math.round(y+o.r*.65+Math.sin(a)*8);c.fillRect(xx,yy,1,1)}}
 }c.globalAlpha=1;c.imageSmoothingEnabled=false;
}
