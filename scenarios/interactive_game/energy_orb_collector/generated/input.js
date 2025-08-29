export class InputController {
  constructor() { this.keys = new Set(); this._init(); }
  _init() {
    window.addEventListener('keydown', e => { if(this._map(e.code)) { this.keys.add(this._map(e.code)); e.preventDefault(); } });
    window.addEventListener('keyup', e => { const m=this._map(e.code); if(m) { this.keys.delete(m); e.preventDefault(); } });
  }
  _map(code){
    switch(code){
      case 'ArrowUp': case 'KeyW': return 'up';
      case 'ArrowDown': case 'KeyS': return 'down';
      case 'ArrowLeft': case 'KeyA': return 'left';
      case 'ArrowRight': case 'KeyD': return 'right';
      default: return null;
    }
  }
  getDirection(){
    let x=0,y=0; if(this.keys.has('left')) x-=1; if(this.keys.has('right')) x+=1; if(this.keys.has('up')) y+=1; if(this.keys.has('down')) y-=1; // y+: forward (z-)
    if(x!==0||y!==0){ const l=Math.hypot(x,y); x/=l; y/=l; }
    return {x,y};
  }
}
