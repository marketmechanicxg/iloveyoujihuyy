/**
 * BUCIN — Cinematic Love Experience
 * Core Configuration System
 */

const CONFIG = {
  version: '2.0.0',
  debug: false,

  // ─── TIMING ───────────────────────────────────────────────────────
  timing: {
    preloaderMin: 2800,
    fadeIn: 1200,
    sectionTransition: 800,
    hoverDelay: 60,
    scrollThrottle: 16,
  },

  // ─── EASING ───────────────────────────────────────────────────────
  easing: {
    cinematic:   'power4.inOut',
    soft:        'power2.out',
    elastic:     'elastic.out(1, 0.4)',
    bounce:      'back.out(1.7)',
    silk:        'expo.out',
    brutal:      'power4.out',
    romantic:    'sine.inOut',
  },

  // ─── PARTICLES ────────────────────────────────────────────────────
  particles: {
    desktop: { count: 180, speed: 0.28, size: [0.8, 2.4] },
    tablet:  { count: 90,  speed: 0.22, size: [0.6, 1.8] },
    mobile:  { count: 45,  speed: 0.16, size: [0.5, 1.4] },
  },

  // ─── THREE.JS ─────────────────────────────────────────────────────
  three: {
    fov: 75,
    near: 0.1,
    far: 1000,
    cameraZ: 5,
    orbs: {
      desktop: 12,
      mobile: 6,
    },
    mouseInfluence: 0.035,
    scrollInfluence: 0.001,
  },

  // ─── BREAKPOINTS ──────────────────────────────────────────────────
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1440,
  },

  // ─── PERFORMANCE ──────────────────────────────────────────────────
  performance: {
    fpsTarget: 60,
    fpsLow: 30,
    adaptiveQuality: true,
    maxDegradationLevel: 3,
  },

  // ─── QUOTES ───────────────────────────────────────────────────────
  loadingQuotes: [
    "Every universe has a center of gravity...",
    "Some people are written in the stars.",
    "Love is the only geometry that curves time.",
    "You are the frequency I was always searching for.",
    "Before you, I was just noise. After you, I became music.",
    "There are infinite parallel universes. In all of them — you.",
  ],

  // ─── LOVE STORY DATA ──────────────────────────────────────────────
  timeline: [
    {
      date: "Second",
      title: "You're Pretty",
      quote: "But not just the kind of pretty that people notice at first glance. You're the kind of pretty that keeps getting prettier the more I know you. Every smile, every laugh, every little expression you make somehow makes you even more beautiful in my eyes. And honestly? Sometimes I still catch myself looking at you and thinking, 201cINI BENERAN GW PACARNYA?201d 😭",
      icon: "✦",
    },
    {
      date: "Third",
      title: "You're Funny",
      quote: "I swear, you can make me laugh without even trying. Sometimes it's your jokes, sometimes it's the random things you say, and sometimes it's just you being yourself. Even the simplest conversations somehow become my favorite part of the day when they're with you.",
      icon: "◈",
    },
    {
      date: "Fourth",
      title: "little things you do",
      quote: "Mungkin kamu nggak sadar, tapi hal-hal kecil yang kamu lakuin selalu bikin aku senyum. The way you ask if I've eaten, the way you remember random things about me, atau cara kamu peduli meskipun kelihatannya sederhana. Those little things make me feel loved every single day.",
      icon: "◉",
    },
    {
      date: "Fifth",
      title: "you're you",
      quote: "I love you because you're you. Not because you're perfect. Not because you always say the right things. Not because you never make mistakes. I love you because of all the little things that make you who you are... and honestly, if someone asked me why I love you, I could talk about your smile, your laugh, or how pretty you are. But at the end of the day, it all comes back to the same answer, cause you're you.",
      icon: "✧",
    },
    {
      date: "Right Now",
      title: "Every Day After",
      quote: "I don't believe in fate. But I believe in you. Which, it turns out, is the same thing.",
      icon: "♡",
    },

};

// Freeze to prevent accidental mutations
Object.freeze(CONFIG);
Object.freeze(CONFIG.timing);
Object.freeze(CONFIG.easing);
Object.freeze(CONFIG.particles);
Object.freeze(CONFIG.three);
Object.freeze(CONFIG.breakpoints);
Object.freeze(CONFIG.performance);

window.CONFIG = CONFIG;
