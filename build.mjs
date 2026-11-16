import { mkdir, copyFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
export const files = ['index.html','style.css','main.js','profile.js','settings.js','game.js','materials.js','models.js','inspector.js','drop.js','simple-drop.js','public/lobby.jpg','public/vendor/three.module.js','public/vendor/LICENSE'];
// Allowlist keeps source tests, archives, credentials and local tooling out of deployment.
await rm('dist',{recursive:true,force:true});
for (const file of files) {const target=path.join('dist',file);await mkdir(path.dirname(target),{recursive:true});await copyFile(file,target);}
const total=(await Promise.all(files.map(f=>stat(path.join('dist',f))))).reduce((n,s)=>n+s.size,0);
console.log(`Production build: ${files.length} files, ${(total/1024/1024).toFixed(2)} MB in dist/`);
