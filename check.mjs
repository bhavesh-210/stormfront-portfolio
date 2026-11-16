import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
for(const file of (await readdir('.')).filter(f=>/\.(js|mjs)$/.test(f))) {const r=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);}
console.log('All JavaScript modules pass syntax checks.');
