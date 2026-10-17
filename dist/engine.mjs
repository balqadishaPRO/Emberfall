export const talents = [
 {id:'might',name:'Heavy hand',icon:'✦',type:'OFFENSE',description:'+25% damage to every attack.',apply:g=>g.stats.damage*=1.25},
 {id:'haste',name:'Quickening',icon:'ϟ',type:'OFFENSE',description:'Attack 18% faster.',apply:g=>g.stats.interval*=.82},
 {id:'stride',name:'Ghost step',icon:'➶',type:'MOBILITY',description:'+15% movement speed. Stay ahead of the horde.',apply:g=>g.stats.speed*=1.15},
 {id:'vitality',name:'Iron heart',icon:'♥',type:'DEFENSE',description:'+30 maximum health. Recover 30 health immediately.',apply:g=>{g.stats.maxHealth+=30;g.health=Math.min(g.stats.maxHealth,g.health+30)}},
 {id:'regen',name:'Second wind',icon:'❋',type:'DEFENSE',description:'Regenerate 0.8 health every second.',apply:g=>g.stats.regen+=.8},
 {id:'multishot',name:'Split ember',icon:'⋔',type:'OFFENSE',description:'Fire one additional projectile with every attack.',max:5,apply:g=>g.stats.shots++},
 {id:'pierce',name:'Soul piercer',icon:'↟',type:'OFFENSE',description:'Projectiles pass through one additional enemy.',max:5,apply:g=>g.stats.pierce++},
 {id:'orbit',name:'Warden’s ring',icon:'◌',type:'ARCANE',description:'Add a spirit blade that circles you and damages nearby foes.',max:6,apply:g=>g.stats.orbits++},
 {id:'nova',name:'Afterglow',icon:'☼',type:'ARCANE',description:'Release a damaging nova every 5 seconds. Stacks increase its power.',max:6,apply:g=>g.stats.nova++},
 {id:'armor',name:'Stone skin',icon:'⬡',type:'DEFENSE',description:'Take 12% less contact damage. Stacks multiply.',apply:g=>g.stats.armor*=.88},
 {id:'wisdom',name:'Old knowledge',icon:'◈',type:'GROWTH',description:'Gain 20% more experience from every kill.',apply:g=>g.stats.xp*=1.2},
 {id:'reach',name:'Long shadow',icon:'⌁',type:'ARCANE',description:'+20% projectile speed and spirit-blade reach.',apply:g=>{g.stats.projectileSpeed*=1.2;g.stats.radius*=1.2}},
];
export function createGame(seed=Date.now()) {
 let s=seed>>>0;
 const random=()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296};
 return {random,status:'ready',time:0,x:0,y:0,health:100,level:1,xp:0,nextXP:9,kills:0,enemies:[],bullets:[],effects:[],numbers:[],build:{},choices:[],stats:{damage:22,interval:.65,speed:190,maxHealth:100,regen:0,shots:1,pierce:0,orbits:0,nova:0,armor:1,xp:1,projectileSpeed:420,radius:76},attack:0,spawn:0,novaClock:0,invulnerable:0,eliteAt:60,id:0,facing:1};
}
export function rollChoices(g){const pool=talents.filter(t=>(g.build[t.id]||0)<(t.max||Infinity));const picks=[];while(picks.length<3&&pool.length){picks.push(pool.splice(Math.floor(g.random()*pool.length),1)[0].id)}return picks}
export function chooseUpgrade(g,id){if(g.status!=='levelup'||!g.choices.includes(id))return false;const t=talents.find(t=>t.id===id);t.apply(g);g.build[id]=(g.build[id]||0)+1;g.choices=[];g.status='playing';checkLevel(g);return true}
function checkLevel(g){if(g.xp>=g.nextXP){g.xp-=g.nextXP;g.level++;g.nextXP=Math.round(g.nextXP*1.2+4);g.status='levelup';g.choices=rollChoices(g)}}
export function spawnEnemy(g,elite=false){const a=g.random()*Math.PI*2,r=elite?650:570+g.random()*100;let type=0;if(g.time>25&&g.random()<.28)type=1;if(g.time>55&&g.random()<.22)type=2;if(g.time>105&&g.random()<.18)type=3;if(elite)type=4;const hp=[20,14,75,35,400][type]*(1+g.time/180);const e={id:++g.id,x:g.x+Math.cos(a)*r,y:g.y+Math.sin(a)*r,type,hp,maxHP:hp,r:[13,10,21,14,32][type],speed:[45,95,34,73,40][type]*(1+Math.min(g.time/800,1.2)),damage:[9,6,19,12,28][type],hit:0,orbitHit:0};g.enemies.push(e);return e}
function hurtEnemy(g,e,damage){if(e.hp<=0)return;e.hp-=damage;e.hit=.12;if(g.numbers.length<45)g.numbers.push({x:e.x,y:e.y-12,text:Math.round(damage),life:.6,color:'#f5e6b3'});if(e.hp<=0){g.kills++;g.xp+=(e.type===4?35:e.type===2?6:3)*g.stats.xp;g.effects.push({x:e.x,y:e.y,r:e.r,color:e.type===4?'#edb55c':'#a0d8bd',life:.35,max:.35,kind:'kill'});}}
export function step(g,dt,input={x:0,y:0}){
 if(g.status!=='playing'||!Number.isFinite(dt)||dt<=0)return;dt=Math.min(dt,.05);g.time+=dt;g.invulnerable=Math.max(0,g.invulnerable-dt);g.health=Math.min(g.stats.maxHealth,g.health+g.stats.regen*dt);
 let mx=Number.isFinite(input.x)?input.x:0,my=Number.isFinite(input.y)?input.y:0,len=Math.hypot(mx,my);if(len>1){mx/=len;my/=len}g.x+=mx*g.stats.speed*dt;g.y+=my*g.stats.speed*dt;if(mx)g.facing=mx>0?1:-1;
 const rate=.65+g.time*.018+Math.pow(g.time/90,1.3)*.22;g.spawn+=dt*rate;while(g.spawn>=1){g.spawn--;if(g.enemies.length<450)spawnEnemy(g)}if(g.time>=g.eliteAt){g.eliteAt+=60;spawnEnemy(g,true);g.effects.push({kind:'elite',life:4,max:4})}
 // Recycle distant enemies so moving in one direction never empties the arena.
 const grid=new Map(),cell=72,key=(x,y)=>`${Math.floor(x/cell)},${Math.floor(y/cell)}`;
 for(const e of g.enemies){if(e.hp<=0)continue;let dx=g.x-e.x,dy=g.y-e.y,d=Math.hypot(dx,dy);if(d>1300){const a=g.random()*Math.PI*2;e.x=g.x+Math.cos(a)*650;e.y=g.y+Math.sin(a)*650;dx=g.x-e.x;dy=g.y-e.y;d=650}if(d>1){e.x+=dx/d*e.speed*dt;e.y+=dy/d*e.speed*dt}e.hit=Math.max(0,e.hit-dt);e.orbitHit=Math.max(0,e.orbitHit-dt);if(d<e.r+13&&g.invulnerable<=0){g.health-=e.damage*g.stats.armor;g.invulnerable=.55;g.effects.push({x:g.x,y:g.y,r:25,color:'#f67e76',kind:'hit',life:.25,max:.25});}const k=key(e.x,e.y);if(!grid.has(k))grid.set(k,[]);grid.get(k).push(e)}
 g.attack-=dt;if(g.attack<=0){let target=null,best=360;for(const e of g.enemies){if(e.hp<=0)continue;const d=Math.hypot(e.x-g.x,e.y-g.y);if(d<best){best=d;target=e}}if(target){g.attack=Math.max(.06,g.stats.interval);let angle=Math.atan2(target.y-g.y,target.x-g.x);for(let i=0;i<g.stats.shots;i++){const a=angle+(i-(g.stats.shots-1)/2)*.13;g.bullets.push({x:g.x,y:g.y-5,vx:Math.cos(a)*g.stats.projectileSpeed,vy:Math.sin(a)*g.stats.projectileSpeed,life:1.8,damage:g.stats.damage,left:g.stats.pierce+1,hits:new Set()})}}}
 for(const b of g.bullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;const cx=Math.floor(b.x/cell),cy=Math.floor(b.y/cell);for(let ox=-1;ox<=1;ox++)for(let oy=-1;oy<=1;oy++)for(const e of grid.get(`${cx+ox},${cy+oy}`)||[]){if(b.left<=0||e.hp<=0||b.hits.has(e.id))continue;if(Math.hypot(e.x-b.x,e.y-b.y)<e.r+5){b.hits.add(e.id);b.left--;hurtEnemy(g,e,b.damage)}}}
 g.bullets=g.bullets.filter(b=>b.life>0&&b.left>0);
 for(let i=0;i<g.stats.orbits;i++){const a=g.time*2.5+i*Math.PI*2/g.stats.orbits,x=g.x+Math.cos(a)*g.stats.radius,y=g.y+Math.sin(a)*g.stats.radius;for(const e of g.enemies){if(e.hp>0&&e.orbitHit<=0&&Math.hypot(e.x-x,e.y-y)<e.r+12){e.orbitHit=.35;hurtEnemy(g,e,g.stats.damage*.7)}}}
 g.novaClock+=dt;if(g.stats.nova&&g.novaClock>=5){g.novaClock=0;const radius=150+g.stats.nova*14;g.effects.push({kind:'nova',x:g.x,y:g.y,r:radius,color:'#8fbfe1',life:.6,max:.6});for(const e of g.enemies)if(Math.hypot(e.x-g.x,e.y-g.y)<radius)hurtEnemy(g,e,g.stats.damage*(1+g.stats.nova*.6))}
 g.enemies=g.enemies.filter(e=>e.hp>0);for(const e of g.effects)e.life-=dt;g.effects=g.effects.filter(e=>e.life>0);for(const n of g.numbers){n.life-=dt;n.y-=dt*26}g.numbers=g.numbers.filter(n=>n.life>0);
 if(g.health<=0){g.health=0;g.status='dead'}else checkLevel(g);
}
