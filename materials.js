import * as T from './public/vendor/three.module.js';
// All surface artwork is generated locally, with a deterministic seed.
export function surface(kind){
  const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');let state=42;
  const rand=()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296};
  const base=kind==='metal'?[69,77,68]:[116,113,99];const d=x.createImageData(512,512);
  for(let i=0;i<d.data.length;i+=4){let n=(rand()-.5)*28;d.data[i]=base[0]+n;d.data[i+1]=base[1]+n;d.data[i+2]=base[2]+n;d.data[i+3]=255}x.putImageData(d,0,0);
  for(let i=0;i<150;i++){const a=rand()*512,b=rand()*512;x.strokeStyle=`rgba(20,22,17,${rand()*.16})`;x.lineWidth=rand()*4;x.beginPath();x.moveTo(a,b);x.lineTo(a+(rand()-.5)*100,b+rand()*150);x.stroke()}
  if(kind==='metal'){for(let i=0;i<512;i+=32){x.fillStyle='#1e28254a';x.fillRect(i,0,3,512);x.fillStyle='#c1c5a933';x.fillRect(i+3,0,2,512)}for(const a of [12,500])for(const b of [12,500]){x.fillStyle='#222b25';x.beginPath();x.arc(a,b,5,0,7);x.fill()}}
  else{for(let i=0;i<16;i++){let a=rand()*512,b=rand()*512;x.strokeStyle='#252b2338';x.lineWidth=.6;x.beginPath();x.moveTo(a,b);for(let j=0;j<8;j++){a+=(rand()-.5)*35;b+=rand()*15;x.lineTo(a,b)}x.stroke()}x.fillStyle='#242b2129';x.fillRect(0,0,512,3);x.fillRect(0,0,3,512)}
  const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.anisotropy=4;
  return new T.MeshStandardMaterial({map,bumpMap:map,bumpScale:kind==='metal'?.025:.06,color:'#a5a596',roughness:kind==='metal'?.62:.95,metalness:kind==='metal'?.45:0});
}
export function addSky(scene){
 const sky=new T.Mesh(new T.SphereGeometry(350,32,16),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{},vertexShader:`varying vec3 v;void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 v;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
 void main(){vec3 d=normalize(v);vec3 col=mix(vec3(.53,.54,.49),vec3(.12,.19,.23),clamp(d.y,0.,1.));vec2 p=d.xz/(abs(d.y)+.25)*2.;float n=0.,amp=.5;for(int i=0;i<5;i++){n+=noise(p)*amp;p=p*2.1+13.;amp*=.5;}float cloud=smoothstep(.35,.7,n)*smoothstep(-.05,.25,d.y);col=mix(col,vec3(.29,.33,.32),cloud*.8);float sun=pow(max(0.,dot(d,normalize(vec3(-.5,.18,.2)))),200.);col+=sun*vec3(.8,.55,.28);gl_FragColor=vec4(col,1.);}` }));scene.add(sky);
}
export function landscape(scene){
 const g=new T.PlaneGeometry(360,360,100,100);g.rotateX(-Math.PI/2);const p=g.attributes.position;
 for(let i=0;i<p.count;i++){let x=p.getX(i),z=p.getZ(i),r=Math.hypot(x,z),h=Math.max(0,r-90)*.15;h*=1.2+Math.sin(x*.05)*Math.cos(z*.06);p.setY(i,h-.2)}g.computeVertexNormals();const m=new T.Mesh(g,surface('ground'));m.material.map.repeat.set(45,45);m.receiveShadow=true;scene.add(m);
 const rockGeo=new T.IcosahedronGeometry(1,1);const rocks=new T.InstancedMesh(rockGeo,new T.MeshStandardMaterial({color:'#646a5b',roughness:1}),100);let o=new T.Object3D();for(let i=0;i<100;i++){let a=i*2.399,r=86+(i%11)*4;o.position.set(Math.sin(a)*r,.5,Math.cos(a)*r);o.scale.set(1+i%3,1+i%4,1+i%2);o.rotation.set(i,.5*i,0);o.updateMatrix();rocks.setMatrixAt(i,o.matrix)}rocks.castShadow=true;rocks.receiveShadow=true;scene.add(rocks);
}
