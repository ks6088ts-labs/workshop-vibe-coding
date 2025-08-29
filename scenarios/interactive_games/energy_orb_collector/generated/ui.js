import { GamePhase } from './gameState.js';

export class UIController {
  constructor(state){
    this.state = state;
    this.titleScreen = document.getElementById('title-screen');
    this.hud = document.getElementById('hud');
    this.resultScreen = document.getElementById('result-screen');
    this.timeEl = document.getElementById('time-remaining');
    this.scoreEl = document.getElementById('score');
    this.highScoreEl = document.getElementById('high-score');
    this.orbCountEl = document.getElementById('orb-count');
    this.finalScoreEl = document.getElementById('final-score');
    this.avgScoreEl = document.getElementById('avg-score');
    this.finalHighScoreEl = document.getElementById('final-high-score');
    document.getElementById('start-btn').addEventListener('click', ()=> this.state.startCountdown());
    document.getElementById('retry-btn').addEventListener('click', ()=> this.state.retry());
  }
  update(orbCount){
  // Phase handling with explicit visible/hidden sync to avoid class conflict
  const setVis = (el, show)=>{ el.classList.toggle('hidden', !show); el.classList.toggle('visible', show); };
  setVis(this.titleScreen, this.state.phase === GamePhase.TITLE);
  setVis(this.hud, (this.state.phase === GamePhase.COUNTDOWN || this.state.phase === GamePhase.PLAYING));
  setVis(this.resultScreen, this.state.phase === GamePhase.RESULT);

    if(this.state.phase === GamePhase.COUNTDOWN){
      this.timeEl.textContent = Math.ceil(this.state.countdownTime).toString();
    } else if(this.state.phase === GamePhase.PLAYING){
      const t = Math.ceil(this.state.timeRemaining);
      this.timeEl.textContent = t.toString();
      this.timeEl.classList.toggle('warning', t <= 10);
    } else if(this.state.phase === GamePhase.RESULT){
      this.finalScoreEl.textContent = this.state.score.toString();
      const duration = Math.max(1, this.state.elapsed);
      const avg = (this.state.collectedCount / duration).toFixed(2);
      this.avgScoreEl.textContent = avg;
      this.finalHighScoreEl.textContent = this.state.highScore.toString();
    }

    this.scoreEl.textContent = this.state.score.toString();
    this.highScoreEl.textContent = this.state.highScore.toString();
    this.orbCountEl.textContent = orbCount.toString();
  }
}
