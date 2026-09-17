/* ==========================================================
   Chatkawee (Sky) - Ultra 3D Interactive Engine
   Retina-Optimized, Mobile Gyroscope/Touch Parallax & Ripple
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStarsCanvas();
  init3DTiltAndTouch();
  initTouchRipples();
  initCoinInteraction();
  initConfettiCanvas();
  initCopyActions();
  initShareAction();
});

/* ==========================================================
   Profile Gallery & Continuous Switcher
   ========================================================== */
const profileGallery = [
  {
    src: 'profile.png',
    position: '50% 20%',
    caption: 'ลุคหลัก (Bacon Time)'
  },
  {
    src: 'profile-2.png',
    position: '50% 20%',
    caption: 'ชุดฟุตบอล TN สดใส'
  },
  {
    src: 'profile-3.png',
    position: '50% 25%',
    caption: 'ตอนเด็กสุดสดใส'
  },
  {
    src: 'profile-4.jpg',
    position: '48% 28%',
    caption: 'ลงแข่งฟุตบอล #10'
  },
  {
    src: 'profile-5.jpg',
    position: '38% 30%',
    caption: 'จังหวะปะทะในสนาม'
  },
  {
    src: 'profile-6.png',
    position: '50% 55%',
    caption: 'ลุคแว่นหนวดสุดชิล'
  },
  {
    src: 'profile-7.png',
    position: '50% 25%',
    caption: 'เสื้อยืด Nike ดำ'
  },
  {
    src: 'profile-8.png',
    position: '45% 25%',
    caption: 'ชุดช่างไฟฟ้าสีน้ำเงิน'
  },
  {
    src: 'profile-9.png',
    position: '50% 50%',
    caption: 'น้องส้มหลับปุ๋ย 🐱'
  },
  {
    src: 'profile-10.png',
    position: '50% 50%',
    caption: 'เซลฟี่เสื้อโปโล (เท่ๆ ตาคม)'
  },
  {
    src: 'profile-11.png',
    position: '50% 45%',
    caption: 'น้องแมวตาโต 🐱'
  }
];

let currentPhotoIndex = 0;
let isSwitching = false;

function preloadGallery() {
  profileGallery.forEach(p => {
    const img = new Image();
    img.src = `${p.src}?v=v12_p10_fix`;
  });
}

function switchProfilePhoto() {
  if (isSwitching) return;
  isSwitching = true;

  currentPhotoIndex = (currentPhotoIndex + 1) % profileGallery.length;
  const photo = profileGallery[currentPhotoIndex];

  const coin = document.getElementById('avatar-coin');
  const frontImg = document.getElementById('avatar-image');
  const backImg = document.getElementById('avatar-image-back');
  const counter = document.getElementById('avatar-counter');

  triggerHaptic([35, 55, 35]);

  if (coin) {
    coin.classList.add('flip-boost');
  }

  // Swap image mid-flip
  setTimeout(() => {
    if (frontImg) {
      frontImg.src = `${photo.src}?v=v12_p10_fix`;
      frontImg.style.setProperty('object-position', photo.position, 'important');
    }
    if (backImg) {
      backImg.src = `${photo.src}?v=v12_p10_fix`;
      backImg.style.setProperty('object-position', photo.position, 'important');
    }
    if (counter) {
      counter.textContent = `${currentPhotoIndex + 1} / ${profileGallery.length}`;
    }
  }, 350);

  setTimeout(() => {
    if (coin) coin.classList.remove('flip-boost');
    isSwitching = false;
  }, 1150);

  showToast('สลับรูปโปรไฟล์แล้ว ✨', `${photo.caption} (${currentPhotoIndex + 1}/${profileGallery.length})`, '📸');
  launchConfetti();
}

function initCoinInteraction() {
  preloadGallery();

  const coin = document.getElementById('avatar-coin');
  const switchBtn = document.getElementById('avatar-switch-btn');

  if (coin) {
    coin.addEventListener('click', switchProfilePhoto);
  }

  if (switchBtn) {
    switchBtn.addEventListener('click', switchProfilePhoto);
  }
}

/* ==========================================================
   Toast Notification System
   ========================================================== */
let toastTimer = null;
function showToast(title, message, icon = '✨') {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = toast.querySelector('.toast-icon');

  if (!toast) return;

  if (toastTitle) toastTitle.textContent = title;
  if (toastMsg) toastMsg.textContent = message;
  if (toastIcon) toastIcon.textContent = icon;

  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ==========================================================
   Haptic Feedback
   ========================================================== */
function triggerHaptic(pattern = 25) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
}

/* ==========================================================
   Clipboard Helper
   ========================================================== */
async function copyToClipboard(text, title = 'คัดลอกสำเร็จ', message = 'คัดลอกลงคลิปบอร์ดแล้ว!') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.left = '-999999px';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      el.remove();
    }
    showToast(title, message, '📋');
    triggerHaptic([35, 45, 35]);
    launchConfetti();
  } catch (err) {
    showToast('ข้อผิดพลาด', 'ไม่สามารถคัดลอกอัตโนมัติได้: ' + text, '⚠️');
  }
}

/* ==========================================================
   Interactive 3D Tilt & Mobile Gyroscope Engine
   ========================================================== */
function init3DTiltAndTouch() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const tiltCards = document.querySelectorAll('[data-tilt], .profile-card-3d');

  // Mouse tilt for desktop
  tiltCards.forEach(card => {
    let bounds = null;

    function handleMove(clientX, clientY) {
      if (!bounds) bounds = card.getBoundingClientRect();
      
      const mouseX = clientX - bounds.left;
      const mouseY = clientY - bounds.top;

      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      const maxTilt = 8;
      const tiltX = -((mouseY - centerY) / centerY) * maxTilt;
      const tiltY = ((mouseX - centerX) / centerX) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(6px)`;
      card.style.setProperty('--mouse-x', `${mouseX}px`);
      card.style.setProperty('--mouse-y', `${mouseY}px`);
    }

    function handleReset() {
      bounds = null;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    card.addEventListener('mouseleave', handleReset);
  });

  // Gyroscope tilt removed on mobile to prevent orientation drift or edge clipping
}

/* ==========================================================
   Touch Ripple Effect for Tactile Mobile Feedback
   ========================================================== */
function initTouchRipples() {
  const interactiveElements = document.querySelectorAll('.luxe-card, .glass-btn, .icon-circle-btn');

  interactiveElements.forEach(el => {
    el.addEventListener('pointerdown', (e) => {
      triggerHaptic(20);
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 1.5;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, transparent 70%);
        pointer-events: none;
        transform: scale(0);
        opacity: 1;
        transition: transform 0.5s ease-out, opacity 0.5s ease-out;
        z-index: 10;
      `;

      el.style.position = el.style.position || 'relative';
      el.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity = '0';
      });

      setTimeout(() => ripple.remove(), 550);
    });
  });
}

/* ==========================================================
   Share Profile Action
   ========================================================== */
function initShareAction() {
  const shareBtn = document.getElementById('header-share-btn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    triggerHaptic(35);
    const shareUrl = window.location.href.split('?')[0];
    const shareData = {
      title: 'Atthachai panyasan - Official Links',
      text: 'ช่องทางการติดต่อและโซเชียลมีเดียของ Atthachai panyasan (@wxveatp_ii) ✨',
      url: shareUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        launchConfetti();
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl, 'คัดลอกลิงก์โปรไฟล์', 'ส่งต่อให้เพื่อนได้ทันที ✨');
        }
      }
    } else {
      copyToClipboard(shareUrl, 'คัดลอกลิงก์โปรไฟล์', 'ส่งต่อให้เพื่อนได้ทันที ✨');
    }
  });
}

/* ==========================================================
   Copy Email Actions & Banking
   ========================================================== */
function initCopyActions() {
  const targetEmail = '27pam2541@gmail.com';

  const quickCopyBtn = document.getElementById('quick-copy-email-btn');
  if (quickCopyBtn) {
    quickCopyBtn.addEventListener('click', () => {
      copyToClipboard(targetEmail, 'คัดลอกอีเมลเรียบร้อย', targetEmail);
    });
  }

  const cardCopyBtn = document.getElementById('card-copy-btn');
  if (cardCopyBtn) {
    cardCopyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(targetEmail, 'คัดลอกอีเมลเรียบร้อย', targetEmail);
    });
  }

  const emailCard = document.getElementById('email-card');
  if (emailCard) {
    emailCard.addEventListener('click', () => {
      copyToClipboard(targetEmail, 'คัดลอกอีเมลเรียบร้อย', targetEmail);
    });
  }

  // Bangkok Bank Account Copy
  const bblBtn = document.getElementById('copy-bbl-btn');
  if (bblBtn) {
    bblBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard('8640698604', 'คัดลอกบัญชีธนาคารกรุงเทพเรียบร้อย', '864-0-698604 (ธนาคารกรุงเทพ)');
    });
  }

  // PromptPay Copy
  const promptpayBtn = document.getElementById('copy-promptpay-btn');
  if (promptpayBtn) {
    promptpayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard('0653403849', 'คัดลอกเบอร์พร้อมเพย์เรียบร้อย', '065-340-3849 (พร้อมเพย์)');
    });
  }
}

/* ==========================================================
   Retina-Scaled Star Constellations Canvas Engine
   ========================================================== */
function initStarsCanvas() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let stars = [];
  const STAR_COUNT = 40;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize();

  class Star {
    constructor() {
      this.init();
    }

    init() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.8 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.7 + 0.2;
      this.twinkleSpeed = 0.02 * Math.random() + 0.01;
      this.color = Math.random() > 0.4 ? 'rgba(56, 189, 248,' : 'rgba(236, 72, 153,';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      this.alpha += Math.sin(Date.now() * this.twinkleSpeed) * 0.01;
      if (this.alpha < 0.15) this.alpha = 0.15;
      if (this.alpha > 0.85) this.alpha = 0.85;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          const lineAlpha = (1 - dist / 100) * 0.09;
          ctx.strokeStyle = `rgba(148, 163, 184, ${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    stars.forEach(s => {
      s.update();
      s.draw();
    });

    requestAnimationFrame(loop);
  }

  loop();
}

/* ==========================================================
   Retina-Scaled Confetti Burst Engine
   ========================================================== */
let confettiParticles = [];
let confettiRunning = false;

function initConfettiCanvas() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resize);
  resize();
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const colors = ['#38bdf8', '#ec4899', '#a855f7', '#facc15', '#4ade80'];
  const count = 45;

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.6,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 16,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 14,
      alpha: 1,
      gravity: 0.35
    });
  }

  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti(ctx, canvas);
  }
}

function animateConfetti(ctx, canvas) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rot += p.rotSpeed;
    p.alpha -= 0.015;

    if (p.alpha <= 0 || p.y > window.innerHeight) {
      confettiParticles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }

  if (confettiParticles.length > 0) {
    requestAnimationFrame(() => animateConfetti(ctx, canvas));
  } else {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    confettiRunning = false;
  }
}
