// Detailed class silhouettes are painted only while baking the animation atlas.
const edge='#142521',gold='#e5c487',steel='#b4c5c5',skin='#dfb694';
function poly(c,p,fill,stroke=edge,w=1.3){c.beginPath();c.moveTo(...p[0]);for(let i=1;i<p.length;i++)c.lineTo(...p[i]);c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke()}}
function line(c,p,color,w=2){c.beginPath();c.moveTo(...p[0]);for(let i=1;i<p.length;i++)c.lineTo(...p[i]);c.strokeStyle=color;c.lineWidth=w;c.lineJoin='round';c.lineCap='round';c.stroke()}
function oval(c,x,y,rx,ry,fill,stroke=edge){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1.3;c.stroke()}}
function blade(c,x,y,a,length){c.save();c.translate(x,y);c.rotate(a);poly(c,[[-2,2],[-3,-length+7],[0,-length],[4,-length+6],[2,2]],steel);line(c,[[0,-length+5],[1,-1]],'#effaff',1);line(c,[[-5,2],[6,2]],gold,3);line(c,[[0,4],[0,9]],'#76503f',3);c.restore()}
export function paintHero(c,kind,color,frame){
 const walk=frame===1?1:frame===2?-1:0,attacking=frame>=3,heavy=kind==='tank',caster=kind==='mage'||kind==='healer',feral=kind==='shapeshifter',slim=kind==='assassin',width=heavy?15:slim?8:11,lean=attacking?(frame===4?-3:4):0;
 c.save();c.translate(lean,walk?-.7:0);
 // Boots, greaves, and separate moving legs.
 for(const side of [-1,1]){const x=side*(heavy?8:6),step=walk*side*3;line(c,[[x,-1],[x+side*2,8],[x+step,17]],heavy?'#657b85':feral?'#665246':'#434e53',heavy?9:6);oval(c,x+step+2,18,heavy?7:5,3,'#353133');if(heavy||kind==='fighter'){poly(c,[[x-4,3],[x+4,3],[x+4,13],[x-3,15]],steel);line(c,[[x-2,5],[x+2,5]],'#e7e6cc',1)}}
 // Each class has its own outer silhouette and equipment behind the torso.
 if(kind==='archer'){poly(c,[[-7,-29],[-16,-25],[-22,7],[-9,4],[3,10],[9,-24]],'#466b49');line(c,[[-14,-21],[-17,2],[-12,1]],'#88a669',1);poly(c,[[-20,-28],[-13,-30],[-8,-4],[-15,-2]],'#71543a');for(let i=0;i<3;i++){line(c,[[-18+i*3,-25],[-23+i*3,-43]],'#d2ba8a',1.2);poly(c,[[-24+i*3,-44],[-20+i*3,-39],[-24+i*3,-38]],'#e2d4a1',null)}}
 if(kind==='fighter'){poly(c,[[-11,-27],[-19,-24],[-20,10],[-9,7],[3,12],[13,7],[10,-24]],'#974e42');line(c,[[-16,-19],[-16,6]],'#d79b73',1);poly(c,[[-5,-35],[-6,-55],[0,-60],[6,-54],[4,-34]],'#c9624e');line(c,[[0,-56],[1,-39]],'#eea17e',2)}
 if(slim){poly(c,[[-9,-28],[-18,-20],[-22,8],[-10,1],[-6,10],[4,-1],[10,-24]],'#38344e');poly(c,[[-7,-29],[-24,-32],[-31,-27],[-15,-24]],'#8462a7');line(c,[[-23,-30],[-16,-28]],'#c0a0d5',1)}
 if(caster){poly(c,[[-10,-28],[-16,-18],[-19,15],[0,20],[17,14],[12,-25]],kind==='mage'?'#355a7b':'#e0debb');poly(c,[[-8,-24],[-8,12],[0,17],[7,12],[8,-25]],color);for(const side of [-1,1])line(c,[[side*12,-20],[side*14,10],[side*3,15]],gold,1.5)}
 if(feral){poly(c,[[-12,-28],[-21,-21],[-17,-13],[-22,-9],[-15,-5],[-18,2],[-5,-1],[5,4],[14,-5],[19,-13],[12,-27]],'#6c665c');for(let i=0;i<5;i++)line(c,[[-15+i*6,-23],[-16+i*6,-16]],'#b8ac90',2);poly(c,[[-10,1],[-15,12],[-5,8],[0,13],[8,8],[12,1]],'#5d493e')}
 if(heavy){poly(c,[[-15,-29],[-24,-23],[-21,-9],[-13,-10],[14,-10],[23,-15],[20,-28]],'#567c8b');for(const side of [-1,1])poly(c,[[side*12,-29],[side*22,-28],[side*24,-19],[side*13,-19]],steel)}
 // Layered tunics / breastplate, straps, buckles, pouches, and embroidery.
 poly(c,[[-width,-25],[0,-29],[width,-25],[width-1,-2],[0,3],[-width+1,-2]],heavy||kind==='fighter'?'#768f99':slim?'#534766':feral?'#896b54':color);
 if(heavy||kind==='fighter'){poly(c,[[-width+3,-24],[0,-27],[width-3,-23],[width-4,-9],[0,-5],[-width+4,-9]],steel);line(c,[[0,-24],[0,-9]],'#edf2df',1.4);for(let i=0;i<3;i++)line(c,[[-width+3,-7+i*3],[width-3,-7+i*3]],'#445d68',1);poly(c,[[-4,-21],[0,-24],[4,-21],[0,-14]],heavy?'#65cde6':'#b97556')}
 else{line(c,[[-8,-24],[8,-5]],'#735542',3);line(c,[[-7,-24],[8,-6]],gold,.7);if(caster)for(let i=0;i<3;i++)poly(c,[[-2,-20+i*5],[0,-23+i*5],[2,-20+i*5],[0,-17+i*5]],gold,null);if(feral)for(let i=0;i<3;i++)line(c,[[-6+i*4,-21],[-2+i*4,-9]],color,1.5)}
 line(c,[[-width,-1],[width,-1]],'#493e36',4);poly(c,[[-3,-4],[3,-4],[3,2],[-3,2]],gold);poly(c,[[-width,-1],[-width+5,-1],[-width+5,6],[-width,5]],'#8b6c48');line(c,[[-width+1,1],[-width+4,1]],gold,1);
 // Arms and gauntlets keep their pose visible beneath class weapons.
 const handX=attacking?23:16,handY=attacking?-18:-10;
 for(const side of [-1,1]){const x=side<0?-15:handX,y=side<0?-5:handY;line(c,[[side*width,-23],[side*(width+5),-16],[x,y]],heavy?'#829eaa':feral?'#92785b':color,heavy?8:5);oval(c,x,y,3,3,heavy||kind==='fighter'?steel:skin);line(c,[[x-3,y-5],[x+2,y-5]],gold,1.5)}
 // Faces and headgear: distinct helmet / hood / hat / antlers / halo.
 oval(c,0,-35,7.5,9,skin);poly(c,[[-7,-38],[-4,-44],[5,-43],[8,-36],[4,-38],[0,-40]],'#584334');line(c,[[2,-36],[5,-36]],'#203435',1.4);line(c,[[3,-30],[5,-30]],'#a27359',1);
 if(heavy||kind==='fighter'){poly(c,[[-9,-42],[-5,-48],[5,-48],[10,-41],[9,-29],[-9,-29]],steel);poly(c,[[-7,-38],[7,-38],[7,-33],[-7,-33]],'#253e49');line(c,[[-3,-36],[4,-36]],'#a1e6ed',1);line(c,[[0,-46],[0,-30]],gold,2);for(const x of [-5,0,5])line(c,[[x,-31],[x,-28]],'#536d75',1);if(heavy)poly(c,[[-8,-47],[-5,-53],[6,-52],[9,-46]],'#7995a1')}
 if(kind==='archer'){poly(c,[[-10,-31],[-11,-43],[-2,-49],[9,-43],[10,-31],[5,-34],[4,-42],[-5,-41],[-5,-32]],'#537449');line(c,[[-7,-41],[-3,-45],[4,-42]],'#a4ba7c',1);poly(c,[[3,-47],[8,-58],[11,-53],[7,-47]],'#e0d1a1')}
 if(slim){poly(c,[[-10,-28],[-12,-41],[-3,-48],[8,-44],[11,-30],[6,-32],[5,-39],[-5,-39],[-5,-29]],'#48415c');poly(c,[[-6,-34],[7,-34],[6,-27],[-5,-27]],'#7c689a');line(c,[[0,-36],[4,-36]],'#f1d99e',1);line(c,[[-8,-42],[-3,-46],[3,-43]],'#a28ac0',1)}
 if(kind==='mage'){poly(c,[[-13,-42],[-7,-45],[-4,-61],[3,-65],[7,-48],[14,-43],[7,-40],[-6,-40]],'#3c6286');line(c,[[-7,-45],[7,-45]],gold,3);poly(c,[[-1,-56],[1,-59],[3,-55],[1,-52]],'#9deaff',null);line(c,[[-6,-27],[-10,-20],[0,-15],[9,-22],[6,-27]],'#9abbd1',2)}
 if(kind==='healer'){poly(c,[[-10,-29],[-10,-44],[-6,-49],[6,-49],[11,-42],[10,-29],[6,-32],[5,-41],[-5,-42],[-5,-31]],'#f0e9cf');line(c,[[-7,-44],[0,-47],[7,-43]],gold,1.4);c.beginPath();c.ellipse(0,-56,12,3,0,0,Math.PI*2);c.strokeStyle=gold;c.lineWidth=2;c.stroke();poly(c,[[-5,-24],[0,-28],[5,-24],[0,-19]],'#458b75')}
 if(feral){poly(c,[[-12,-30],[-15,-42],[-9,-49],[-3,-46],[4,-49],[13,-44],[13,-31],[7,-35],[5,-41],[-4,-40],[-7,-32]],'#8e887a');for(const side of [-1,1]){line(c,[[side*7,-46],[side*12,-54],[side*11,-62]],'#d8cfad',3);line(c,[[side*12,-54],[side*19,-56]],'#d8cfad',2)}poly(c,[[-4,-37],[0,-41],[4,-37],[0,-34]],color,null);line(c,[[2,-35],[6,-35]],'#d1fc94',1.6)}
 // Signature equipment creates readable silhouettes at actual game scale.
 if(kind==='archer'){c.save();c.translate(handX+2,handY);c.beginPath();c.moveTo(0,-22);c.quadraticCurveTo(24,0,0,22);c.strokeStyle=gold;c.lineWidth=3;c.stroke();line(c,[[0,-22],[attacking?-7:0,0],[0,22]],'#e8dec2',1);line(c,[[-12,0],[16,0]],'#f1e5c3',1.5);poly(c,[[20,0],[13,-3],[13,3]],steel);c.restore()}
 if(kind==='fighter')blade(c,handX,handY,attacking?1.35:.25,39);
 if(slim){blade(c,handX,handY,attacking?1.5:.7,23);blade(c,-15,-4,-1,21);poly(c,[[8,-5],[15,7],[12,12],[5,-3]],'#6b5a7c')}
 if(heavy){poly(c,[[-29,-27],[-15,-31],[-3,-25],[-5,1],[-15,13],[-27,1]],'#496c80');poly(c,[[-25,-23],[-15,-26],[-7,-22],[-9,-1],[-15,7],[-23,-1]],'#99b9c0',gold,1.6);line(c,[[-15,-22],[-15,5]],gold,2);poly(c,[[-20,-12],[-15,-18],[-10,-12],[-15,-5]],'#4bb5d1');blade(c,handX,handY,.3,25)}
 if(caster){const x=handX+3;line(c,[[x-2,14],[x,-45]],'#5c4234',4);line(c,[[x-1,12],[x+1,-43]],gold,1);if(kind==='mage'){poly(c,[[x,-59],[x+7,-49],[x,-37],[x-7,-49]],'#91eaff',gold);poly(c,[[x,-54],[x+3,-49],[x,-42],[x-2,-48]],'#e9ffff',null);line(c,[[x-7,-43],[x-11,-52]],gold,2)}else{c.beginPath();c.arc(x,-47,9,0,Math.PI*2);c.strokeStyle=gold;c.lineWidth=2;c.stroke();line(c,[[x,-54],[x,-40]],'#e5ffce',3);line(c,[[x-6,-47],[x+6,-47]],'#e5ffce',3)}}
 if(feral){const reach=frame===4?-5:frame===3?13:frame===5?8:0,lift=frame===4?-17:frame===5?9:0;line(c,[[8,-23],[17+reach,-15+lift],[21+reach,-9+lift]],'#9c8266',6);oval(c,22+reach,-9+lift,5,4,'#665c50');for(let i=0;i<3;i++)poly(c,[[20+reach+i*3,-11+lift+i*3],[30+reach+i*3,-26+lift+i*3],[24+reach+i*3,-9+lift+i*3]],'#f2e9cd',edge,.7)}
 c.restore();
}
