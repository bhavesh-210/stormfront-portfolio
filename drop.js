export const destinations = [
  {name:'Missions',x:-12,z:-8}, {name:'Operator',x:13,z:12}, {name:'Comms',x:0,z:-45}
];
export function nearestDestination(x,z) { return destinations.reduce((best,p)=>Math.hypot(p.x-x,p.z-z)<Math.hypot(best.x-x,best.z-z)?p:best).name; }
export function createDrop() {return {phase:'aircraft',x:5,z:8,altitude:100,chute:false,chips:0,collected:[],paused:false};}
export function stepDrop(state,action) {
  const s={...state,collected:[...state.collected]};
  if(action==='pause'){s.paused=!s.paused;return s;}
  if(s.paused||s.phase==='landed')return s;
  if(s.phase==='aircraft'){if(action==='deploy')s.phase='drop';return s;}
  if(action==='deploy'){s.chute=true;return s;}
  const moves={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1],descend:[0,0]};
  if(!moves[action])return s;
  s.x=Math.max(0,Math.min(9,s.x+moves[action][0]));s.z=Math.max(0,Math.min(9,s.z+moves[action][1]));
  const chips=[[5,6],[4,4],[6,2]];chips.forEach(([x,z],i)=>{if(x===s.x&&z===s.z&&!s.collected.includes(i)){s.collected.push(i);s.chips++}});
  s.altitude=Math.max(0,s.altitude-(s.chute?7:18));if(s.altitude<=28)s.chute=true;if(s.altitude===0)s.phase='landed';return s;
}
