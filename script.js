const slider = document.querySelector('.hero-slider');

if (slider) {
  const slides = [...slider.querySelectorAll('.slide')];
  const dots = [...slider.querySelectorAll('.dot')];
  const previous = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  let current = 0;
  let timer;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => slide.classList.toggle('active', position === current));
    dots.forEach((dot, position) => dot.classList.toggle('active', position === current));
  }

  function startAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), 4500);
  }

  previous.addEventListener('click', () => { showSlide(current - 1); startAutoplay(); });
  next.addEventListener('click', () => { showSlide(current + 1); startAutoplay(); });
  dots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); startAutoplay(); }));
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', () => clearInterval(timer));
  slider.addEventListener('focusout', startAutoplay);
  slider.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showSlide(current - 1);
    if (event.key === 'ArrowRight') showSlide(current + 1);
  });

  startAutoplay();
}
