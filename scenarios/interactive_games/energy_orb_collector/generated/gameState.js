import { CONFIG } from './config.js';

export const GamePhase = Object.freeze({ TITLE:'TITLE', COUNTDOWN:'COUNTDOWN', PLAYING:'PLAYING', RESULT:'RESULT' });

export class GameState {
  constructor(){
    this.phase = GamePhase.TITLE;
    this.timeRemaining = CONFIG.SESSION_DURATION;
    this.elapsed = 0;
    this.score = 0;
    this.highScore = this._loadHighScore();
    this.collectedCount = 0;
  }
  _loadHighScore(){
    try{ return parseInt(localStorage.getItem(CONFIG.STORAGE_KEY) || '0',10); }catch(e){ return 0; }
  }
  _saveHighScore(){
    if(this.score > this.highScore){
      this.highScore = this.score;
      try{ localStorage.setItem(CONFIG.STORAGE_KEY, String(this.highScore)); }catch(e){}
    }
  }
  startCountdown(){ this.phase = GamePhase.COUNTDOWN; this.countdownTime = 3; }
  startPlay(){ this.phase = GamePhase.PLAYING; this.timeRemaining = CONFIG.SESSION_DURATION; this.elapsed = 0; this.score = 0; this.collectedCount=0; }
  update(dt){
    if(this.phase === GamePhase.COUNTDOWN){
      this.countdownTime -= dt;
      if(this.countdownTime <= 0){ this.startPlay(); }
    } else if(this.phase === GamePhase.PLAYING){
      this.timeRemaining -= dt;
      this.elapsed += dt;
      if(this.timeRemaining <= 0){ this.timeRemaining = 0; this.endSession(); }
    }
  }
  addScore(orbs){
    if(!orbs) return;
    // TODO: combo multiplier extension [P2]
    this.score += orbs * CONFIG.ORB_BASE_VALUE;
    this.collectedCount += orbs;
  }
  endSession(){ this.phase = GamePhase.RESULT; this._saveHighScore(); }
  retry(){ this.startCountdown(); }
  currentMaxOrbs(){
    const t = CONFIG.SESSION_DURATION - this.timeRemaining; // elapsed
    let max = CONFIG.MAX_ORBS_PHASES[0].count;
    for(const p of CONFIG.MAX_ORBS_PHASES){ if(t >= p.t) max = p.count; }
    return max;
  }
}
