import * as T from './public/vendor/three.module.js';
import { operatorModel, gearModel, disposeModel } from './models.js';
export class Inspector {
  constructor(host, kind, settings) {
    this.host=host;this.settings=settings;this.yaw=.5;this.pitch=0;this.zoom=1;this.dead=false;
    this.renderer=new T.WebGLRenderer({antialias:true,alpha:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,settings.quality==='low'?1:1.5));this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.shadowMap.enabled=true;
    const canvas=this.renderer.domElement;canvas.className='inspection-canvas';canvas.tabIndex=0;canvas.setAttribute('aria-label','3D equipment inspection. Drag or use left and right arrows to rotate. Plus and minus to zoom.');host.prepend(canvas);
    this.scene=new T.Scene();this.camera=new T.PerspectiveCamera(35,1,.01,30);
    this.scene.add(new T.HemisphereLight('#d6e2dd','#172022',2));
    for(const [color,intensity,x,y,z] of [['#ffe7bd',5,2,3,4],['#7ba5b0',4,-3,2,-2]]){const light=new T.DirectionalLight(color,intensity);light.position.set(x,y,z);this.scene.add(light)}
    this.pivot=new T.Group();this.scene.add(this.pivot);this.setModel(kind,settings.finish);
    const grid=new T.GridHelper(6,30,'#82936d','#27372f');grid.position.y=-.03;this.scene.add(grid);
    this.onResize=()=>{const {width,height}=host.getBoundingClientRect();this.renderer.setSize(width,height);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.render()};this.observer=new ResizeObserver(this.onResize);this.observer.observe(host);
    let pointer=null;
    canvas.onpointerdown=e=>{pointer=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId)};
    canvas.onpointermove=e=>{if(pointer){this.yaw+=(e.clientX-pointer[0])*.008;this.pitch=T.MathUtils.clamp(this.pitch+(e.clientY-pointer[1])*.005,-.4,.4);pointer=[e.clientX,e.clientY];this.render()}};
    canvas.onpointerup=canvas.onpointercancel=()=>pointer=null;
    canvas.onkeydown=e=>{if(['ArrowLeft','ArrowRight','+','-','='].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')this.yaw-=.15;else if(e.key==='ArrowRight')this.yaw+=.15;else this.zoom=T.MathUtils.clamp(this.zoom+(e.key==='-'?.1:-.1),.65,1.4);this.render()}};
    this.onResize();
  }
  setModel(kind,finish){if(this.model){this.pivot.remove(this.model);disposeModel(this.model)}this.kind=kind;const label=this.host.querySelector('.inspection-label');if(label)label.textContent='ORIGINAL 3D / '+kind.toUpperCase();this.model=kind==='operator'?operatorModel(finish):gearModel(kind,finish);this.pivot.add(this.model);if(kind!=='operator')this.model.position.y=.8;this.render()}
  rotate(delta){this.yaw+=delta;this.render()}
  reset(){this.yaw=.5;this.pitch=0;this.zoom=1;this.render()}
  render(){if(this.dead)return;this.pivot.rotation.set(this.pitch,this.yaw,0);this.camera.position.set(0,this.kind==='operator'?1.25:1.05,(this.kind==='operator'?3.9:2.9)*this.zoom);this.camera.lookAt(0,this.kind==='operator'?.95:.8,0);this.renderer.render(this.scene,this.camera)}
  dispose(){this.dead=true;this.observer.disconnect();disposeModel(this.scene);this.renderer.dispose();this.renderer.domElement.remove()}
}
