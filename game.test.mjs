import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from './public/vendor/three.module.js';
import {FieldGame} from './game.js';
test('movement blocks entry into cover and allows movement away',()=>{const g=Object.create(FieldGame.prototype);g.keys={KeyW:true};g.yaw=0;g.player=new T.Vector3(0,1.7,2);g.colliders=[new T.Box3(new T.Vector3(-1,0,-1),new T.Vector3(1,3,1))];g.move(.2);assert.equal(g.player.z,2);g.keys={KeyS:true};g.move(.2);assert.equal(g.player.z,3)});
test('diagonal speed equals straight speed',()=>{const g=Object.create(FieldGame.prototype);g.yaw=0;g.colliders=[];g.player=new T.Vector3();g.keys={KeyW:true,KeyD:true};g.move(.1);assert.ok(Math.abs(g.player.length()-.5)<1e-10)});
test('reload requires ammo reserve and active unpaused ground state',()=>{const g=Object.create(FieldGame.prototype);Object.assign(g,{phase:'ground',paused:false,ammo:0,reserve:30,reloading:0,beep:()=>{}});g.reload();assert.equal(g.reloading,1.8);g.reloading=0;g.paused=true;g.reload();assert.equal(g.reloading,0);g.paused=false;g.reserve=0;g.reload();assert.equal(g.reloading,0)});
test('paused weapon cannot consume ammo',()=>{const g=Object.create(FieldGame.prototype);Object.assign(g,{phase:'ground',paused:true,ammo:30});g.shoot();assert.equal(g.ammo,30)});
test('cover blocks a shot and exposed targets take damage',async()=>{
  const previous=globalThis.document;
  globalThis.document={querySelector:()=>({classList:{add(){},remove(){}}})};
  try{
    const g=Object.create(FieldGame.prototype);
    const camera=new T.PerspectiveCamera(70,1,.1,100);camera.updateMatrixWorld();
    const target=new T.Group();target.add(new T.Mesh(new T.SphereGeometry(1),new T.MeshBasicMaterial()));target.position.set(.1,.1,-10);target.updateMatrixWorld(true);
    const wall=new T.Mesh(new T.BoxGeometry(3,3,1),new T.MeshBasicMaterial());wall.position.z=-5;wall.updateMatrixWorld();
    Object.assign(g,{phase:'ground',paused:false,ammo:30,cool:0,reloading:0,ray:new T.Raycaster(),camera,targets:[{mesh:target,hp:100}],obstacles:[wall],beep(){},kills:0});
    g.shoot();assert.equal(g.targets[0].hp,100);assert.equal(g.ammo,29);
    g.obstacles=[];g.cool=0;g.shoot();assert.equal(g.targets[0].hp,66);
    g.cool=0;g.shoot();g.cool=0;g.shoot();assert.equal(g.kills,1);assert.equal(target.visible,false);await new Promise(resolve=>setTimeout(resolve,150));
  }finally{globalThis.document=previous}
});
