import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { defaults, sanitizeSettings, loadSettings, saveSettings } from './settings.js';
import { createDrop, stepDrop, nearestDestination } from './drop.js';
import { operatorModel, gearModel, transportModel, disposeModel } from './models.js';
import * as T from './public/vendor/three.module.js';

test('corrupt or blocked storage never prevents opening the portfolio',()=>{
  assert.deepEqual(loadSettings({getItem(){throw Error('blocked')}}),defaults);
  assert.deepEqual(loadSettings({getItem(){return '{bad json'}}),defaults);
  assert.equal(saveSettings(defaults,{setItem(){throw Error('quota')}}),false);
});
test('settings reject injected values and clamp sensitivity',()=>{
  assert.deepEqual(sanitizeSettings({quality:'<script>',sound:'yes',finish:'black',sensitivity:99}),{...defaults,sensitivity:2});
  assert.equal(sanitizeSettings({sensitivity:NaN}).sensitivity,1);
  const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
  assert.equal(saveSettings({...defaults,finish:'sand',quality:'low'},storage),true);
  assert.equal(loadSettings(storage).finish,'sand');assert.equal(loadSettings(storage).quality,'low');
});
test('simplified drop starts deliberately, pauses, deploys safety canopy and always ends',()=>{
  let s=createDrop();assert.deepEqual(stepDrop(s,'up'),s);
  s=stepDrop(s,'deploy');s=stepDrop(s,'pause');assert.deepEqual(stepDrop(s,'up'),s);
  s=stepDrop(s,'pause');for(let i=0;i<30;i++)s=stepDrop(s,'descend');
  assert.equal(s.phase,'landed');assert.equal(s.altitude,0);assert.equal(s.chute,true);
  assert.deepEqual(stepDrop(s,'left'),s);
});
test('manual canopy slows descent and intel can only be collected once',()=>{
  let s=stepDrop(createDrop(),'deploy');s=stepDrop(s,'deploy');s=stepDrop(s,'up');s=stepDrop(s,'up');
  assert.equal(s.altitude,86);assert.equal(s.chips,1);
  s=stepDrop(s,'down');s=stepDrop(s,'up');assert.equal(s.chips,1);
  for(let i=0;i<20;i++)s=stepDrop(s,'left');assert.ok(s.x>=0&&s.x<=9);
});
test('landing chooses the closest real portfolio destination',()=>{
  assert.equal(nearestDestination(-12,-8),'Missions');assert.equal(nearestDestination(13,12),'Operator');assert.equal(nearestDestination(0,-45),'Comms');
});
test('original operator and all gear models have finite geometry and dispose safely',()=>{
  for(const model of [operatorModel(),transportModel(),...['scanner','case','radio','carbine'].map(k=>gearModel(k,'sand'))]){
    const box=new T.Box3().setFromObject(model);assert.equal(box.isEmpty(),false);assert.ok(Number.isFinite(box.max.length()));
    model.traverse(o=>{if(o.geometry){for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v));}});
    disposeModel(model);
  }
});
test('every local module import and HTML/CSS asset resolves',async()=>{
  for(const file of ['main.js','game.js','materials.js','models.js','inspector.js','simple-drop.js','index.html','style.css']){
    const text=await readFile(file,'utf8');const imports=[...text.matchAll(/(?:from\s*|import\s*\()\s*['"](\.\/[^'"]+)['"]/g),...text.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g),...text.matchAll(/url\(['"](\.\/[^'"]+)['"]\)/g)];
    for(const match of imports)await access(match[1]);
  }
});
