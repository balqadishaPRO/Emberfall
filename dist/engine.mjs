export const MAP = {left:-700,right:700,top:-490,bottom:490,name:'The Hollow Wood',obstacles:[{x:-300,y:-170,r:45},{x:310,y:180,r:48},{x:-370,y:300,r:42},{x:380,y:-300,r:44},{x:0,y:-350,r:38},{x:70,y:355,r:36}]};
export const categories = {physical:{name:'Combat',color:'#ecc18a'},fire:{name:'Fire',color:'#ff977a'},frost:{name:'Frost',color:'#91d7f4'},lightning:{name:'Lightning',color:'#f2dc7a'},vitality:{name:'Vitality',color:'#f1a7b7'},nature:{name:'Nature',color:'#abd68a'},arcane:{name:'Arcane',color:'#9ed6c8'},companion:{name:'Companion',color:'#c6aff1'}};
export const classes = [
 {id:'archer',name:'Archer',icon:'➶',color:'#b9d68d',weapon:'Longbow',tag:'RANGED · PRECISION',description:'Hold your distance. Fast arrows pierce through the front line.',perks:['340 attack range','Arrows pierce 1 foe','+10% movement speed'],stats:{damage:22,interval:.68,speed:209,pierce:1,range:340}},
 {id:'fighter',name:'Fighter',icon:'⚔',color:'#edb98a',weapon:'Greatsword',tag:'MELEE · ENDURANCE',description:'Stand your ground. Broad sword swings cut down crowds up close.',perks:['130 maximum health','Wide cleaving attacks','20% less incoming damage'],stats:{damage:31,interval:.95,maxHealth:130,armor:.8,range:108}},
 {id:'assassin',name:'Assassin',icon:'⋔',color:'#c8adea',weapon:'Twin daggers',tag:'MELEE · CRITICAL',description:'Slip through the horde. Strike quickly, hit critically, recover on kills.',perks:['40% crit · 25% dodge','255 speed · rapid daggers','Shadowstep deals 550% damage'],stats:{damage:25,interval:.30,speed:255,maxHealth:95,crit:.4,critPower:2.3,evade:.25,leech:.2,range:100}},
 {id:'mage',name:'Mage',icon:'✧',color:'#91cfed',weapon:'Ember staff',tag:'RANGED · ELEMENTAL',description:'Make the wilds burn. Explosive fireballs punish enemies that gather.',perks:['Exploding fireballs','Attacks inflict burning','+20% elemental damage'],stats:{damage:26,interval:1.05,maxHealth:90,range:320,elemental:1.2,burn:1}},
 {id:'tank',name:'Tank',icon:'⬡',color:'#90c8dd',weapon:'Tower shield',tag:'MELEE · ARMOR',description:'Hold the line. Shield bashes strike every enemy nearby.',perks:['200 HP · 40% less damage','30-point rechargeable shield','Area shield-bash attacks'],stats:{damage:26,interval:1.1,speed:165,maxHealth:200,armor:.6,shieldMax:30,range:135}},
 {id:'healer',name:'Healer',icon:'✚',color:'#91e2b0',weapon:'Dawn staff',tag:'RANGED · SUSTAIN',description:'Outlast the wood. Radiant bolts burst into crowds while you slowly recover.',perks:['Radiant splash attacks','Recover 0.25 HP per second','Sanctuary heals and slows foes'],stats:{damage:19,interval:.9,maxHealth:110,range:280,classRegen:.25}},
 {id:'shapeshifter',name:'Shapeshifter',icon:'◇',color:'#d4adf2',weapon:'Feral claws',tag:'MELEE · EVOLUTION',description:'Start fragile. Inherit a permanent aspect from every elite you defeat.',perks:['70 HP · weak starting claws','Absorb all 6 elite aspects','Repeated elite kills strengthen aspects'],stats:{damage:13,interval:.9,maxHealth:70,speed:185,range:95}}

];
const stat=(key,value,multiply=false)=>g=>{g.stats[key]=multiply?g.stats[key]*value:g.stats[key]+value};
const ability=(id,name,icon,category,description,apply,max=0,extra={})=>({id,name,icon,category,kind:'passive',type:categories[category].name,description,apply,max,...extra});
export const talents=[
 ability('bastion','Tempered bastion','⬡','vitality','Increase maximum shield by 12 and refill it by 12.',g=>{g.stats.shieldMax+=12;g.shield=Math.min(g.stats.shieldMax,g.shield+12)},4,{classes:['tank']}),
 ability('seismic','Seismic shield','⬢','physical','Every 4 seconds, bash a 185-unit area for 100% weapon damage per rank.',stat('seismic',1),4,{classes:['tank']}),
 ability('ramguard','Heavy shoulders','⚔','physical','Shield bashes deal 20% more damage and reach 10 units farther per rank.',g=>{g.stats.damage*=1.2;g.stats.range+=10},3,{classes:['tank']}),
 ability('consecrate','Consecration','✚','vitality','Every 5 seconds, strike a 115-unit area around a foe for 120% weapon damage per rank.',stat('consecrate',1),4,{classes:['healer']}),
 ability('dawn','Dawnfire','☼','fire','Radiant bolts gain 20 splash radius and 12% damage per rank.',g=>{g.stats.primarySplash+=20;g.stats.damage*=1.12},4,{classes:['healer']}),
 ability('mercy','Merciful ward','⬡','vitality','Sanctuary heals 3 more HP and your maximum shield grows by 5 per rank.',g=>{g.stats.mercy++;g.stats.shieldMax+=5},3,{classes:['healer']}),
 ability('feralreach','Feral reach','⋔','physical','Claws reach 20 units farther and deal 15% more damage per rank.',g=>{g.stats.range+=20;g.stats.damage*=1.15},3,{classes:['shapeshifter']}),
 ability('adaptation','Adaptation','◇','vitality','Gain 10 maximum HP and 6% dodge, capped at 42%.',g=>{g.stats.maxHealth+=10;g.health+=10;g.stats.evade=Math.min(.42,g.stats.evade+.06)},4,{classes:['shapeshifter']}),
 ability('wildbond','Wild bond','♞','companion','Your single companions deal 30% more damage per rank.',stat('petPower',1.3,true),3,{classes:['shapeshifter']}),
 ability('wideburst','Wide impact','◌','physical','Primary attacks gain 20 area radius per rank. Ranged attacks gain a splash explosion.',stat('primarySplash',20),4),
 ability('shockring','Pressure ring','⬢','lightning','Every 5 seconds, damage enemies within 180 units for 90% weapon damage per rank.',stat('shockring',1),4),

 ability('marksman','Eagle eye','⌖','physical','Direct hits deal 15% more damage per rank to enemies farther than 180 units away.',stat('marksman',.15),4,{classes:['archer']}),
 ability('barrage','Briar barrage','➶','nature','Every 4 seconds, fire a fan of 5 piercing arrows. Each deals 45% weapon damage per rank.',stat('barrage',1),3,{classes:['archer']}),
 ability('quiver','Endless quiver','↟','physical','Scattershot deals 25% more damage per rank. Its cooldown stays 5 seconds and range stays 360.',stat('volleyPower',.25),3,{classes:['archer']}),
 ability('ironwill','Surrounded resolve','⬡','vitality','Take 8% less damage per rank while at least 3 enemies are within 160 units.',stat('ironwill',.08),3,{classes:['fighter']}),
 ability('warcry','Lion’s roar','⚑','physical','Every 7 seconds, stun nearby foes for 0.8 seconds and deal 50% weapon damage per rank.',stat('warcry',1),3,{classes:['fighter']}),
 ability('tempest','Living tempest','⚔','physical','Iron cyclone lasts 0.4 seconds longer and reaches 15 units farther per rank.',stat('tempest',1),3,{classes:['fighter']}),
 ability('toxicblade','Black lotus','⚕','nature','Direct hits poison foes for 8 damage per second per rank for 4 seconds.',stat('toxicblade',1),4,{classes:['assassin']}),
 ability('shadowecho','Shadow echo','⋔','arcane','Every 3 seconds, a shadow cuts the nearest foe within 170 units for 140% weapon damage per rank.',stat('shadowecho',1),3,{classes:['assassin']}),
 ability('pursuit','Relentless pursuit','ϟ','physical','Each kill removes 0.25 seconds per rank from Shadowstep’s cooldown.',stat('pursuit',.25),3,{classes:['assassin']}),
 ability('shatter','Shatterglass','❆','frost','Deal 25% more direct damage per rank to frozen enemies.',stat('shatter',.25),3,{classes:['mage']}),
 ability('comet','Astral comet','✺','fire','Every 5 seconds, hurl a comet with a 110-unit blast for 150% elemental weapon damage per rank.',stat('comet',1),3,{classes:['mage']}),
 ability('arcanecycle','Arcane rhythm','✧','arcane','Glacial nova recharges 15% faster per rank.',stat('activeHaste',.85,true),3,{classes:['mage']}),
 ability('might','Heavy hand','✦','physical','Deal 22% more damage with weapons and abilities.',g=>{g.stats.damage*=1.22;g.stats.flatPower*=1.22}),
 ability('haste','Quickening','ϟ','physical','Primary attacks are 16% faster.',stat('interval',.84,true)),
 ability('stride','Ghost step','➶','arcane','Move 12% faster. Circle the horde and escape attacks.',stat('speed',1.12,true)),
 ability('vitality','Iron heart','♥','vitality','Gain 20 maximum health and immediately restore 10 health.',g=>{g.stats.maxHealth+=20;g.health=Math.min(g.stats.maxHealth,g.health+10)},5),
 ability('regen','Second wind','❋','vitality','Regenerate 0.2 health per second after 6 seconds without taking damage. Maximum 1 HP/s.',stat('regen',.2),5),
 ability('armor','Stone skin','⬡','vitality','Take 8% less damage. Additional ranks multiply.',stat('armor',.92,true),5),
 ability('wisdom','Old knowledge','◈','arcane','Earn 18% more XP from every monster, including bosses.',stat('xp',1.18,true)),
 ability('critical','Keen edge','✴','physical','Gain 8% critical chance, up to 75%. Critical hits deal double damage.',g=>g.stats.crit=Math.min(.75,g.stats.crit+.08),8),
 ability('critpower','Fatal precision','⌖','physical','Critical hits deal an additional 40% damage.',stat('critPower',.4)),
 ability('leech','Blood pact','♦','vitality','Recover 0.15 health per kill per rank. Kill-healing is limited to 0.8 HP/s.',stat('leech',.15),4),
 ability('evasion','Blur','≋','arcane','Gain 6% chance to evade attacks, up to 42%.',g=>g.stats.evade=Math.min(.42,g.stats.evade+.06),7),
 ability('thorns','Briar armor','✹','nature','Reflect 12 damage to enemies that touch you per rank.',stat('thorns',12)),
 ability('multishot','Split shot','⋔','physical','Fire one additional primary projectile. Archer and mage only.',stat('shots',1),5,{classes:['archer','mage']}),
 ability('pierce','Soul piercer','↟','physical','Primary projectiles pass through one more enemy. Archer only.',stat('pierce',1),5,{classes:['archer']}),
 ability('reach','Long shadow','⌁','physical','Increase melee reach and ranged targeting distance by 15%.',stat('range',1.15,true)),
 ability('cleave','Spectral cleaver','⚔','physical','A spectral sword sweeps around you every 1.7 seconds. Each rank adds damage.',stat('cleave',1),8),
 ability('orbit','Warden’s ring','◌','physical','Add a spirit blade that orbits you and cuts nearby enemies.',stat('orbits',1),6),
 ability('quake','Earthshatter','⬢','physical','Stomp every 4 seconds, damaging and stunning foes within 135 units.',stat('quake',1),6),
 ability('knockback','Crushing force','➤','physical','Your direct hits knock enemies back farther. Bosses resist the push.',stat('knockback',14),6),
 ability('berserk','Last stand','⚑','physical','Deal 30% more damage per rank while below half health.',stat('berserk',.3),6),
 ability('execution','Executioner','☠','physical','Deal 30% bonus damage per rank to foes below 30% health.',stat('execution',.3),6),
 ability('retaliation','Vengeful spirit','⟲','arcane','Taking damage releases a close-range shockwave. 2 second cooldown.',stat('retaliation',1),6),
 ability('shield','Ember ward','⬡','arcane','Gain a 15-point shield. Recharges at 2 points/s after 8 seconds without taking damage.',g=>{g.stats.shieldMax+=15;g.shield+=15},4),
 ability('recovery','Fresh resolve','✚','vitality','Restore 6 health now and on each future level-up per rank.',g=>{g.stats.recovery+=6;g.health=Math.min(g.stats.maxHealth,g.health+6)},3),
 ability('burn','Cinder touch','♨','fire','Direct hits ignite foes for 5 damage per second per rank for 3 seconds.',stat('burn',1),8),
 ability('fireaura','Flame mantle','☼','fire','Burn nearby foes every second in a 105-unit ring. Each rank adds damage.',stat('fireaura',1),8),
 ability('fireball','Falling star','✺','fire','Launch an extra explosive fireball every 3 seconds. Ranks increase blast damage.',stat('fireball',1),6),
 ability('explode','Funeral pyre','✹','fire','Defeated foes burst for 15 damage per rank in a small area. Can chain.',stat('explode',1),6),
 ability('frost','Chilling touch','❄','frost','Direct hits slow enemies by 35% for 2 seconds. Ranks extend the duration.',stat('frost',1),6),
 ability('nova','Winter’s breath','❆','frost','Release a frost nova every 6 seconds, damaging and freezing nearby foes.',stat('nova',1),6),
 ability('icelance','Glacial lance','↡','frost','Fire a piercing ice lance every 2.2 seconds. It freezes targets for 1 second.',stat('icelance',1),6),
 ability('chain','Stormcaller','ϟ','lightning','Lightning strikes every 3 seconds, jumping between 3 enemies. Ranks add a target.',stat('chain',1),8),
 ability('thunder','Thunderclap','☇','lightning','Every 5 seconds strike a marked area around an enemy, stunning nearby foes.',stat('thunder',1),6),
 ability('venom','Serpent’s gift','⚕','nature','Direct hits poison enemies for 4 damage per second per rank for 4 seconds.',stat('venom',1),8),
 ability('roots','Grasping roots','♧','nature','Every 5 seconds root and damage enemies near you. Ranks increase duration.',stat('roots',1),6),
 ability('crossbow','Phantom bow','➶','physical','A spectral crossbow fires independently every 1.4 seconds. All classes can use it.',stat('crossbow',1),6),
 ability('petpower','Kindred bond','∞','companion','Your companions deal 25% more damage.',stat('petPower',1.25,true)),
 ability('petspeed','Pack instinct','➶','companion','Companions attack 20% faster.',stat('petHaste',.8,true)),
 ability('wolf','Moonfang','♞','companion','One wolf bites independent targets for 120% weapon damage. Further ranks boost its damage by 45% of base and attack speed by 6%.',g=>summonPet(g,'wolf'),5),
 ability('stormpet','Storm sprite','ϟ','companion','One sprite chains lightning through 3 targets for 100% weapon damage. Further ranks boost damage and attack speed.',g=>summonPet(g,'stormpet'),5),
 ability('frostpet','Frost owl','❄','companion','One owl fires freezing shards for 100% weapon damage. Further ranks boost damage and attack speed.',g=>summonPet(g,'frostpet'),5),
 ability('firepet','Cinder drake','♨','companion','One drake fires explosive fireballs for 120% weapon damage. Further ranks boost damage and attack speed.',g=>summonPet(g,'firepet'),5),
 ability('healerpet','Dew sprite','✚','companion','One gentle sprite restores exactly 0.1 HP per second. No damage. One rank; healing cannot be amplified.',g=>summonPet(g,'healerpet'),1),
 ability('slowpet','Hourglass moth','⌛','companion','One moth slows hostile projectiles by 35% within 145 units of the hero. Ranks add 25 radius and 10% slowing, up to 55%.',g=>summonPet(g,'slowpet'),3),
 ability('guardianpet','Lastlight','♢','companion','One guardian absorbs one fatal hit and dies instead of you. It never attacks and cannot return during this run.',g=>summonPet(g,'guardianpet'),1)
];
export const monsters={
 walker:{cost:1,name:'Hollow',hp:30,r:14,speed:64,damage:14,xp:3,color:'#a8bd82',behavior:'chase',description:'A relentless melee pursuer.'},
 bat:{cost:1.5,name:'Nightwing',hp:19,r:10,speed:138,damage:10,xp:2,color:'#bd9bcf',behavior:'chase',description:'Fast, fragile, and hard to outrun.'},
 brute:{cost:4,name:'Ironhide',hp:120,r:23,speed:44,damage:25,xp:9,color:'#bbc29c',behavior:'chase',armor:.25,description:'Armored. Resists 25% of incoming damage.'},
 ranger:{cost:3,name:'Bone archer',hp:46,r:14,speed:64,damage:17,xp:6,color:'#e3c28e',behavior:'ranger',description:'Keeps its distance and shoots arrows.'},
 spitter:{cost:5,name:'Blight spitter',hp:65,r:17,speed:50,damage:15,xp:8,color:'#b4d76c',behavior:'spitter',description:'Lobs poison that leaves dangerous pools.'},
 charger:{cost:4,name:'Briar ram',hp:84,r:18,speed:70,damage:22,xp:7,color:'#db9a7e',behavior:'charger',description:'Telegraphs a charge, then dashes at you.'},
 shaman:{cost:7,name:'Grave caller',hp:90,r:16,speed:42,damage:16,xp:12,color:'#bfa0e4',behavior:'summoner',description:'Summons new hollows while keeping its distance.'},
 wraith:{cost:5,name:'Pale wraith',hp:58,r:14,speed:102,damage:18,xp:10,color:'#8bd5d6',behavior:'wraith',description:'Phases swiftly forward before striking.'},
 ravager:{cost:18,name:'Thorn Ravager',hp:300,r:29,speed:56,damage:23,xp:45,color:'#e6a57b',behavior:'ravager',mini:true,description:'Miniboss. Repeated telegraphed charges.'},
 broodmother:{cost:20,name:'The Broodmother',hp:340,r:30,speed:35,damage:20,xp:50,color:'#c4b277',behavior:'broodmother',mini:true,description:'Miniboss. Breeds nightwings and spits venom.'},
 hexer:{cost:22,name:'The Mire Hexer',hp:310,r:27,speed:40,damage:20,xp:55,color:'#c5a8e4',behavior:'hexer',mini:true,description:'Miniboss. Marks your position with cursed pools.'},
 warden:{cost:42,name:'The Stone Warden',hp:1000,r:40,speed:38,damage:30,xp:130,color:'#e2c089',behavior:'warden',boss:true,description:'Boss. Charges and unleashes wide ground slams.'},
 frostking:{cost:46,name:'The Frost Revenant',hp:850,r:34,speed:44,damage:23,xp:150,color:'#a2deef',behavior:'frostking',boss:true,description:'Boss. Radial ice volleys and freezing zones.'},
 dragon:{cost:54,name:'The Ashen Dragon',hp:1150,r:43,speed:42,damage:30,xp:180,color:'#f1a07b',behavior:'dragon',boss:true,description:'Boss. Fans of fire and persistent burning ground.'}
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function createGame(seed=Date.now(),classId='archer'){
 let s=seed>>>0;const random=()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296};
 const hero=classes.find(c=>c.id===classId)||classes[0];
 const stats={damage:24,interval:.65,speed:190,maxHealth:100,regen:0,shots:1,pierce:0,orbits:0,nova:0,armor:1,xp:1,range:320,projectileSpeed:450,radius:80,crit:.05,critPower:2,leech:0,evade:0,thorns:0,cleave:0,quake:0,knockback:0,berserk:0,execution:0,retaliation:0,shieldMax:0,recovery:0,burn:0,fireaura:0,fireball:0,explode:0,frost:0,icelance:0,chain:0,thunder:0,venom:0,roots:0,crossbow:0,elemental:1,flatPower:1,petPower:1,petHaste:1,classRegen:0,volleyPower:1,primarySplash:0,seismic:0,consecrate:0,mercy:0,shockring:0,marksman:0,barrage:0,activeHaste:1,ironwill:0,warcry:0,tempest:0,toxicblade:0,shadowecho:0,pursuit:0,shatter:0,comet:0,...hero.stats};
 return{random,classId:hero.id,status:'ready',time:0,x:0,y:0,facing:1,health:stats.maxHealth,shield:stats.shieldMax,level:1,xp:0,nextXP:9,kills:0,bossKills:0,miniKills:0,wave:1,nextBoss:120,nextMini:45,bossIndex:0,miniIndex:0,enemies:[],bullets:[],enemyBullets:[],hazards:[],pets:[],effects:[],numbers:[],build:{},choices:[],stats,attack:0,spawn:0,invulnerable:0,slow:0,lastDamage:-10,id:0,targetId:null,clocks:{},deathQueue:[],announcement:'',announcementLife:0,activeCooldown:0,activeTime:0,activeClock:0,activeDash:null,activeHits:new Set(),attackAnim:0,walk:0,moving:false,aimAngle:0,hitFlash:0,healBudget:.8,totalDamageTaken:0,levelGuard:0,audioEvents:[],pendingElites:[],absorbed:{},form:null,guardianSpent:false,visualTokens:10,nextDamageNumber:0};
}
export function rollChoices(g){
 const pool=talents.filter(t=>t.kind!=='active'&&!(t.id==='guardianpet'&&g.guardianSpent)&&!(t.id==='evasion'&&g.stats.evade>=.42)&&!(t.id==='critical'&&g.stats.crit>=.75)&&(!t.max||(g.build[t.id]||0)<t.max)&&(!t.classes||t.classes.includes(g.classId))),picks=[];
 const pick=options=>{if(options.length){const t=options[Math.floor(g.random()*options.length)];picks.push(t.id);pool.splice(pool.indexOf(t),1)}};
 if(g.level===2)pick(pool.filter(t=>['wolf','stormpet','frostpet','firepet'].includes(t.id)));
 pick(pool.filter(t=>t.classes?.includes(g.classId)));
 while(picks.length<3&&pool.length)pick(pool);
 return picks;
}
export function chooseUpgrade(g,id){if(g.status!=='levelup'||!g.choices.includes(id))return false;const t=talents.find(t=>t.id===id);if(!t||t.kind!=='passive'||t.classes&&!t.classes.includes(g.classId))return false;t.apply(g);g.build[id]=(g.build[id]||0)+1;g.choices=[];g.status='playing';g.levelGuard=2;checkLevel(g);return true}
function checkLevel(g){if(g.xp>=g.nextXP){g.xp-=g.nextXP;g.level++;g.nextXP=Math.round(g.nextXP*1.16+5);g.health=Math.min(g.stats.maxHealth,g.health+g.stats.recovery);g.status='levelup';g.choices=rollChoices(g)}}
export const petKinds=['wolf','stormpet','frostpet','firepet','healerpet','slowpet','guardianpet'];
export function summonPet(g,kind){
 if(!petKinds.includes(kind)||(kind==='guardianpet'&&g.guardianSpent))return null;
 const existing=g.pets.find(p=>p.kind===kind);if(existing){existing.rank=Math.min(kind==='healerpet'||kind==='guardianpet'?1:kind==='slowpet'?3:5,existing.rank+1);return existing}
 const pet={id:++g.id,kind,rank:1,x:g.x+30,y:g.y+30,cooldown:.1,targetId:null};g.pets.push(pet);return pet;
}
export const essences={
 ravager:{name:'Ravager instinct',description:'+8% movement speed, +5% critical chance and a close-range predatory strike.'},
 broodmother:{name:'Brood venom',description:'Poisonous direct hits and a periodic venom pulse around you.'},
 hexer:{name:'Mire curse',description:'A cursed area periodically damages and slows a distant foe and its neighbors.'},
 warden:{name:'Granite hide',description:'15% less incoming damage, +20 maximum health and periodic stunning ground slams.'},
 frostking:{name:'Winter soul',description:'Chilling direct hits and periodic freezing novas.'},
 dragon:{name:'Ashen heart',description:'Burning hits, a flame aura and additional explosive fireballs.'}
};
function absorbElite(g,e){if(g.classId!=='shapeshifter'||!essences[e.kind])return;g.absorbed[e.kind]=(g.absorbed[e.kind]||0)+1;g.form=e.kind;g.stats.damage*=1.15;g.stats.flatPower*=1.1;
 if(e.kind==='ravager'){g.stats.speed*=1.08;g.stats.crit=Math.min(.75,g.stats.crit+.05)}
 if(e.kind==='broodmother')g.stats.venom++;
 if(e.kind==='warden'){g.stats.armor*=.85;g.stats.maxHealth+=20;g.health=Math.min(g.stats.maxHealth,g.health+20);g.stats.quake++}
 if(e.kind==='frostking'){g.stats.frost++;g.stats.nova++}
 if(e.kind==='dragon'){g.stats.burn++;g.stats.fireaura++;g.stats.fireball++}
 g.announcement='ABSORBED · '+essences[e.kind].name+' · Rank '+g.absorbed[e.kind];g.announcementLife=5;
}
export function constrain(entity,r=14){entity.x=clamp(entity.x,MAP.left+r,MAP.right-r);entity.y=clamp(entity.y,MAP.top+r,MAP.bottom-r);for(const o of MAP.obstacles){let dx=entity.x-o.x,dy=entity.y-o.y,d=Math.hypot(dx,dy);if(d<r+o.r){if(d<.001){dx=1;dy=0;d=1}entity.x=o.x+dx/d*(r+o.r);entity.y=o.y+dy/d*(r+o.r)}}}
export const MAX_ENEMIES=96;
export const threatBudget=g=>Math.floor(18+Math.max(0,g.time)*.45);
export const liveThreat=g=>g.enemies.reduce((sum,e)=>sum+(e.hp>0?(e.cost??monsters[e.kind]?.cost??1):0),0);
function reservedThreat(g){
 if(g.pendingElites.length)return Math.max(...g.pendingElites.map(p=>monsters[p.kind].cost));
 const boss=g.nextBoss-g.time,mini=g.nextMini-g.time;
 if(boss<=10&&boss<=mini)return Math.min(threatBudget(g)*.6,monsters[['warden','frostking','dragon'][g.bossIndex%3]].cost);
 if(mini<=8)return Math.min(threatBudget(g)*.6,monsters[['ravager','broodmother','hexer'][g.miniIndex%3]].cost);
 return 0;
}
export function trySpawnEnemy(g,kind,position,elite=false){
 const def=monsters[kind];if(!def)return null;
 const living=g.enemies.filter(e=>e.hp>0);if(living.length>=MAX_ENEMIES||liveThreat(g)+def.cost+(elite?0:reservedThreat(g))>threatBudget(g)+1e-8)return null;
 return spawnEnemy(g,kind,position);
}
function updateDirector(g,dt){
 const schedule=(kind,category)=>{if(!g.pendingElites.some(p=>p.category===category))g.pendingElites.push({kind,category});};
 if(g.time+1e-7>=g.nextMini){schedule(['ravager','broodmother','hexer'][g.miniIndex++%3],'mini');g.nextMini+=45}
 if(g.time+1e-7>=g.nextBoss){schedule(['warden','frostking','dragon'][g.bossIndex++%3],'boss');g.nextBoss+=120}
 g.pendingElites.sort((a,b)=>(b.category==='boss')-(a.category==='boss'));
 if(g.pendingElites.length){const pending=g.pendingElites[0],e=trySpawnEnemy(g,pending.kind,undefined,true);if(e){g.pendingElites.shift();soundEvent(g,'boss');g.announcement=(e.boss?'BOSS':'MINIBOSS')+' · '+e.name;g.announcementLife=4}}
 // At capacity, keep at most one spawn token: clearing the horde never releases a backlog.
 g.spawn=Math.min(1.5,g.spawn+dt*(.95+g.time*.025+g.wave*.07));
 if(g.spawn<1||g.pendingElites.length)return;
 const room=threatBudget(g)-liveThreat(g)-reservedThreat(g),pool=['walker','walker'];
 if(g.time>12)pool.push('bat');if(g.time>22)pool.push('ranger');if(g.time>32)pool.push('charger');if(g.time>38)pool.push('brute');if(g.time>42)pool.push('spitter');if(g.time>65)pool.push('shaman','wraith');if(g.time>150)pool.push('brute','charger','spitter');if(g.time>300)pool.push('shaman','wraith','brute');
 const eligible=pool.filter(kind=>monsters[kind].cost<=room);if(eligible.length){const kind=eligible[Math.floor(g.random()*eligible.length)];if(trySpawnEnemy(g,kind))g.spawn--}
}
// Low-level scenario constructor; gameplay enters through trySpawnEnemy.
export function spawnEnemy(g,kind,position){if(kind===true)kind=['warden','frostking','dragon'][g.bossIndex++%3];if(!kind){const pool=['walker','walker'];if(g.time>12)pool.push('bat');if(g.time>22)pool.push('ranger');if(g.time>32)pool.push('charger');if(g.time>38)pool.push('brute');if(g.time>42)pool.push('spitter');if(g.time>65)pool.push('shaman','wraith');kind=pool[Math.floor(g.random()*pool.length)]}const def=monsters[kind]||monsters.walker;if(!monsters[kind])kind='walker';let x,y;if(position){({x,y}=position)}else{let chosen;for(let i=0;i<24;i++){const a=g.random()*Math.PI*2,r=380+g.random()*160;chosen={x:clamp(g.x+Math.cos(a)*r,MAP.left+45,MAP.right-45),y:clamp(g.y+Math.sin(a)*r,MAP.top+45,MAP.bottom-45)};if(distance(chosen,g)>290)break}({x,y}=chosen)}const hp=def.hp*(1+g.time/165);const e={...def,damage:def.damage*(1+g.time/400),id:++g.id,kind,x,y,hp,maxHP:hp,speed:def.speed*(1+Math.min(g.time/1500,.6)),hit:0,slow:0,freeze:0,stun:0,burn:0,poison:0,burnPower:0,poisonPower:0,orbitHit:0,cooldown:1+g.random(),special:3+g.random()*2,telegraph:0,dash:0,dx:0,dy:0,walk:0,attackAnim:0,aimAngle:0,windup:0,shotKind:'arrow',contactWindup:0,meleeCooldown:0};constrain(e,e.r);g.enemies.push(e);return e}
function soundEvent(g,kind){if(g.audioEvents.length<24)g.audioEvents.push(kind)}
// No cosmetic animation allocations: combat uses static sprites and persistent warning geometry.
function damageHero(g,amount,source){if(g.status!=='playing'||(g.invulnerable>0||g.levelGuard>0))return false;if(g.random()<g.stats.evade){g.invulnerable=.2;return false}let damage=amount*g.stats.armor*(g.stats.ironwill&&g.enemies.filter(e=>e.hp>0&&distance(e,g)<160).length>=3?1-g.stats.ironwill:1)*(g.classId==='fighter'&&g.activeTime>0?.6:g.classId==='tank'&&g.activeTime>0?.4:1),absorbed=Math.min(g.shield,damage);damage-=absorbed;
 if(damage>=g.health){const guardian=g.pets.find(p=>p.kind==='guardianpet');if(guardian){g.pets=g.pets.filter(p=>p!==guardian);g.guardianSpent=true;g.invulnerable=1;g.announcement='LASTLIGHT SACRIFICED · Fatal hit prevented';g.announcementLife=4;soundEvent(g,'active');return false}}
 g.shield-=absorbed;g.health-=damage;soundEvent(g,'hurt');g.lastDamage=g.time;g.totalDamageTaken+=damage;g.hitFlash=.4;g.invulnerable=.38;if(source&&g.stats.thorns)hurtEnemy(g,source,g.stats.thorns*g.stats.flatPower,{direct:false});if(g.stats.retaliation&&tick(g,'retaliation',2,0)){area(g,g.x,g.y,140,g.stats.damage*g.stats.retaliation,{direct:false},'#a7d7d1')}return true}
export function hurtEnemy(g,e,amount,opts={}){if(e.hp<=0)return;let damage=amount*(1-(e.armor||0));if(opts.direct!==false){if(g.stats.marksman&&distance(e,g)>180)damage*=1+g.stats.marksman;if(g.stats.shatter&&e.freeze>0)damage*=1+g.stats.shatter;if(g.stats.toxicblade){e.poison=4;e.poisonPower=Math.max(e.poisonPower,8*g.stats.toxicblade*g.stats.flatPower)}if(g.random()<g.stats.crit)damage*=g.stats.critPower;if(g.health<g.stats.maxHealth*.5)damage*=1+g.stats.berserk;if(e.hp<e.maxHP*.3)damage*=1+g.stats.execution;if(g.stats.burn){e.burn=3;e.burnPower=Math.max(e.burnPower,5*g.stats.burn*g.stats.elemental*g.stats.flatPower)}if(g.stats.venom){e.poison=4;e.poisonPower=Math.max(e.poisonPower,4*g.stats.venom*g.stats.flatPower)}if(g.stats.frost)e.slow=Math.max(e.slow,2+(g.stats.frost-1)*.3);if(g.stats.knockback){const d=distance(e,g)||1,push=g.stats.knockback*((e.boss||e.mini)? .2:1);e.x+=(e.x-g.x)/d*push;e.y+=(e.y-g.y)/d*push;constrain(e,e.r)}}if(opts.freeze)e.freeze=Math.max(e.freeze,opts.freeze*(e.boss?.25:1));if(opts.slow)e.slow=Math.max(e.slow,opts.slow);if(opts.stun)e.stun=Math.max(e.stun,opts.stun*(e.boss?.25:1));if(opts.burn){e.burn=3;e.burnPower=Math.max(e.burnPower,opts.burn)}e.hp-=damage;e.hit=.1;if(e.hp<=0){g.kills++;g.activeCooldown=Math.max(0,g.activeCooldown-g.stats.pursuit);soundEvent(g,'kill');g.bossKills+=e.boss?1:0;g.miniKills+=e.mini?1:0;g.xp+=e.xp*g.stats.xp;const healing=Math.min(g.stats.leech,g.healBudget);g.health=Math.min(g.stats.maxHealth,g.health+healing);g.healBudget-=healing;if(e.boss||e.mini){g.announcement=`${e.name} defeated · +${Math.round(e.xp*g.stats.xp)} XP`;g.announcementLife=4;absorbElite(g,e)}if(g.stats.explode)g.deathQueue.push({x:e.x,y:e.y,damage:15*g.stats.explode*g.stats.elemental*g.stats.flatPower})}}
function area(g,x,y,r,damage,opts={},color='#ecc18a'){for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-x,e.y-y)<r+e.r)hurtEnemy(g,e,damage,opts)}
function nearest(g,origin,range=Infinity,exclude=null){let target=null,best=range*range;for(const e of g.enemies){if(e.hp<=0||e.id===exclude)continue;const dx=e.x-origin.x,dy=e.y-origin.y,d=dx*dx+dy*dy;if(d<best){best=d;target=e}}return target}
function shoot(g,origin,target,damage,kind='arrow',extra={}){const a=Math.atan2(target.y-origin.y,target.x-origin.x)+(extra.angle||0);soundEvent(g,kind==='arrow'||kind==='volley'?'bow':'spell');g.bullets.push({x:origin.x,y:origin.y,vx:Math.cos(a)*(extra.speed||450),vy:Math.sin(a)*(extra.speed||450),life:2.1,damage,kind,left:extra.pierce===undefined?1:extra.pierce+1,hits:new Set(),...extra})}
function lightning(g,origin,first,damage,jumps=3){let target=first,from=origin,used=new Set();for(let i=0;target&&i<jumps;i++){used.add(target.id);hurtEnemy(g,target,damage,{color:'#f4df8b'});from=target;let closest=null,best=180;for(const e of g.enemies){const d=distance(e,from);if(e.hp>0&&!used.has(e.id)&&d<best){closest=e;best=d}}target=closest}}
function tick(g,key,period,dt){g.clocks[key]=(g.clocks[key]??0)-dt;if(g.clocks[key]<=0){g.clocks[key]=period;return true}return false}
function hazard(g,x,y,r,damage,color,delay=.9,duration=.4,slow=false){g.hazards.push({x,y,r,damage,color,delay,life:duration,max:duration,slow,enemy:true})}
function hostileShot(g,e,angle,kind='arrow',speed=225){if(g.enemyBullets.length>=220)return;soundEvent(g,'hostile');g.enemyBullets.push({x:e.x,y:e.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:kind==='poison'?Math.min(4,distance(e,g)/speed):4,damage:e.damage,kind,r:kind==='poison'?10:7,color:kind==='ice'?'#54ecff':kind==='fire'?'#ff5a37':kind==='poison'?'#b6ff38':'#ff536e'})}
function summonFoes(g,e,kind,count){for(let i=0;i<count&&g.enemies.length<400;i++){const a=i/count*Math.PI*2;trySpawnEnemy(g,kind,{x:e.x+Math.cos(a)*60,y:e.y+Math.sin(a)*60})}}
function updateEnemy(g,e,dt){e.attackAnim=Math.max(0,e.attackAnim-dt);e.meleeCooldown-=dt;e.hit=Math.max(0,e.hit-dt);e.slow=Math.max(0,e.slow-dt);e.freeze=Math.max(0,e.freeze-dt);e.stun=Math.max(0,e.stun-dt);e.orbitHit=Math.max(0,e.orbitHit-dt);if(e.burn>0){e.burn-=dt;hurtEnemy(g,e,e.burnPower*dt,{direct:false})}if(e.poison>0){e.poison-=dt;hurtEnemy(g,e,e.poisonPower*dt,{direct:false})}if(e.hp<=0)return;e.cooldown-=dt;e.special-=dt;const dx=g.x-e.x,dy=g.y-e.y,d=Math.hypot(dx,dy)||1,angle=Math.atan2(dy,dx);if(e.freeze>0||e.stun>0)return;
 if(e.windup>0){e.windup-=dt;if(e.windup<=0){hostileShot(g,e,e.aimAngle,e.shotKind,e.shotKind==='poison'?170:225);e.attackAnim=.28}}let movement=e.windup>0?0:1;if(['ranger','spitter','summoner','hexer','frostking'].includes(e.behavior))movement=e.windup>0?0:d<200?-1:d<290?0:1;
 if(e.telegraph>0){e.telegraph-=dt;movement=0;if(e.telegraph<=0){e.dash=.65;}}
 if(e.dash>0){e.dash-=dt;e.x+=e.dx*430*dt;e.y+=e.dy*430*dt}else{const speed=e.speed*(e.slow>0?.65:1)*(e.behavior==='wraith'&&Math.sin(g.time*1.7+e.id)>0?1.65:1);e.x+=dx/d*speed*movement*dt;e.y+=dy/d*speed*movement*dt}
 constrain(e,e.r);if(e.contactWindup>0){e.contactWindup-=dt;if(e.contactWindup<=0){if(distance(e,g)<e.r+28)damageHero(g,e.damage,e)}}if(d<e.r+30&&e.meleeCooldown<=0){e.contactWindup=.2;e.meleeCooldown=e.kind==='bat'?.6:.85;e.attackAnim=.45;e.aimAngle=angle}if(e.dash>0&&distance(e,g)<e.r+18)damageHero(g,e.damage*1.15,e);
 if(e.cooldown<=0&&e.windup<=0&&d<580){e.attackAnim=.35;e.aimAngle=angle;switch(e.behavior){case'ranger':e.windup=.42;e.shotKind='arrow';e.cooldown=2.3;break;case'spitter':e.windup=.6;e.shotKind='poison';e.cooldown=3.1;break;case'summoner':summonFoes(g,e,'walker',2);e.cooldown=7;break;case'broodmother':summonFoes(g,e,'bat',3);hostileShot(g,e,angle,'poison',160);e.cooldown=4.5;break;case'hexer':hazard(g,g.x,g.y,78,e.damage,'#bd95de',1.1,3);e.cooldown=3.5;break;case'warden':hazard(g,e.x,e.y,195,e.damage*1.3,'#e5be84',1.15,.45);e.cooldown=4.5;break;case'frostking':for(let i=0;i<12;i++)hostileShot(g,e,i/12*Math.PI*2+g.time*.2,'ice',155);e.cooldown=3.3;break;case'dragon':for(let i=-2;i<=2;i++)hostileShot(g,e,angle+i*.2,'fire',180);e.cooldown=2.5;break}}
 if(e.special<=0){if(['charger','ravager','warden'].includes(e.behavior)&&d<650){e.dx=dx/d;e.dy=dy/d;e.telegraph=e.behavior==='charger'?.8:1.1;e.special=e.behavior==='ravager'?3.5:6}else if(e.behavior==='frostking'){hazard(g,g.x,g.y,100,e.damage,'#8ed5f1',1.1,4,true);e.special=7}else if(e.behavior==='dragon'){for(let i=0;i<3;i++)hazard(g,g.x+(i-1)*105,g.y+Math.sin(i)*70,80,e.damage*.8,'#e99965',1,4);e.special=7}else e.special=4}
}
function updatePets(g,dt){for(let i=0;i<g.pets.length;i++){
 const p=g.pets[i];p.cooldown-=dt;const support=['healerpet','slowpet','guardianpet'].includes(p.kind);
 let target=support?null:g.enemies.find(e=>e.id===p.targetId&&e.hp>0&&distance(e,g)<650);
 if(!support&&!target)target=nearest(g,p,600,g.targetId)||nearest(g,p,600);p.targetId=target?.id??null;
 const melee=p.kind==='wolf',angle=i/Math.max(1,g.pets.length)*Math.PI*2;
 let aim=melee&&target?target:{x:g.x+Math.cos(angle)*48,y:g.y+Math.sin(angle)*48};if(distance(p,g)>650)aim=g;
 const d=distance(p,aim)||1;if(d>5){const speed=(melee?290:260)+(p.rank-1)*12;p.x+=(aim.x-p.x)/d*Math.min(d,speed*dt);p.y+=(aim.y-p.y)/d*Math.min(d,speed*dt)}constrain(p,7);
 if(p.kind==='healerpet'){g.health=Math.min(g.stats.maxHealth,g.health+.1*dt);continue}if(support||!target||p.cooldown>0)continue;
 const power=(1+.45*(p.rank-1)),haste=g.stats.petHaste*.94**(p.rank-1),damage=Math.max(18,g.stats.damage)*g.stats.petPower*power*(melee?1:g.stats.elemental);
 if(melee&&distance(p,target)<target.r+25){hurtEnemy(g,target,damage*1.2,{color:'#c4dca4'});p.cooldown=.7*haste}
 else if(!melee&&distance(p,target)<550){if(p.kind==='stormpet'){lightning(g,p,target,damage,3);p.cooldown=2*haste}else if(p.kind==='frostpet'){shoot(g,p,target,damage,'ice',{freeze:1.2,color:'#91d7f4'});p.cooldown=1.3*haste}else{shoot(g,p,target,damage*1.2,'fire',{splash:65,burn:10*g.stats.petPower*power*g.stats.flatPower*g.stats.elemental,color:'#ffac7e'});p.cooldown=1.8*haste}}
}}
function updateAbilities(g,dt){const s=g.stats;
 if(s.seismic&&tick(g,'seismic',4,dt))area(g,g.x,g.y,185,s.damage*s.seismic,{stun:.3});
 if(s.shockring&&tick(g,'shockring',5,dt))area(g,g.x,g.y,180,s.damage*.9*s.shockring,{});
 const marked=nearest(g,g,500);if(marked&&s.consecrate&&tick(g,'consecrate',5,dt))area(g,marked.x,marked.y,115,s.damage*1.2*s.consecrate,{});
 if(g.absorbed.ravager&&tick(g,'aspect-ravager',5,dt))area(g,g.x,g.y,175,s.damage*1.2*g.absorbed.ravager,{});
 if(g.absorbed.broodmother&&tick(g,'aspect-brood',3,dt))area(g,g.x,g.y,160,s.damage*.7*g.absorbed.broodmother,{direct:false});
 if(marked&&g.absorbed.hexer&&tick(g,'aspect-hexer',6,dt))area(g,marked.x,marked.y,100,s.damage*g.absorbed.hexer,{slow:3});

 if(s.warcry&&tick(g,'warcry',7,dt)){area(g,g.x,g.y,180,s.damage*.5*s.warcry,{stun:.8},'#ffdb9c');soundEvent(g,'roar')}
 const echo=nearest(g,g,170);if(s.shadowecho&&echo&&tick(g,'shadowecho',3,dt)){hurtEnemy(g,echo,s.damage*1.4*s.shadowecho);soundEvent(g,'slash')}
 const far=nearest(g,g,500);if(far&&s.barrage&&tick(g,'barrage',4,dt))for(let i=-2;i<=2;i++)shoot(g,g,far,s.damage*.45*s.barrage,'arrow',{angle:i*.15,pierce:2});
 if(far&&s.comet&&tick(g,'comet',5,dt))shoot(g,g,far,s.damage*1.5*s.comet*s.elemental,'fire',{splash:110,burn:10*s.comet*s.elemental});
for(let i=0;i<s.orbits;i++){const a=g.time*2.5+i*Math.PI*2/s.orbits,x=g.x+Math.cos(a)*s.radius,y=g.y+Math.sin(a)*s.radius;for(const e of g.enemies)if(e.hp>0&&e.orbitHit<=0&&Math.hypot(e.x-x,e.y-y)<e.r+12){e.orbitHit=.35;hurtEnemy(g,e,s.damage*.7)}}
 if(s.cleave&&tick(g,'cleave',1.7,dt))area(g,g.x,g.y,110,s.damage*(.6+.35*s.cleave),{},'#eac28f');
 if(s.quake&&tick(g,'quake',4,dt))area(g,g.x,g.y,135,s.damage*(.7+.35*s.quake),{stun:.7},'#d7c89b');
 if(s.fireaura&&tick(g,'fireaura',1,dt))area(g,g.x,g.y,105,8*s.fireaura*s.elemental*s.flatPower,{direct:false,burn:4*s.fireaura*s.flatPower*s.elemental},'#ed9870');
 if(s.nova&&tick(g,'nova',6,dt))area(g,g.x,g.y,170,s.damage*(.7+.25*s.nova)*s.elemental,{freeze:1.5+s.nova*.2},'#91d7f4');
 if(s.roots&&tick(g,'roots',5,dt))area(g,g.x,g.y,160,12*s.roots*s.flatPower,{stun:1+s.roots*.25},'#a8cf87');
 const target=nearest(g,g,500);if(target){if(s.chain&&tick(g,'chain',3,dt))lightning(g,g,target,s.damage*.8*s.elemental,2+s.chain);if(s.thunder&&tick(g,'thunder',5,dt)){area(g,target.x,target.y,100,s.damage*s.thunder*s.elemental,{stun:.8},'#f1dc81');}if(s.crossbow&&tick(g,'crossbow',1.4,dt))shoot(g,g,target,s.damage*(.5+s.crossbow*.3),'arrow');if(s.fireball&&tick(g,'fireball',3,dt))shoot(g,g,target,s.damage*(.7+s.fireball*.3)*s.elemental,'fire',{splash:85,burn:6*s.fireball*s.flatPower*s.elemental});if(s.icelance&&tick(g,'icelance',2.2,dt))shoot(g,g,target,s.damage*(.5+s.icelance*.3)*s.elemental,'ice',{pierce:3,freeze:1})}}
function segmentDistance(x,y,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(x-ax-t*dx,y-ay-t*dy)}
export function step(g,dt,input={x:0,y:0}){if(g.status!=='playing'||!Number.isFinite(dt)||dt<=0)return;dt=Math.min(dt,.05);g.time+=dt;if(g.stats.classRegen)g.health=Math.min(g.stats.maxHealth,g.health+g.stats.classRegen*dt);g.levelGuard=Math.max(0,g.levelGuard-dt);g.activeCooldown=Math.max(0,g.activeCooldown-dt);g.activeTime=Math.max(0,g.activeTime-dt);g.attackAnim=Math.max(0,g.attackAnim-dt);g.hitFlash=Math.max(0,g.hitFlash-dt);g.healBudget=Math.min(.8,g.healBudget+.8*dt);if(g.clocks.retaliation>0)g.clocks.retaliation-=dt;g.wave=1+Math.floor(g.time/30);g.announcementLife=Math.max(0,g.announcementLife-dt);g.invulnerable=Math.max(0,g.invulnerable-dt);g.slow=Math.max(0,g.slow-dt);if(g.time-g.lastDamage>=6)g.health=Math.min(g.stats.maxHealth,g.health+Math.min(1,g.stats.regen)*dt);if(g.time-g.lastDamage>=8)g.shield=Math.min(g.stats.shieldMax,g.shield+2*dt);
 let mx=Number.isFinite(input.x)?input.x:0,my=Number.isFinite(input.y)?input.y:0,len=Math.hypot(mx,my);if(len>1){mx/=len;my/=len}const oldX=g.x,oldY=g.y;const speed=g.stats.speed*(g.slow>0?.65:1);if(!g.activeDash){g.x+=mx*speed*dt;g.y+=my*speed*dt}constrain(g,18);g.moving=Math.hypot(g.x-oldX,g.y-oldY)>.1;g.walk+=Math.hypot(g.x-oldX,g.y-oldY)*.08;if(mx)g.facing=mx>0?1:-1;if(mx||my)g.aimAngle=Math.atan2(my,mx);updateActive(g,dt);
 updateDirector(g,dt);
 const grid=new Map(),cell=80;for(const e of [...g.enemies]){updateEnemy(g,e,dt);if(e.hp<=0)continue;const k=`${Math.floor(e.x/cell)},${Math.floor(e.y/cell)}`;if(!grid.has(k))grid.set(k,[]);grid.get(k).push(e)}
 g.attack-=dt;const target=nearest(g,g,g.stats.range);g.targetId=target?.id??null;if(target)g.aimAngle=Math.atan2(target.y-g.y,target.x-g.x);if(target&&g.attack<=0){g.attackAnim=.25;if(['fighter','assassin','tank','shapeshifter'].includes(g.classId))soundEvent(g,'slash');g.attack=Math.max(.09,g.stats.interval);if(['fighter','assassin','tank','shapeshifter'].includes(g.classId)){const radius=g.stats.range+g.stats.primarySplash;area(g,g.x,g.y,radius,g.stats.damage,{},classes.find(c=>c.id===g.classId).color);}else{for(let i=0;i<g.stats.shots;i++)shoot(g,g,target,g.stats.damage*(g.classId==='mage'?g.stats.elemental:1),g.classId==='mage'?'fire':g.classId==='healer'?'holy':'arrow',{angle:(i-(g.stats.shots-1)/2)*.14,pierce:g.stats.pierce,splash:(g.classId==='mage'?58:g.classId==='healer'?80:0)+g.stats.primarySplash,burn:g.classId==='mage'?5:0})}}
 updatePets(g,dt);updateAbilities(g,dt);
 for(const b of g.bullets){const ax=b.x,ay=b.y,travel=Math.hypot(b.vx,b.vy)*dt,ratio=b.maxRange===undefined?1:Math.min(1,Math.max(0,b.maxRange-(b.travel||0))/(travel||1));b.x+=b.vx*dt*ratio;b.y+=b.vy*dt*ratio;b.travel=(b.travel||0)+travel*ratio;b.life-=dt;if(b.maxRange!==undefined&&b.travel>=b.maxRange-1e-7)b.life=0;const minX=Math.floor((Math.min(ax,b.x)-45)/cell),maxX=Math.floor((Math.max(ax,b.x)+45)/cell),minY=Math.floor((Math.min(ay,b.y)-45)/cell),maxY=Math.floor((Math.max(ay,b.y)+45)/cell);for(let cx=minX;cx<=maxX;cx++)for(let cy=minY;cy<=maxY;cy++)for(const e of grid.get(`${cx},${cy}`)||[]){if(b.left<=0||e.hp<=0||b.hits.has(e.id))continue;if(segmentDistance(e.x,e.y,ax,ay,b.x,b.y)<e.r+5){b.hits.add(e.id);b.left--;hurtEnemy(g,e,b.damage,{freeze:b.freeze,burn:b.burn,color:b.color});if(b.splash)area(g,e.x,e.y,b.splash,b.damage*.55,{direct:false,burn:b.burn},'#f2a079')}}}g.bullets=g.bullets.filter(b=>b.life>0&&b.left>0);
 const moth=g.pets.find(p=>p.kind==='slowpet');for(const b of g.enemyBullets){const ax=b.x,ay=b.y,slow=moth&&distance(b,g)<=145+(moth.rank-1)*25?1-Math.min(.55,.35+(moth.rank-1)*.1):1;b.x+=b.vx*dt*slow;b.y+=b.vy*dt*slow;b.life-=dt;if(segmentDistance(g.x,g.y,ax,ay,b.x,b.y)<b.r+15){if(damageHero(g,b.damage)&&b.kind==='ice')g.slow=2;b.life=0}if(b.kind==='poison'&&b.life<=0)hazard(g,b.x,b.y,48,b.damage,'#a7cf73',0,3)}g.enemyBullets=g.enemyBullets.filter(b=>b.life>0&&b.x>MAP.left-50&&b.x<MAP.right+50&&b.y>MAP.top-50&&b.y<MAP.bottom+50);
 for(const h of g.hazards){if(h.delay>0){h.delay-=dt;continue}h.life-=dt;if(Math.hypot(g.x-h.x,g.y-h.y)<h.r+12){if(damageHero(g,h.damage)&&h.slow)g.slow=2}}g.hazards=g.hazards.filter(h=>h.life>0);
 // Queue death bursts instead of recursive calls so large chains cannot overflow the stack.
 for(let n=0;g.deathQueue.length&&n<400;n++){const p=g.deathQueue.shift();area(g,p.x,p.y,75,p.damage,{direct:false},'#e9a27b')}if(g.deathQueue.length>400)g.deathQueue.length=400;
 g.enemies=g.enemies.filter(e=>e.hp>0);if(g.health<=0){g.health=0;g.status='dead'}else checkLevel(g);
}
export const activeSkills={
 archer:{name:'Scattershot',icon:'➶',cooldown:5,color:'#ffd322',description:'Fire 9 piercing arrows in a shotgun spread. Each deals 150% weapon damage and travels at most 360 units. Fixed 5 second cooldown.'},
 fighter:{name:'Iron cyclone',icon:'⚔',cooldown:14,color:'#ffcb8f',description:'Spin for 2 seconds, striking nearby enemies and taking 40% less damage.'},
 assassin:{name:'Shadowstep',icon:'⋔',cooldown:8,color:'#e559ff',description:'Dash through foes for 550% weapon damage, with 0.8 seconds of invulnerability. Can critically strike.'},
 mage:{name:'Glacial nova',icon:'❆',cooldown:16,color:'#38e4ff',description:'Blast nearby enemies for 230% elemental weapon damage, freeze them, and erase nearby hostile projectiles.'},
 tank:{name:'Bastion',icon:'⬡',cooldown:16,color:'#3ebcff',description:'Smash a 185-unit area for 240% damage, restore your shield, and take 60% less damage for 4 seconds.'},
 healer:{name:'Sanctuary',icon:'✚',cooldown:18,color:'#3dff8b',description:'Restore 12 HP, damage a 200-unit area for 210% damage, slow enemies, and erase nearby hostile shots.'},
 shapeshifter:{name:'Primal surge',icon:'◇',cooldown:12,color:'#c157ff',description:'Rend all foes within 175 units for 200% weapon damage and briefly stun them. Inherited aspects permanently strengthen your hero.'}
};
export function activate(g,input={x:0,y:0}){
 if(g.status!=='playing'||g.activeCooldown>0)return false;
 const skill=activeSkills[g.classId],target=nearest(g,g,650);let x=Number.isFinite(input.x)?input.x:0,y=Number.isFinite(input.y)?input.y:0;
 if(Math.hypot(x,y)<.1){x=target?target.x-g.x:g.facing;y=target?target.y-g.y:0}const length=Math.hypot(x,y)||1;x/=length;y/=length;g.aimAngle=Math.atan2(y,x);g.facing=x<0?-1:1;g.activeCooldown=g.classId==='archer'?5:skill.cooldown*g.stats.activeHaste;soundEvent(g,'active');g.attackAnim=.45;g.activeHits.clear();
 if(g.classId==='archer'){for(let i=-4;i<=4;i++)shoot(g,g,{x:g.x+x*100,y:g.y+y*100},g.stats.damage*1.5*g.stats.volleyPower,'volley',{angle:i*.105,pierce:4,speed:620,color:'#ffe39a',life:1,maxRange:360,travel:0});g.activeTime=.45}
 else if(g.classId==='fighter'){g.activeTime=2+g.stats.tempest*.4;g.activeClock=0}
 else if(g.classId==='assassin'){g.activeTime=.24;g.activeDash={x,y,time:.24};g.invulnerable=Math.max(g.invulnerable,.8);}
 else if(g.classId==='tank'){g.activeTime=4;g.shield=g.stats.shieldMax;area(g,g.x,g.y,185,g.stats.damage*2.4,{stun:.8})}
 else if(g.classId==='healer'){g.health=Math.min(g.stats.maxHealth,g.health+12+3*g.stats.mercy);g.shield=Math.min(g.stats.shieldMax,g.shield+5*g.stats.mercy);area(g,g.x,g.y,200,g.stats.damage*2.1,{slow:2});g.enemyBullets=g.enemyBullets.filter(b=>distance(b,g)>200)}
 else if(g.classId==='shapeshifter'){area(g,g.x,g.y,175,g.stats.damage*2,{stun:.6})}
 else{g.activeTime=.65;area(g,g.x,g.y,245,g.stats.damage*2.3*g.stats.elemental,{freeze:1.8,slow:3},'#79eaff');g.enemyBullets=g.enemyBullets.filter(b=>Math.hypot(b.x-g.x,b.y-g.y)>270);}
 return true;
}
function updateActive(g,dt){
 if(g.classId==='fighter'&&g.activeTime>0){g.activeClock-=dt;if(g.activeClock<=0){g.activeClock=.2;area(g,g.x,g.y,140+g.stats.tempest*15,g.stats.damage*.6,{},'#ffdba7');}}
 if(g.activeDash){const dash=g.activeDash,ax=g.x,ay=g.y;g.x+=dash.x*1050*dt;g.y+=dash.y*1050*dt;constrain(g,18);g.moving=true;g.walk+=.4;for(const e of g.enemies){if(e.hp>0&&!g.activeHits.has(e.id)&&segmentDistance(e.x,e.y,ax,ay,g.x,g.y)<e.r+32){g.activeHits.add(e.id);hurtEnemy(g,e,g.stats.damage*5.5,{color:'#deb9ff'});}}dash.time-=dt;if(dash.time<=0)g.activeDash=null}
}
