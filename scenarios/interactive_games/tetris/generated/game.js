// game.js - コアロジック
import { BagRandomizer, getShape, COLORS } from './pieces.js';

export class Game {
  constructor({ cols=10, rows=20, onUpdate, onGameOver }) {
    this.cols = cols;
    this.rows = rows;
    this.onUpdate = onUpdate;
    this.onGameOver = onGameOver;

    this.reset();
  }

  reset() {
    this.matrix = Array.from({length:this.rows}, () => Array(this.cols).fill(null));
    this.randomizer = new BagRandomizer();
    this.queue = [];
    while (this.queue.length < 3) this.queue.push(this.randomizer.next());
    this.holdPiece = null;
    this.canHold = true;
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropCounter = 0;
    this.dropIntervalBase = 1000; // ms base
    this.active = true;
    this.spawnNew();
  }

  spawnNew() {
    const type = this.queue.shift();
    this.queue.push(this.randomizer.next());
    this.current = {
      type,
      rotation:0,
      x:3,
      y:0
    };
    // 初期位置で衝突したらゲームオーバー
    if (this.collide(0,0,0)) {
      this.active = false;
      this.onGameOver?.();
    }
    this.onUpdate?.();
  }

  hardDrop() {
    if(!this.active) return;
    while(!this.collide(0,1,0)) {
      this.current.y++;
    }
    this.lock();
    this.onUpdate?.();
  }

  softDrop(active) {
    this.softDropping = active;
  }

  hold() {
    if (!this.canHold || !this.active) return;
    const curType = this.current.type;
    if (this.holdPiece == null) {
      this.holdPiece = curType;
      this.spawnNew();
    } else {
      const swap = this.holdPiece;
      this.holdPiece = curType;
      this.current = { type: swap, rotation:0, x:3, y:0 };
      if (this.collide(0,0,0)) { this.active=false; this.onGameOver?.(); }
    }
    this.canHold = false;
    this.onUpdate?.();
  }

  rotate(dir=1) {
    if(!this.active) return;
    const prevRot = this.current.rotation;
    this.current.rotation = (this.current.rotation + dir + 4) % 4;
    // 壁キック簡易: 左右補正
    if (this.collide(0,0,0)) {
      if (!this.collide(-1,0,0)) this.current.x -=1; else
      if (!this.collide(1,0,0)) this.current.x +=1; else
      if (!this.collide(0,-1,0)) this.current.y -=1; else
        this.current.rotation = prevRot; // キック失敗
    }
    this.onUpdate?.();
  }

  move(dx) {
    if(!this.active) return;
    if (!this.collide(dx,0,0)) {
      this.current.x += dx;
      this.onUpdate?.();
    }
  }

  tick(delta) {
    if(!this.active) return;
    this.dropCounter += delta;
    const interval = this.getDropInterval();
    if (this.dropCounter >= interval) {
      this.dropCounter = 0;
      if (!this.collide(0,1,0)) {
        this.current.y += 1;
      } else {
        this.lock();
      }
      this.onUpdate?.();
    }
  }

  getDropInterval() {
    const levelFactor = Math.max(50, this.dropIntervalBase - (this.level-1)*70);
    return this.softDropping ? 40 : levelFactor; // ソフトドロップ高速
  }

  collide(offX, offY, rotDelta) {
    const { type, rotation, x, y } = this.current;
    const rot = (rotation + rotDelta + 4) % 4;
    const shape = getShape(type, rot);
    for (const [sx, sy] of shape) {
      const nx = x + sx + offX;
      const ny = y + sy + offY;
      if (nx < 0 || nx >= this.cols || ny >= this.rows) return true;
      if (ny >=0 && this.matrix[ny][nx]) return true;
    }
    return false;
  }

  lock() {
    const { type, rotation, x, y } = this.current;
    const shape = getShape(type, rotation);
    for (const [sx, sy] of shape) {
      const nx = x + sx;
      const ny = y + sy;
      if (ny >=0) this.matrix[ny][nx] = type;
    }
    this.clearLines();
    this.canHold = true;
    this.spawnNew();
  }

  clearLines() {
    let cleared = 0;
    for (let r = this.rows -1; r >=0; r--) {
      if (this.matrix[r].every(c => c)) {
        this.matrix.splice(r,1);
        this.matrix.unshift(Array(this.cols).fill(null));
        cleared++;
        r++; // same row index after unshift
      }
    }
    if (cleared > 0) {
      const lineScores = [0,100,300,500,800]; // singles..tetris
      this.score += lineScores[cleared] * this.level;
      this.lines += cleared;
      const newLevel = Math.floor(this.lines / 10) + 1;
      if (newLevel > this.level) this.level = newLevel;
    }
  }

  getGhostY() {
    const savedY = this.current.y;
    while(!this.collide(0,1,0)) { this.current.y++; }
    const ghostY = this.current.y;
    this.current.y = savedY;
    return ghostY;
  }

  forEachCell(cb) {
    for (let y=0;y<this.rows;y++) {
      for (let x=0;x<this.cols;x++) {
        const t = this.matrix[y][x];
        if (t) cb(x,y,t);
      }
    }
  }

  getCurrentShape() { return getShape(this.current.type, this.current.rotation); }
  getColor(type) { return COLORS[type]; }
}
