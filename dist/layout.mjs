// Independent seeded layout RNG keeps cosmetic/layout work out of combat randomness.
export function generateObstacles(seed){let s=(seed^0xa8f9713d)>>>0;const random=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296},out=[];
 for(let row=0;row<2;row++)for(let col=0;col<3;col++){
  const cx=(col-1)*430,cy=row?270:-270;let best=null,score=-Infinity;
  for(let k=0;k<24;k++){const r=35+random()*17,x=cx+(random()-.5)*180,y=cy+(random()-.5)*120,center=Math.hypot(x,y)-r;if(center<180)continue;let clearance=Infinity;for(const o of out)clearance=Math.min(clearance,Math.hypot(x-o.x,y-o.y)-r-o.r);if(clearance<135)continue;const value=Math.min(clearance,350)+random()*70;if(value>score){score=value;best={x:Math.round(x),y:Math.round(y),r:Math.round(r),sector:row*3+col}}}
  out.push(best||{x:cx,y:cy,r:40,sector:row*3+col});
 }return out;
}
