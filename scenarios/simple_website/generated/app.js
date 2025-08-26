(function(){
  const GOAL = 96;
  const STEP = 4;

  const consumedEl = document.getElementById('consumed');
  const remainingEl = document.getElementById('remaining');
  const percentageEl = document.getElementById('percentage');
  const progressFill = document.getElementById('progressFill');
  const progress = document.getElementById('progress');
  const goalEl = document.getElementById('goal');

  const incBtn = document.getElementById('increment');
  const decBtn = document.getElementById('decrement');
  const resetBtn = document.getElementById('reset');
  const addCustomBtn = document.getElementById('addCustom');
  const customInput = document.getElementById('custom');

  goalEl.textContent = GOAL;

  let consumed = 0;
  let prevConsumed = 0;

  const animMap = new WeakMap();

  function clamp(v,min,max){return Math.max(min,Math.min(max,v))}

  function animateValue(el, start, end, suffix = '', duration = 420){
    start = Number(start) || 0;
    end = Number(end) || 0;
    if(start === end){ el.textContent = end + suffix; return; }
    if(animMap.has(el)) cancelAnimationFrame(animMap.get(el));
    const t0 = performance.now();
    function step(now){
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current + suffix;
      if(t < 1){
        animMap.set(el, requestAnimationFrame(step));
      } else {
        animMap.delete(el);
      }
    }
    animMap.set(el, requestAnimationFrame(step));
  }

  function animateButton(btn){
    btn.classList.add('clicked');
    setTimeout(()=>btn.classList.remove('clicked'), 160);
  }

  function render(){
    const prev = prevConsumed;
    const remaining = clamp(GOAL - consumed, 0, GOAL);
    const pct = Math.round((consumed / GOAL) * 100);

    // animate numbers
    animateValue(consumedEl, prev, consumed, '', 420);
    animateValue(remainingEl, clamp(GOAL - prev, 0, GOAL), remaining, '', 420);
    animateValue(percentageEl, Math.round((prev/GOAL)*100), pct, '%', 420);

    // animate progress using transform (GPU accelerated)
    const scale = clamp((consumed / GOAL), 0, 1);
    progressFill.style.transform = `scaleY(${scale})`;
    progress.setAttribute('aria-valuenow', consumed);

    // color tweak when reached + pulse
    if(prev < GOAL && consumed >= GOAL){
      progress.classList.add('pulse');
      setTimeout(()=> progress.classList.remove('pulse'), 900);
      progressFill.style.filter = 'saturate(1.2)';
    } else {
      progressFill.style.filter = '';
    }

    prevConsumed = consumed;

    // persist
    try{ localStorage.setItem('water_consumed', String(consumed)); } catch(e){}
  }

  function change(delta){
    consumed = clamp(consumed + delta, 0, GOAL);
    render();
  }

  incBtn.addEventListener('click', ()=>{ animateButton(incBtn); change(STEP); });
  decBtn.addEventListener('click', ()=>{ animateButton(decBtn); change(-STEP); });
  resetBtn.addEventListener('click', ()=>{
    if(confirm('Reset daily consumption to 0 oz?')){
      animateButton(resetBtn);
      consumed = 0; render();
    }
  });
  addCustomBtn.addEventListener('click', ()=>{
    const v = Number(customInput.value);
    if(!Number.isFinite(v) || v === 0){ customInput.value = ''; return; }
    animateButton(addCustomBtn);
    change(Math.round(v));
    customInput.value = '';
  });

  // keyboard shortcuts
  window.addEventListener('keydown',(e)=>{
    if(e.key === 'ArrowUp') { e.preventDefault(); animateButton(incBtn); change(STEP); }
    if(e.key === 'ArrowDown') { e.preventDefault(); animateButton(decBtn); change(-STEP); }
  });

  // load persisted
  try{
    const saved = localStorage.getItem('water_consumed');
    if(saved !== null){ consumed = clamp(Number(saved)||0,0,GOAL); }
  } catch(e){}

  prevConsumed = consumed;

  // set initial fill without animating from 0
  progressFill.style.transition = 'none';
  progressFill.style.transform = `scaleY(${clamp(consumed/GOAL,0,1)})`;
  void progressFill.offsetWidth; // force reflow
  progressFill.style.transition = '';

  render();
})();
