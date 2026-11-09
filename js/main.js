(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const header = document.querySelector('.site-header');
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }
  menuButton.addEventListener('click', () => {
    if (menuButton.getAttribute('aria-expanded') === 'true') return closeMenu();
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Fechar menu');
    nav.classList.add('is-open');
    document.body.classList.add('menu-open');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) closeMenu(); });
  const desktopMotion = window.matchMedia('(min-width: 960px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
  const hero = document.querySelector('.hero');
  const heroPin = document.querySelector('.hero-pin');
  const heroCopy = document.querySelector('.hero-copy');
  const heroVisual = document.querySelector('.hero-visual');
  const heroFrame = document.querySelector('.hero-image-wrap');
  const heroBottom = document.querySelector('.hero-bottom');
  const heroExpansion = document.querySelector('.hero-expansion');
  const heroCaption = document.querySelector('.hero-expansion-caption');
  const showcase = document.querySelector('.service-showcase');
  const stage = document.querySelector('.service-stage');
  const chapters = [...document.querySelectorAll('.service-chapter')];
  const serviceProgress = document.querySelector('.service-progress');
  const story = document.querySelector('.story');
  const yearArt = document.querySelector('.year-art');
  const storySteps = [...document.querySelectorAll('.story-step')];
  const convenience = document.querySelector('.convenience');
  const bag = document.querySelector('.bag-art');
  const bagHandle = document.querySelector('.bag-handle');
  const bagMouth = document.querySelector('.bag-mouth');
  const bagFlap = document.querySelector('.bag-flap');
  const bagProduce = [...document.querySelectorAll('.bag-produce')];
  const journeyCaption = document.querySelector('.journey-caption');
  const journeyCaptionNumber = document.querySelector('.journey-caption-number');
  const journeyCaptionText = journeyCaption.querySelector('strong');
  const journeyWords = [...document.querySelectorAll('.journey-word')];
  const journeyCta = document.querySelector('.journey-cta');
  const journeyTrack = document.querySelector('.journey-track span');
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const p = clamp(value); return p * p * (3 - 2 * p); };
  let active = false;
  let ticking = false;

  function resetSceneStyles() {
    [heroCopy, heroVisual, heroBottom, heroExpansion, heroCaption, yearArt, bag, bagHandle, bagMouth, bagFlap, journeyCaption, journeyCta, journeyTrack, ...journeyWords, ...chapters, ...storySteps, ...bagProduce].forEach(element => element.removeAttribute('style'));
    stage.removeAttribute('data-active');
    serviceProgress.textContent = '01 / 04';
    journeyCaptionNumber.textContent = '01 / 03';
    journeyCaptionText.textContent = 'Escolha o que precisa.';
  }

  function setMotionMode() {
    const next = desktopMotion.matches;
    if (active !== next) {
      active = next;
      document.documentElement.classList.toggle('motion-enhanced', active);
      if (!active) resetSceneStyles();
    }
    requestTick();
  }

  function updateHero() {
    const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
    const p = clamp(-hero.getBoundingClientRect().top / travel);
    const grow = smooth((p - 0.06) / 0.82);
    const pinRect = heroPin.getBoundingClientRect();
    const frameRect = heroFrame.getBoundingClientRect();
    const top = (frameRect.top - pinRect.top) * (1 - grow);
    const left = (frameRect.left - pinRect.left) * (1 - grow);
    const right = (pinRect.right - frameRect.right) * (1 - grow);
    const bottom = (pinRect.bottom - frameRect.bottom) * (1 - grow);
    const radius = 180 * (1 - grow);
    heroExpansion.style.clipPath = `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round ${radius.toFixed(1)}px)`;
    heroExpansion.style.opacity = clamp((p - 0.14) / 0.24).toFixed(3);
    heroCopy.style.opacity = (1 - clamp((p - 0.20) / 0.27)).toFixed(3);
    heroCopy.style.transform = `translate3d(${(-55 * smooth(p)).toFixed(1)}px,0,0)`;
    heroVisual.style.opacity = (1 - clamp((p - 0.24) / 0.22)).toFixed(3);
    heroBottom.style.opacity = (1 - clamp((p - 0.20) / 0.22)).toFixed(3);
    heroCaption.style.opacity = smooth((p - 0.69) / 0.18).toFixed(3);
  }

  function updateServices() {
    const rect = showcase.getBoundingClientRect();
    const stageTop = stage.getBoundingClientRect().top;
    const travel = Math.max(1, rect.height - stage.offsetHeight);
    const p = clamp((stageTop - rect.top) / travel);
    const phase = p * (chapters.length - 1);
    const base = Math.min(chapters.length - 1, Math.floor(phase));
    const next = Math.min(chapters.length - 1, base + 1);
    const wipe = smooth((phase - base - 0.52) / 0.48);
    const current = wipe > 0.5 ? next : base;
    stage.dataset.active = String(current);
    serviceProgress.textContent = `${String(current + 1).padStart(2, '0')} / 04`;
    chapters.forEach((chapter, index) => {
      const isBase = index === base;
      const isNext = index === next && next !== base;
      chapter.style.opacity = isBase || isNext ? '1' : '0';
      chapter.style.clipPath = isNext ? `inset(0 0 0 ${(100 * (1 - wipe)).toFixed(1)}%)` : 'inset(0 0 0 0)';
      chapter.style.transform = isNext ? `translate3d(${(28 * (1 - wipe)).toFixed(1)}px,0,0)` : 'translate3d(0,0,0)';
      chapter.style.zIndex = isNext ? '2' : isBase ? '1' : '0';
      chapter.style.pointerEvents = index === current ? 'auto' : 'none';
    });
  }

  function updateStory() {
    const rect = story.getBoundingClientRect();
    const p = clamp((window.innerHeight * 0.82 - rect.top) / (rect.height + window.innerHeight * 0.45));
    const moved = smooth(p);
    yearArt.style.transform = `translate3d(${(8 * (1 - moved)).toFixed(1)}px,${(18 * (1 - moved)).toFixed(1)}px,0) rotate(${(-5 + 5 * moved).toFixed(1)}deg) scale(${(1.24 - 0.24 * moved).toFixed(3)})`;
    yearArt.style.opacity = (0.65 + 0.35 * moved).toFixed(3);
    storySteps.forEach((step, index) => {
      const emphasis = smooth((p - (0.12 + index * 0.17)) / 0.24);
      step.style.opacity = (0.72 + 0.28 * emphasis).toFixed(3);
      step.style.transform = `translate3d(0,${(10 * (1 - emphasis)).toFixed(1)}px,0)`;
    });
  }

  function updateBag() {
    const rect = convenience.getBoundingClientRect();
    const p = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
    const enter = smooth(p / 0.16);
    const open = smooth((p - 0.12) / 0.18);
    const close = smooth((p - 0.75) / 0.13);
    const send = smooth((p - 0.83) / 0.17);
    bag.style.transform = `translate3d(${(92 * send).toFixed(1)}px,${(60 * (1 - enter) - 22 * send).toFixed(1)}px,0) rotate(${(-14 + 12 * enter + 7 * send).toFixed(1)}deg) scale(${(0.78 + 0.22 * enter - 0.06 * send).toFixed(3)})`;
    bag.style.opacity = enter.toFixed(3);
    bagHandle.style.transform = `translate3d(0,${(-27 * open + 27 * close).toFixed(1)}px,0) rotateX(${(38 * open - 38 * close).toFixed(1)}deg)`;
    bagMouth.style.transform = `scaleY(${(0.25 + 0.75 * open - 0.7 * close).toFixed(3)})`;
    bagFlap.style.transform = `rotateX(${(-80 + 80 * close).toFixed(1)}deg)`;
    bagFlap.style.opacity = close.toFixed(3);
    const targets = [[110, 160], [-35, 185], [-110, 170]];
    const arrivals = [[-105, -135], [0, -145], [115, -140]];
    bagProduce.forEach((item, index) => {
      const appear = smooth((p - (0.24 + index * 0.05)) / 0.11);
      const pack = smooth((p - (0.48 + index * 0.075)) / 0.13);
      const x = arrivals[index][0] * (1 - appear) + targets[index][0] * pack;
      const y = arrivals[index][1] * (1 - appear) + targets[index][1] * pack;
      const angle = [-32, 12, 28][index] + [42, -32, -35][index] * pack;
      item.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${angle.toFixed(1)}deg) scale(${(0.7 + 0.3 * appear - 0.22 * pack).toFixed(3)})`;
      item.style.opacity = (appear * (1 - smooth((pack - 0.76) / 0.24))).toFixed(3);
    });
    journeyWords.forEach((word, index) => {
      const reveal = smooth((p - (0.22 + index * 0.12)) / 0.09);
      word.style.opacity = (0.74 * reveal * (1 - close)).toFixed(3);
    });
    journeyTrack.style.transform = `scaleX(${p.toFixed(4)})`;
    const act = p < 0.46 ? 0 : p < 0.78 ? 1 : 2;
    const captions = ['Escolha o que precisa.', 'Tudo se organiza.', 'A compra vai até você.'];
    journeyCaptionNumber.textContent = `0${act + 1} / 03`;
    journeyCaptionText.textContent = captions[act];
    journeyCta.style.opacity = smooth((p - 0.82) / 0.14).toFixed(3);
    journeyCta.style.transform = `translate3d(0,${(20 * (1 - send)).toFixed(1)}px,0)`;
    journeyCta.style.pointerEvents = p > 0.85 ? 'auto' : 'none';
  }

  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    if (active) {
      updateHero();
      updateServices();
      updateStory();
      updateBag();
    }
    ticking = false;
  }
  function requestTick() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  if (desktopMotion.addEventListener) desktopMotion.addEventListener('change', setMotionMode);
  else desktopMotion.addListener(setMotionMode);
  setMotionMode();
})();
