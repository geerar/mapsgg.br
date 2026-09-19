(() => {
  const nav = document.querySelector('.site-header nav');
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll(':scope > a'));
  if (!links.length) return;
  nav.classList.add('nav-moving-frame');
  const frame = document.createElement('span');
  frame.className = 'nav-follow-frame';
  frame.setAttribute('aria-hidden', 'true');
  nav.append(frame);
  let hovered = null;
  let selected = null;
  let revealFrame;
  function update() {
    const focused = links.includes(document.activeElement) ? document.activeElement : null;
    const target = hovered || focused;
    links.forEach(link => link.classList.toggle('is-nav-target', link === target));
    if (!target || !nav.getClientRects().length) {
      cancelAnimationFrame(revealFrame);
      frame.classList.remove('is-visible', 'is-positioning');
      selected = null;
      return;
    }
    const scale = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 1.055;
    const width = target.offsetWidth * scale;
    const height = target.offsetHeight * scale;
    const left = target.offsetLeft - (width - target.offsetWidth) / 2;
    const top = target.offsetTop - (height - target.offsetHeight) / 2;
    const entering = !selected;
    if (entering) frame.classList.add('is-positioning');
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
    frame.style.transform = `translate(${left}px, ${top}px)`;
    frame.classList.add('is-visible');
    selected = target;
    if (entering) {
      cancelAnimationFrame(revealFrame);
      revealFrame = requestAnimationFrame(() => {
        revealFrame = requestAnimationFrame(() => frame.classList.remove('is-positioning'));
      });
    }
  }
  links.forEach(link => {
    link.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hovered = link;
      update();
    });
  });
  nav.addEventListener('pointerleave', () => { hovered = null; update(); });
  nav.addEventListener('focusin', update);
  nav.addEventListener('focusout', () => requestAnimationFrame(update));
  window.addEventListener('blur', () => { hovered = null; update(); });
  window.addEventListener('resize', update);
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(nav);
  if (document.fonts) document.fonts.ready.then(update);
})();
