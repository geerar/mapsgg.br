(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window)) return;
  const headings = [...document.querySelectorAll('.hero h1, .section-heading h2, .locations-heading h2, .final-cta h2')].filter(heading => !heading.closest('#duvidas, #servicos'));
  headings.forEach(heading => {
    let index = 0;
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(word => {
        if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
        const span = document.createElement('span');
        span.className = 'motion-word'; span.textContent = word;
        span.style.setProperty('--word-delay', `${Math.min(index++ * 45, 360)}ms`);
        fragment.append(span);
      });
      node.replaceWith(fragment);
    });
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!reduce.matches) entry.target.classList.add('motion-enter');
      observer.unobserve(entry.target);
    });
  }, {threshold: 0.12});
  headings.forEach(heading => observer.observe(heading));
  const section = document.querySelector('.brand-statement');
  if (!section) return;
  const title = section.querySelector('h2');
  let scheduled = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  function update() {
    scheduled = false;
    if (reduce.matches) { section.classList.remove('statement-motion'); title.style.removeProperty('--statement-progress'); return; }
    const rect = section.getBoundingClientRect();
    const progress = clamp((window.innerHeight * .85 - rect.top) / (window.innerHeight * .60));
    section.classList.add('statement-motion');
    title.style.setProperty('--statement-progress', progress.toFixed(4));
  }
  function requestUpdate() { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', requestUpdate, {passive:true});
  reduce.addEventListener('change', requestUpdate);
  update();
})();
