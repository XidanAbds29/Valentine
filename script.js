// ============================
// Valentine's Day - Ramisha 💝
// ============================

document.addEventListener('DOMContentLoaded', () => {
  initQuiz();
  initFloatingHearts();
  initSparkles();
  initScrollReveal();
  initTypewriter();
});

// ---- DO YOU LOVE ME? QUIZ ----
function initQuiz() {
  const quizScreen = document.getElementById('quizScreen');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const question = document.getElementById('quizQuestion');
  const sub = document.getElementById('quizSub');
  const counter = document.getElementById('noCounter');
  const canvas = document.getElementById('confettiCanvas');
  const landing = document.getElementById('landing');

  let noCount = 0;

  const noTexts = [
    { q: "Are you sure? 🥺", s: "Think again...", btn: "Nope 😤" },
    { q: "Really really sure?? 😢", s: "I'm getting sad...", btn: "Still no 😠" },
    { q: "You're breaking my heart 💔", s: "Please reconsider...", btn: "NO! 🙅" },
    { q: "I'll cry... 😭😭", s: "Look what you're doing to me!", btn: "Hmm..." },
    { q: "My heart can't take this 😩", s: "Just press Yes already!", btn: "Maybe..." },
    { q: "PLEASE?? 🥹🥹🥹", s: "I'm on my knees...", btn: "Okay fine..." },
    { q: "Last chance... 💀", s: "There's only one right answer", btn: "..." },
  ];

  // YES button grows with each NO
  const yesScales = [1, 1.2, 1.4, 1.6, 1.9, 2.2, 2.5, 3.0];

  // No button escapes on hover (desktop)
  btnNo.addEventListener('mouseover', () => {
    if (noCount >= 2) {
      escapeButton(btnNo);
    }
  });

  // No button escapes on touch start (mobile)
  btnNo.addEventListener('touchstart', (e) => {
    if (noCount >= 2) {
      e.preventDefault();
      escapeButton(btnNo);
    }
  }, { passive: false });

  btnNo.addEventListener('click', () => {
    noCount++;

    if (noCount >= noTexts.length) {
      // After max tries, the No button becomes Yes
      btnNo.textContent = "YES! 💖";
      btnNo.classList.add('btn-yes');
      btnNo.classList.remove('btn-no');
      question.textContent = "I KNEW IT! 🥰";
      sub.textContent = "You can't resist forever!";
      btnNo.onclick = () => triggerYes();
      return;
    }

    const stage = noTexts[noCount];
    question.textContent = stage.q;
    sub.textContent = stage.s;
    btnNo.textContent = stage.btn;

    // YES button grows bigger
    const scale = yesScales[Math.min(noCount, yesScales.length - 1)];
    btnYes.style.transform = `scale(${scale})`;

    // Shake the screen slightly
    quizScreen.classList.add('shake');
    setTimeout(() => quizScreen.classList.remove('shake'), 500);

    // Show counter
    counter.textContent = `You've said no ${noCount} time${noCount > 1 ? 's' : ''}... 😢`;
    counter.style.opacity = '1';

    // Start escaping after 2 no's
    if (noCount >= 2) {
      escapeButton(btnNo);
    }
  });

  btnYes.addEventListener('click', () => triggerYes());

  function triggerYes() {
    question.textContent = "I LOVE YOU TOO!! 💖💖💖";
    sub.textContent = "I knew you'd say yes! 🥰";
    btnYes.style.display = 'none';
    btnNo.style.display = 'none';
    counter.style.opacity = '0';

    // Confetti explosion
    launchConfetti(canvas);

    // Transition to envelope after celebration
    setTimeout(() => {
      quizScreen.classList.add('fade-out');
      landing.style.display = 'flex';
      landing.classList.add('fade-in');
      setTimeout(() => {
        quizScreen.style.display = 'none';
        initEnvelope();
      }, 1000);
    }, 3000);
  }

  function escapeButton(btn) {
    const parent = btn.closest('.quiz-content');
    const parentRect = parent.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const maxX = parentRect.width - btnRect.width - 20;
    const maxY = parentRect.height - btnRect.height - 20;

    let newX = Math.random() * maxX - maxX / 2;
    let newY = Math.random() * maxY - maxY / 2;

    // Keep within viewport
    newX = Math.max(-150, Math.min(150, newX));
    newY = Math.max(-100, Math.min(200, newY));

    btn.style.position = 'relative';
    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';
    btn.style.transition = 'left 0.2s ease, top 0.2s ease';
  }
}

// ---- CONFETTI ----
function launchConfetti(canvas) {
  canvas.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const confetti = [];
  const colors = ['#ff7eb3', '#e84393', '#fd79a8', '#f9ca24', '#fff', '#ff6b81', '#ff4757', '#ff9ff3'];
  const shapes = ['circle', 'rect', 'heart'];

  for (let i = 0; i < 200; i++) {
    confetti.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 100,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 20,
      vy: -(Math.random() * 18 + 5),
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.3 + Math.random() * 0.2,
      opacity: 1,
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    confetti.forEach(c => {
      c.x += c.vx;
      c.vy += c.gravity;
      c.y += c.vy;
      c.vx *= 0.99;
      c.rotation += c.rotSpeed;

      if (frame > 100) c.opacity -= 0.01;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, c.opacity);
      ctx.fillStyle = c.color;

      if (c.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, c.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.shape === 'rect') {
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 1.5);
      } else {
        drawHeart(ctx, 0, 0, c.size);
      }

      ctx.restore();
    });

    if (frame < 180) requestAnimationFrame(animate);
    else canvas.style.display = 'none';
  }

  animate();
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  const s = size * 0.6;
  ctx.moveTo(x, y + s / 4);
  ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s / 4);
  ctx.bezierCurveTo(x - s / 2, y + s / 2, x, y + s * 0.75, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.75, x + s / 2, y + s / 2, x + s / 2, y + s / 4);
  ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s / 4);
  ctx.fill();
}

// ---- ENVELOPE OPENING ----
function initEnvelope() {
  const envelope = document.getElementById('envelope');
  const wrapper = document.getElementById('envelopeWrapper');
  const landing = document.getElementById('landing');
  const hero = document.getElementById('hero');

  wrapper.addEventListener('click', () => {
    envelope.classList.add('opened');
    setTimeout(() => {
      landing.classList.add('fade-out');
      hero.classList.remove('hidden-section');
      hero.classList.add('visible-section');
    }, 1200);
    setTimeout(() => {
      landing.style.display = 'none';
    }, 2200);
  });
}

// ---- FLOATING HEARTS ----
function initFloatingHearts() {
  const container = document.getElementById('heartsBg');
  const heartChars = ['💕', '💗', '💖', '💝', '🩷', '♥️', '💘', '🌸', '✨'];

  function createHeart() {
    const heart = document.createElement('span');
    heart.classList.add('floating-heart');
    heart.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 18 + 10) + 'px';
    heart.style.animationDuration = (Math.random() * 5 + 6) + 's';
    heart.style.opacity = Math.random() * 0.5 + 0.3;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 12000);
  }

  setInterval(createHeart, 400);
  for (let i = 0; i < 15; i++) setTimeout(createHeart, i * 100);
}

// ---- SPARKLES ON HERO ----
function initSparkles() {
  const overlay = document.getElementById('sparkleOverlay');
  if (!overlay) return;

  function createSparkle() {
    const s = document.createElement('span');
    s.classList.add('sparkle');
    s.textContent = '✦';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.fontSize = (Math.random() * 14 + 6) + 'px';
    s.style.animationDuration = (Math.random() * 2 + 1) + 's';
    overlay.appendChild(s);
    setTimeout(() => s.remove(), 3000);
  }

  setInterval(createSparkle, 300);
}

// ---- SCROLL REVEAL ----
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation slightly
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  items.forEach(item => observer.observe(item));
}

// ---- TYPEWRITER EFFECT ----
function initTypewriter() {
  const container = document.getElementById('typewriterText');
  if (!container) return;

  const paragraphs = container.querySelectorAll('p');
  const originalTexts = [];
  paragraphs.forEach((p, i) => {
    originalTexts[i] = p.innerHTML;
    p.innerHTML = '';
    p.style.opacity = '0';
  });

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        typeAll(paragraphs, originalTexts);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(container);
}

async function typeAll(paragraphs, texts) {
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.opacity = '1';
    await typeLine(paragraphs[i], texts[i]);
    await sleep(300);
  }
}

function typeLine(el, text) {
  return new Promise((resolve) => {
    let idx = 0;
    const interval = setInterval(() => {
      el.innerHTML = text.slice(0, idx + 1);
      idx++;
      if (idx >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, 25);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
