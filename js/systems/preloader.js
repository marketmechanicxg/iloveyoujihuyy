/**
 * BUCIN — Preloader System
 * Emotional loading experience with quotes and animations
 */

// Safety: if GSAP failed to load, provide a no-op stub so nothing crashes
if (typeof gsap === 'undefined') {
  window.gsap = {
    to: (target, vars) => { if (vars.onComplete) setTimeout(vars.onComplete, (vars.duration || 0) * 1000); return {}; },
    set: () => {},
    timeline: (vars) => {
      const tl = {
        to: function(t, v, pos) { if (v.onComplete) setTimeout(v.onComplete, (v.duration || 0) * 1000); return tl; },
        onComplete: vars?.onComplete,
      };
      if (vars?.onComplete) setTimeout(vars.onComplete, 100);
      return tl;
    },
  };
  console.warn('[Preloader] GSAP not loaded — using fallback stub');
}

class Preloader {
  constructor() {
    this.el = document.getElementById('preloader');
    this.progress = 0;
    this.targetProgress = 0;
    this._quoteIndex = 0;
    this._quoteTimer = null;
    this._raf = null;
  }

  run() {
    return new Promise((resolve) => {
      if (!this.el) { resolve(); return; }

      this._startQuoteRotation();
      this._animateHeartbeat();
      this._simulateLoading(() => {
        this._complete(resolve);
      });
    });
  }

  _startQuoteRotation() {
    const quoteEl = this.el.querySelector('.preloader__quote');
    if (!quoteEl) return;

    const showQuote = (idx) => {
      const text = CONFIG.loadingQuotes[idx % CONFIG.loadingQuotes.length];
      gsap.to(quoteEl, {
        opacity: 0,
        y: -10,
        filter: 'blur(6px)',
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          quoteEl.textContent = text;
          gsap.to(quoteEl, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: CONFIG.easing.silk,
          });
        }
      });
    };

    showQuote(0);
    this._quoteTimer = setInterval(() => {
      this._quoteIndex++;
      showQuote(this._quoteIndex);
    }, 1800);
  }

  _animateHeartbeat() {
    const heart = this.el.querySelector('.preloader__heart');
    if (!heart) return;

    const beat = () => {
      gsap.timeline({ repeat: -1, repeatDelay: 0.6 })
        .to(heart, { scale: 1.25, duration: 0.18, ease: 'power2.out' })
        .to(heart, { scale: 1.0, duration: 0.18, ease: 'power2.in' })
        .to(heart, { scale: 1.15, duration: 0.12, ease: 'power2.out' })
        .to(heart, { scale: 1.0, duration: 0.12, ease: 'power2.in' });
    };
    beat();

    // Pulse glow
    gsap.to(heart, {
      filter: 'drop-shadow(0 0 30px rgba(255, 100, 160, 0.9))',
      duration: 0.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  _simulateLoading(onComplete) {
    const progressEl = this.el.querySelector('.preloader__percent');
    const barFill = this.el.querySelector('.preloader__bar-fill');
    const particleRing = this.el.querySelector('.preloader__ring');

    let current = 0;
    const min = CONFIG.timing.preloaderMin;
    const startTime = Date.now();

    // Hard cap: never hang longer than preloaderMin + 4s
    const hardTimeout = setTimeout(() => {
      onComplete();
    }, min + 4000);

    // Simulate resource loading
    const chunks = [
      { target: 30, delay: 200 },
      { target: 55, delay: 500 },
      { target: 72, delay: 800 },
      { target: 88, delay: 400 },
      { target: 100, delay: 600 },
    ];

    let chunkIdx = 0;
    const processChunk = () => {
      if (chunkIdx >= chunks.length) return;
      const { target, delay } = chunks[chunkIdx++];

      setTimeout(() => {
        gsap.to({ val: current }, {
          val: target,
          duration: delay / 1000 * 1.2,
          ease: chunkIdx === chunks.length ? 'power2.in' : 'power1.out',
          onUpdate: function() {
            current = Math.round(this.targets()[0].val);
            if (progressEl) progressEl.textContent = `${current}%`;
            if (barFill) gsap.set(barFill, { width: `${current}%` });
            if (particleRing) {
              gsap.set(particleRing, {
                rotation: current * 3.6,
              });
            }
          },
          onComplete: () => {
            if (chunkIdx < chunks.length) {
              processChunk();
            } else {
              clearTimeout(hardTimeout);
              // Ensure minimum display time
              const elapsed = Date.now() - startTime;
              const remaining = Math.max(0, min - elapsed);
              setTimeout(onComplete, remaining);
            }
          }
        });
      }, 100);
    };

    processChunk();
  }

  _complete(resolve) {
    clearInterval(this._quoteTimer);

    // Safety fallback — if GSAP fails or an element is missing,
    // force-finish the preloader after 2 s so the page never stays stuck.
    const fallbackTimer = setTimeout(() => {
      if (this.el) this.el.style.display = 'none';
      document.body.classList.add('loaded');
      if (typeof State !== 'undefined') State.set('preloaderDone', true);
      resolve();
    }, 2000);

    const quoteEl   = this.el?.querySelector('.preloader__quote');
    const contentEl = this.el?.querySelector('.preloader__content');

    // Burst particles
    this._burstParticles();

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallbackTimer);
        resolve();
      }
    });

    if (quoteEl) {
      tl.to(quoteEl, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.in',
      });
    }

    if (contentEl) {
      tl.to(contentEl, {
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        ease: 'power3.in',
      }, quoteEl ? '-=0.3' : 0);
    }

    tl.to(this.el, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        this.el.style.display = 'none';
        document.body.classList.add('loaded');
        if (typeof State !== 'undefined') State.set('preloaderDone', true);
      }
    }, (quoteEl || contentEl) ? '-=0.3' : 0);
  }

  _burstParticles() {
    const container = this.el;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: absolute;
        width: 4px; height: 4px;
        border-radius: 50%;
        background: hsl(${330 + Math.random() * 50}, 90%, 75%);
        left: 50%; top: 50%;
        pointer-events: none;
        z-index: 10;
      `;
      container.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 150;
      gsap.to(p, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: 0,
        duration: 0.9 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: () => p.remove(),
      });
    }
  }

  destroy() {
    clearInterval(this._quoteTimer);
    cancelAnimationFrame(this._raf);
  }
}

window.Preloader = Preloader;
