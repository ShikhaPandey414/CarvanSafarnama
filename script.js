// script.js — interactivity: intro, scroll fades, FAQ, accordion gallery (image panels), book slider (auto+manual), mobile nav

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- INTRO ---------- */
  const intro = document.getElementById('intro');
  const mainContent = document.getElementById('main-content');

  window.addEventListener('load', () => {
    // hide intro after ~3.5s
    setTimeout(() => {
      intro.style.display = 'none';
      mainContent.classList.remove('hidden');
      mainContent.style.animation = 'fadeInMain 600ms ease forwards';
    }, 3500);
  });

  // add fadeInMain keyframes
  const s = document.createElement('style');
  s.textContent = `@keyframes fadeInMain{from{opacity:0;transform:scale(.98)}to{opacity:1;transform:none}}`;
  document.head.appendChild(s);


  /* ---------- MOBILE NAV ---------- */
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const visible = navLinks.style.display === 'flex';
      navLinks.style.display = visible ? '' : 'flex';
      mobileToggle.setAttribute('aria-expanded', String(!visible));
    });
  }

  /* ---------- SCROLL FADE-IN ---------- */
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.fade-in-up').forEach(el => io.observe(el));


  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.accordion').forEach(acc => {
    acc.addEventListener('click', () => {
      const answer = acc.querySelector('.accordion__answer');
      const isVisible = answer.style.display === 'block';
      answer.style.display = isVisible ? 'none' : 'block';
    });
  });


  /* ---------- DESTINATIONS: ACCORDION IMAGE GALLERY ---------- */
  const panels = document.querySelectorAll('.gallery-panel');
  panels.forEach(panel => {
    // make panels focusable for keyboard
    panel.setAttribute('tabindex', '0');

    panel.addEventListener('click', () => {
      if (panel.classList.contains('active')) {
        panel.classList.remove('active');
        return;
      }
      panels.forEach(p => p.classList.remove('active'));
      panel.classList.add('active');
      panel.scrollIntoView({behavior:'smooth', inline:'center'});
    });

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        panel.click();
      }
    });
  });


  /* ---------- BOOK SLIDER (auto + manual) ---------- */
  const slider = document.querySelector('.book-slider');
  const books = Array.from(document.querySelectorAll('.book'));
  const leftBtn = document.querySelector('.book-arrow.left');
  const rightBtn = document.querySelector('.book-arrow.right');

  let currentIndex = 0;
  const gap = 20; // matches CSS gap
  const slideWidth = () => books[0]?.getBoundingClientRect().width + gap || 320;
  let autoplayInterval = null;
  const autoplayDelay = 3500;

  function scrollToIndex(i){
    if (!slider) return;
    const w = slideWidth();
    slider.scrollTo({left: Math.round(i * w), behavior: 'smooth'});
    currentIndex = i;
  }

  function nextSlide(){
    const maxIndex = Math.max(0, books.length - 1);
    const next = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1;
    scrollToIndex(next);
  }
  function prevSlide(){
    const maxIndex = Math.max(0, books.length - 1);
    const prev = (currentIndex - 1) < 0 ? maxIndex : currentIndex - 1;
    scrollToIndex(prev);
  }

  leftBtn && leftBtn.addEventListener('click', () => { stopAutoplay(); prevSlide(); startAutoplay(); });
  rightBtn && rightBtn.addEventListener('click', () => { stopAutoplay(); nextSlide(); startAutoplay(); });

  function startAutoplay(){
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, autoplayDelay);
  }
  function stopAutoplay(){
    if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null; }
  }

  slider && slider.addEventListener('mouseenter', stopAutoplay);
  slider && slider.addEventListener('mouseleave', startAutoplay);

  let scrollDebounce = null;
  slider && slider.addEventListener('scroll', () => {
    if (scrollDebounce) clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(() => {
      const w = slideWidth();
      currentIndex = Math.round((slider.scrollLeft || 0) / w);
    }, 80);
  });

  if (books.length > 0) {
    scrollToIndex(0);
    startAutoplay();
  }

});
