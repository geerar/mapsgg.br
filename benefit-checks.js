(() => {
 const cards = [...document.querySelectorAll('.benefit-grid article')];
 const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
 if (!cards.length || !('IntersectionObserver' in window) || reduce.matches) return;
 const timers = new Set();
 let nextAt = 0;
 const observer = new IntersectionObserver(entries => {
  entries.filter(entry => entry.isIntersecting).sort((a,b) => cards.indexOf(a.target)-cards.indexOf(b.target)).forEach(entry => {
   observer.unobserve(entry.target);
   const now = performance.now();
   const delay = Math.max(120, nextAt-now);
   nextAt = now+delay+420;
   const timer = setTimeout(() => {
    entry.target.classList.add('check-active'); timers.delete(timer);
   },delay);
   timers.add(timer);
  });
 }, {threshold:.35});
 cards.forEach(card => {card.classList.add('check-pending');observer.observe(card);});
 reduce.addEventListener('change', () => {
  if (!reduce.matches) return;
  observer.disconnect(); timers.forEach(clearTimeout);timers.clear();
  cards.forEach(card => card.classList.add('check-active'));
 });
})();
