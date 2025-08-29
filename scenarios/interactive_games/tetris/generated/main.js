// main.js - レンダリングとUI制御
import { Game } from './game.js';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const W = canvas.width; const H = canvas.height;
const COLS = 10; const ROWS = 20; const CELL = W / COLS; // 30px

// DOM
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const linesEl = document.getElementById('lines');
const nextContainer = document.getElementById('next-container');
const holdContainer = document.getElementById('hold-container');
const pauseOverlay = document.getElementById('pause-overlay');
const modal = document.getElementById('modal');
const finalScoreEl = document.getElementById('final-score');
const nameForm = document.getElementById('name-form');
const playerNameInput = document.getElementById('player-name');
const highscoreList = document.getElementById('highscore-list');

// Scenes
const scenes = {
  title: document.getElementById('scene-title'),
  game: document.getElementById('scene-game'),
  highscores: document.getElementById('scene-highscores'),
  howto: document.getElementById('scene-howto')
};
let currentScene = 'title';
function showScene(name) {
  for (const k in scenes) scenes[k].classList.add('hidden');
  scenes[name].classList.remove('hidden');
  scenes[name].classList.add('active');
  currentScene = name;
}

// Highscore store
const HS_KEY = 'tetris_highscores_v1';
function loadScores() { return JSON.parse(localStorage.getItem(HS_KEY) || '[]'); }
function saveScore(name, score) {
  const scores = loadScores();
  scores.push({name, score});
  scores.sort((a,b)=>b.score-a.score);
  const trimmed = scores.slice(0,10);
  localStorage.setItem(HS_KEY, JSON.stringify(trimmed));
}
function renderScores() {
  const scores = loadScores();
  highscoreList.innerHTML = '';
  if (scores.length===0) {
    highscoreList.innerHTML = '<li style="justify-content:center;opacity:.6">なし</li>';
    return;
  }
  scores.forEach((s,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<span>${String(i+1).padStart(2,'0')} ${escapeHtml(s.name)}</span><strong>${s.score}</strong>`;
    highscoreList.appendChild(li);
  });
}

function escapeHtml(str){ return str.replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

let game = null;
let paused = false;
let lastTime = 0;

function startGame() {
  game = new Game({ cols:COLS, rows:ROWS, onUpdate:updateHUD, onGameOver: onGameOver });
  paused = false;
  pauseOverlay.classList.add('hidden');
  showScene('game');
  modal.classList.add('hidden');
  nameForm.classList.add('hidden');
  requestAnimationFrame(loop);
  updateHUD();
}

function updateHUD() {
  if (!game) return;
  scoreEl.textContent = game.score;
  levelEl.textContent = game.level;
  linesEl.textContent = game.lines;
  renderNext();
  renderHold();
}

function renderNext() {
  nextContainer.innerHTML='';
  // queue 先頭 3
  for (let i=0;i<3;i++) {
    const type = game.queue[i];
    const mini = document.createElement('div');
    mini.style.display='grid';
    mini.style.gridTemplateColumns='repeat(4,1fr)';
    mini.style.gridTemplateRows='repeat(4,1fr)';
    mini.style.width='96px'; mini.style.height='96px';
    const shape = game ? game.getCurrentShape() : [];
    // 実際には pieces.js のSHAPESを使って描画する簡略(0回転形を取得)
    import('./pieces.js').then(m=>{
      const shape0 = m.SHAPES[type][0];
      const color = m.COLORS[type];
      for (let y=0;y<4;y++) {
        for (let x=0;x<4;x++) {
          const cell = document.createElement('div');
          cell.className='cell';
          const found = shape0.some(([sx,sy])=>sx===x && sy===y);
          if(found){ cell.classList.add('filled'); cell.style.background=color; }
          mini.appendChild(cell);
        }
      }
    });
    nextContainer.appendChild(mini);
  }
}

function renderHold() {
  holdContainer.innerHTML='';
  const type = game.holdPiece;
  if(!type) return;
  import('./pieces.js').then(m=>{
    const shape0 = m.SHAPES[type][0];
    const color = m.COLORS[type];
    for (let y=0;y<4;y++) {
      for (let x=0;x<4;x++) {
        const cell = document.createElement('div');
        cell.className='cell';
        const found = shape0.some(([sx,sy])=>sx===x && sy===y);
        if(found){ cell.classList.add('filled'); cell.style.background=color; }
        holdContainer.appendChild(cell);
      }
    }
  });
}

function loop(time) {
  if(!game) return;
  const delta = time - lastTime; lastTime = time;
  if(!paused) game.tick(delta);
  draw();
  if (game.active) requestAnimationFrame(loop);
}

function draw() {
  ctx.clearRect(0,0,W,H);
  // 背景グリッド
  ctx.save();
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  for (let x=0;x<=COLS;x++) { ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,H); ctx.stroke(); }
  for (let y=0;y<=ROWS;y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(W,y*CELL); ctx.stroke(); }
  ctx.restore();

  // 固定ブロック
  game.forEachCell((x,y,t)=>{
    drawCell(x,y, game.getColor(t));
  });

  // ゴースト
  const ghostY = game.getGhostY();
  ctx.save();
  ctx.globalAlpha = 0.28;
  for (const [sx,sy] of game.getCurrentShape()) {
    drawCell(game.current.x+sx, ghostY+sy, game.getColor(game.current.type), false);
  }
  ctx.restore();

  // 現在のピース
  for (const [sx,sy] of game.getCurrentShape()) {
    drawCell(game.current.x+sx, game.current.y+sy, game.getColor(game.current.type));
  }
}

function drawCell(x,y,color) {
  const px = x*CELL; const py = y*CELL;
  ctx.fillStyle = color;
  ctx.fillRect(px,py,CELL,CELL);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(px+1,py+1,CELL-2,CELL-2);
}

// hexToRGBA 不要になったため削除

function onGameOver() {
  finalScoreEl.textContent = `スコア: ${game.score}`;
  modal.classList.remove('hidden');
  nameForm.classList.remove('hidden');
  playerNameInput.focus();
}

nameForm.addEventListener('submit', e=>{
  e.preventDefault();
  const name = playerNameInput.value.trim() || 'PLAYER';
  saveScore(name, game.score);
  nameForm.classList.add('hidden');
  renderScores();
});

// Buttons
const btnStart = document.getElementById('btn-start');
const btnHigh = document.getElementById('btn-highscores');
const btnHow = document.getElementById('btn-howto');
const btnPause = document.getElementById('btn-pause');
const btnBackTitle = document.getElementById('btn-back-title');
const btnRestart = document.getElementById('btn-restart');
const btnModalClose = document.getElementById('btn-modal-close');

btnStart.addEventListener('click', startGame);
btnHigh.addEventListener('click', ()=>{ renderScores(); showScene('highscores'); });
btnHow.addEventListener('click', ()=> showScene('howto'));
btnPause.addEventListener('click', togglePause);
btnBackTitle.addEventListener('click', ()=>{ showScene('title'); });
btnRestart.addEventListener('click', ()=>{ modal.classList.add('hidden'); startGame(); });
btnModalClose.addEventListener('click', ()=>{ modal.classList.add('hidden'); showScene('title'); });

// Back buttons with data-back
Array.from(document.querySelectorAll('[data-back]')).forEach(btn => btn.addEventListener('click', ()=> showScene('title')));

function togglePause() {
  if(!game) return;
  paused = !paused;
  pauseOverlay.classList.toggle('hidden', !paused);
}

// Input handling
window.addEventListener('keydown', e=>{
  if (currentScene !== 'game') return;
  switch(e.code) {
    case 'ArrowLeft': game.move(-1); e.preventDefault(); break;
    case 'ArrowRight': game.move(1); e.preventDefault(); break;
    case 'ArrowUp': game.rotate(1); e.preventDefault(); break;
    case 'Space': game.hardDrop(); e.preventDefault(); break;
    case 'ArrowDown': game.softDrop(true); e.preventDefault(); break;
    case 'KeyC': case 'ShiftLeft': case 'ShiftRight': game.hold(); e.preventDefault(); break;
    case 'KeyP': case 'Escape': togglePause(); e.preventDefault(); break;
  }
});
window.addEventListener('keyup', e=>{
  if (currentScene !== 'game') return;
  if (e.code === 'ArrowDown') game.softDrop(false);
});

// Prevent page scroll with arrows / space
window.addEventListener('keydown', e=>{
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
},{ passive:false });

// 初期化
showScene('title');
renderScores();

