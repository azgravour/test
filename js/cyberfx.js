// ============================================================
// Effets d'ambiance purement décoratifs pour la vitrine (particules
// dorées en canvas). Aucune dépendance sur l'état de l'application,
// aucune donnée, aucun appel réseau — seulement du visuel.
// ============================================================
(function () {
  'use strict';
  var canvas = document.getElementById('cyberParticles');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  var particles = [];
  var COUNT = window.innerWidth < 480 ? 26 : 46;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.6 + Math.random() * 1.6,
      speed: 0.08 + Math.random() * 0.22,
      drift: (Math.random() - 0.5) * 0.12,
      alpha: 0.15 + Math.random() * 0.35,
      twinkleSpeed: 0.004 + Math.random() * 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < COUNT; i++) particles.push(makeParticle());
  }

  var t = 0;
  function tick() {
    t++;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      var tw = 0.6 + 0.4 * Math.sin(t * p.twinkleSpeed + p.twinklePhase);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,175,55,' + (p.alpha * tw).toFixed(3) + ')';
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });

  init();
  requestAnimationFrame(tick);
})();
