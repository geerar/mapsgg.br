(() => {
 const root = document.querySelector('.process-slider');
 if (!root) return;
 const slides = [...root.querySelectorAll('.process-slide')];
 const dots = [...root.querySelectorAll('[data-step]')];
 let current = 0;
 function show(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.hidden = i !== current; });
  dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
  root.querySelector('.process-status').textContent = `Passo ${current + 1} de ${slides.length}`;
 }
 root.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => show(current + Number(button.dataset.direction))));
 dots.forEach(button => button.addEventListener('click', () => show(Number(button.dataset.step))));
 root.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
   event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
   dots[current].focus();
  }
 });
 let start = null;
 root.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') start = {x:event.clientX,y:event.clientY}; });
 root.addEventListener('pointercancel', () => {start=null;});
 root.addEventListener('pointerup', event => {
  if (!start) return;
  const dx=event.clientX-start.x, dy=event.clientY-start.y; start=null;
  if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) show(current+(dx<0?1:-1));
 });
})();
