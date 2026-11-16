import * as T from './public/vendor/three.module.js';
export const finishes = { olive: '#626c50', sand: '#a3906a', graphite: '#414b4c' };
function fabricMap(finish) {
  if(typeof document==='undefined'||!document.createElement)return null;
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const c=canvas.getContext('2d');
  c.fillStyle=finishes[finish]||finishes.olive;c.fillRect(0,0,256,256);let seed=47;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  for(let i=0;i<220;i++){c.fillStyle=i%3?'#19241e4a':'#c5bc922a';const x=random()*256,y=random()*256;c.beginPath();c.moveTo(x,y);for(let n=0;n<8;n++)c.lineTo(x+Math.cos(n*.8)*(8+random()*20),y+Math.sin(n*.8)*(7+random()*14));c.closePath();c.fill();}
  for(let y=0;y<256;y+=2){c.fillStyle=y%4?'#ffffff08':'#00000013';c.fillRect(0,y,256,1);}for(let x=0;x<256;x+=2){c.fillStyle='#0000000b';c.fillRect(x,0,1,256);}
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;return texture;
}
function parts(finish) {
  const group = new T.Group();
  const mat = (c, metal = 0) => new T.MeshStandardMaterial({ color: c, roughness: metal ? .38 : .86, metalness: metal });
  const cloth = mat(finishes[finish] || finishes.olive), dark = mat('#202b29'), metal = mat('#475251', .75), glass = mat('#5f8b87', .8), strap = mat('#a09a7c');
  const fabric=fabricMap(finish);if(fabric){cloth.map=fabric;cloth.color.set('#c1c1b5');cloth.bumpMap=fabric;cloth.bumpScale=.006;}
  function add(geo, material, pos, scale) { const m = new T.Mesh(geo, material); m.position.set(...pos); if (scale) m.scale.set(...scale); m.castShadow = m.receiveShadow = true; group.add(m); return m; }
  const box = (size, pos, material = cloth) => add(new T.BoxGeometry(...size), material, pos);
  const sphere = (size, pos, material = cloth) => add(new T.SphereGeometry(1, 28, 20), material, pos, size);
  const capsule = (r, length, pos, material = cloth) => add(new T.CapsuleGeometry(r, length, 6, 16), material, pos);
  return { group, cloth, dark, metal, glass, strap, add, box, sphere, capsule };
}
export function operatorModel(finish = 'olive') {
  const p = parts(finish), { group, cloth, dark, metal, glass, strap, box, sphere, capsule } = p;
  sphere([.29,.39,.17],[0,1.22,0]); // fitted jacket
  sphere([.22,.14,.15],[0,.9,0],dark);
  for (const x of [-.14,.14]) {
    capsule(.105,.3,[x,.67,0]); capsule(.085,.3,[x,.29,.025]);
    sphere([.12,.08,.2],[x,.08,.09],dark); sphere([.085,.105,.04],[x,.46,.105],metal);
    box([.14,.2,.07],[x*1.9,.71,0]);
    for (let i=0;i<4;i++) box([.14,.012,.01],[x,.09+i*.022,.265],strap);
  }
  for (const side of [-1,1]) {
    const arm = capsule(.095,.24,[side*.35,1.22,0]); arm.rotation.z=side*.2;
    const forearm = capsule(.076,.23,[side*.41,.94,.065]); forearm.rotation.x=-.3;
    sphere([.073,.1,.065],[side*.42,.72,.11],dark);
    box([.09,.11,.1],[side*.43,1.1,.01],metal);
    box([.055,.38,.035],[side*.19,1.28,.177],strap);
  }
  box([.43,.38,.11],[0,1.23,.16]);
  for(let y=0;y<4;y++) for(let x=0;x<5;x++) box([.058,.012,.02],[-.155+x*.077,1.15+y*.065,.225],strap);
  for(const x of [-.14,0,.14]) { box([.115,.17,.065],[x,1.08,.25]); box([.1,.035,.012],[x,1.14,.288],dark); }
  box([.37,.075,.33],[0,.91,0],dark); box([.075,.055,.025],[0,.91,.18],metal);
  box([.31,.39,.18],[0,1.22,-.23]); box([.24,.14,.06],[0,1.2,-.34],dark);
  capsule(.085,.08,[0,1.58,0],dark); sphere([.145,.19,.15],[0,1.77,0],dark);
  sphere([.174,.13,.176],[0,1.88,-.01]); box([.32,.032,.13],[0,1.82,.1]);
  box([.24,.08,.055],[0,1.79,.137],metal);
  for(const x of [-.063,.063]) box([.1,.055,.014],[x,1.79,.17],glass);
  box([.1,.05,.025],[0,1.94,.13],dark);
  for(const x of [-.165,.165]) { sphere([.025,.08,.07],[x,1.76,-.015],metal); box([.02,.13,.02],[x,1.85,-.01],dark); }
  const boom=box([.13,.014,.014],[-.12,1.69,.12],metal);boom.rotation.y=.5;
  for(let i=0;i<6;i++) box([.012,.04,.009],[-.06+i*.024,1.69,.144],metal);
  return group;
}
export function gearModel(kind = 'scanner', finish = 'olive') {
  const {group, box, sphere, capsule, add, dark, metal, glass, strap} = parts(finish);
  if (kind === 'carbine') {
    box([.12,.17,.55],[0,0,0],metal);box([.1,.12,.34],[0,-.02,.4]);box([.09,.23,.1],[0,-.17,.12],dark);
    const mag=box([.085,.24,.14],[0,-.17,-.12]);mag.rotation.x=-.16;
    box([.1,.13,.32],[0,0,-.38]);const barrel=capsule(.026,.3,[0,0,-.68],metal);barrel.rotation.x=Math.PI/2;
    for(let i=0;i<13;i++)box([.13,.018,.018],[0,.1,.14-i*.04],metal);
    for(let i=0;i<6;i++)for(const side of [-1,1])box([.006,.035,.025],[side*.052,.015,-.27-i*.04],dark);
    const scope=add(new T.CylinderGeometry(.046,.046,.17,24),dark,[0,.17,-.06]);scope.rotation.x=Math.PI/2;
    const lens=add(new T.CircleGeometry(.038,24),glass,[0,.17,.027]);lens.rotation.y=0;
    const guard=add(new T.TorusGeometry(.055,.008,8,24,Math.PI*1.7),metal,[0,-.14,.02]);guard.rotation.y=Math.PI/2;
    group.rotation.y=-Math.PI/2;
  } else if (kind === 'scanner') {
    box([.64,.87,.11],[0,0,0],dark);box([.55,.74,.025],[0,.02,.07],metal);box([.46,.56,.012],[0,.07,.09],glass);
    for(let i=0;i<8;i++) box([.32-(i%3)*.05,.008,.004],[-.03,.28-i*.05,.098],strap);
    for(const x of [-.22,0,.22]) sphere([.025,.025,.012],[x,-.34,.07],strap);
    box([.16,.045,.02],[0,.47,0],metal);
  } else if (kind === 'case') {
    box([1,.65,.42],[0,0,0]);box([1.015,.04,.435],[0,.17,0],dark);
    for(const x of [-.37,.37]){box([.06,.22,.03],[x,.15,.23],metal);box([.055,.6,.015],[x,0,-.22],dark);}
    box([.4,.035,.06],[0,.4,0],dark);for(const x of [-.19,.19])box([.035,.1,.06],[x,.355,0],metal);
    for(const x of [-.49,.49])for(const y of [-.29,.29])box([.07,.08,.47],[x,y,0],dark);
  } else {
    box([.35,.58,.2],[0,0,0]);box([.24,.13,.02],[0,.07,.11],glass);
    for(let i=0;i<7;i++)box([.22,.012,.015],[0,-.07-i*.025,.11],dark);
    capsule(.017,.44,[-.12,.53,0],dark);capsule(.035,.06,[.12,.34,0],metal);
    for(const x of [-.08,0,.08])sphere([.025,.025,.015],[x,.2,.11],strap);
  }
  return group;
}
export function disposeModel(group) { const geometries=new Set(), materials=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of [o.material].flat())materials.add(m)});geometries.forEach(g=>g.dispose());materials.forEach(m=>{m.map?.dispose();m.dispose();}); }

// Original transport silhouette with a tapered fuselage and swept wings.
export function transportModel() {
 const g=new T.Group(), paint=new T.MeshStandardMaterial({color:'#919b91',roughness:.65,metalness:.16}), dark=new T.MeshStandardMaterial({color:'#253538',roughness:.4,metalness:.25}), trim=new T.MeshStandardMaterial({color:'#55615b',roughness:.6});
 const add=(geo,mat,pos)=>{const m=new T.Mesh(geo,mat);m.position.set(...pos);m.castShadow=m.receiveShadow=true;g.add(m);return m;};
 const points=[[-10,0],[-9.6,.6],[-8.5,1.4],[-6.5,1.9],[3.8,1.9],[6,1.4],[8,.7],[10,.18],[10.2,0]].map(([z,r])=>new T.Vector2(r,z));
 const body=add(new T.LatheGeometry(points,48),paint,[0,0,0]);body.rotation.x=Math.PI/2;
 function wing(side,root,tip,front,back,y){const shape=new T.Shape();shape.moveTo(side*root,-front);shape.lineTo(side*tip,-front-3);shape.lineTo(side*(tip-.4),-back-2);shape.lineTo(side*root,-back);shape.closePath();const w=add(new T.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:true,bevelSize:.08,bevelThickness:.08,bevelSegments:2,steps:1}),paint,[0,y,0]);w.rotation.x=-Math.PI/2;}
 for(const side of [-1,1]){wing(side,1.2,12,-2,1.8,.6);wing(side,.2,4,7,8.6,1.1);
  for(let i=0;i<8;i++)add(new T.BoxGeometry(.03,.32,.45),dark,[side*1.88,.6,-5+i*1.2]);
  const window=add(new T.SphereGeometry(1,20,12),dark,[side*.85,1.05,-8.1]);window.scale.set(.7,.35,.55);
  const light=add(new T.SphereGeometry(.12,10,8),new T.MeshBasicMaterial({color:side>0?'#91eab2':'#eb9678'}),[side*11.8,.8,2]);
  for(const distance of [4.5,7.8]){const x=side*distance;const engine=add(new T.CylinderGeometry(.67,.73,3.1,32),paint,[x,-.4,-.3]);engine.rotation.x=Math.PI/2;const intake=add(new T.CircleGeometry(.6,32),dark,[x,-.4,-1.88]);intake.rotation.y=Math.PI;add(new T.TorusGeometry(.66,.06,10,32),trim,[x,-.4,-1.88]);for(let i=0;i<8;i++){const blade=add(new T.BoxGeometry(.05,.95,.03),trim,[x,-.4,-1.9]);blade.rotation.z=i*Math.PI/8;}}
 }
 const fin=new T.Shape();fin.moveTo(6,0);fin.lineTo(8.5,4.4);fin.lineTo(10,4.4);fin.lineTo(9.3,0);const tail=add(new T.ExtrudeGeometry(fin,{depth:.2,bevelEnabled:false}),paint,[-.1,.8,0]);tail.rotation.y=-Math.PI/2;
 for(let i=0;i<8;i++){const seam=add(new T.TorusGeometry(1.91,.012,4,48),trim,[0,0,-5+i*1.2]);}
 return g;
}
