/**
 * Modern Dark Glassmorphism 3D Luxe - Wave Chatkawee Bio Links
 * app.js - Canvas Starfield, 3D Coin Flip Boost, Confetti, Quick Copy & Haptics
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Hardware-Accelerated Cosmic Mesh & Twinkling Starfield Canvas
     ========================================================================== */
  const cosmicCanvas = document.getElementById('cosmic-canvas');
  const ctx = cosmicCanvas.getContext('2d');

  let width, height, dpr;
  let stars = [];
  const STAR_COUNT = 85;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    cosmicCanvas.width = width * dpr;
    cosmicCanvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    initStars();
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        color: ['#ffffff', '#a78bfa', '#38bdf8', '#f472b6'][Math.floor(Math.random() * 4)]
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, width, height);

    for (let star of stars) {
      // Twinkle & drift
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 0.95 || star.alpha < 0.2) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }

      star.y -= star.speed;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
      ctx.shadowBlur = 8;
      ctx.shadowColor = star.color;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  requestAnimationFrame(drawStars);


  /* ==========================================================================
     2. High-Performance Confetti Burst System
     ========================================================================== */
  const confettiCanvas = document.getElementById('confetti-canvas');
  const cCtx = confettiCanvas.getContext('2d');
  let confettiList = [];
  let confettiAnimFrame = null;

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    confettiCanvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    cCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function triggerConfetti(originX, originY) {
    const colors = ['#ffd700', '#00f2fe', '#ff007f', '#ffffff', '#a855f7', '#00ff87'];
    const count = 55;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5);
      const velocity = Math.random() * 7 + 4;
      confettiList.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 2.5,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        life: 0.98 + Math.random() * 0.015,
        gravity: 0.22
      });
    }

    if (!confettiAnimFrame) {
      updateConfetti();
    }
  }

  function updateConfetti() {
    cCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = confettiList.length - 1; i >= 0; i--) {
      const p = confettiList[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.opacity *= 0.97;

      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate((p.rotation * Math.PI) / 180);
      cCtx.globalAlpha = Math.max(0, p.opacity);
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      cCtx.restore();

      if (p.opacity < 0.03 || p.y > window.innerHeight) {
        confettiList.splice(i, 1);
      }
    }

    if (confettiList.length > 0) {
      confettiAnimFrame = requestAnimationFrame(updateConfetti);
    } else {
      cCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      confettiAnimFrame = null;
    }
  }


  /* ==========================================================================
     3. 3D Spinning Coin Interaction (Quick Flip Boost + Confetti)
     ========================================================================== */
  const coinContainer = document.getElementById('coinContainer');
  const coin = document.getElementById('coin');
  let isCoinBoosting = false;

  coinContainer.addEventListener('click', (e) => {
    if (isCoinBoosting) return;
    isCoinBoosting = true;

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([30, 40, 50]);
    }

    // Trigger rapid spin animation
    coin.classList.remove('boost-flip');
    // Force reflow
    void coin.offsetWidth;
    coin.classList.add('boost-flip');

    // Confetti position
    const rect = coinContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    triggerConfetti(centerX, centerY);

    // Reset back to gentle loop
    setTimeout(() => {
      coin.classList.remove('boost-flip');
      isCoinBoosting = false;
    }, 1250);
  });


  /* ==========================================================================
     4. Quick Copy System & Toast Notifications
     ========================================================================== */
  const toastWrapper = document.getElementById('toastWrapper');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(title, message, isSuccess = true) {
    if (toastTimer) clearTimeout(toastTimer);

    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastWrapper.classList.add('show');

    // Haptic vibration
    if (navigator.vibrate) {
      navigator.vibrate(isSuccess ? [25, 30] : [80]);
    }

    toastTimer = setTimeout(() => {
      toastWrapper.classList.remove('show');
    }, 2800);
  }

  async function copyToClipboard(text, typeLabel, buttonElement) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older webviews
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      showToast('คัดลอกสำเร็จ! ✨', `คัดลอก${typeLabel} (${text}) เรียบร้อยแล้ว`);

      // Temporary button state visual
      if (buttonElement) {
        const originalHTML = buttonElement.innerHTML;
        buttonElement.innerHTML = `<i class="fa-solid fa-check"></i> <span>คัดลอกแล้ว!</span>`;
        setTimeout(() => {
          buttonElement.innerHTML = originalHTML;
        }, 1800);
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาด', 'ไม่สามารถคัดลอกได้ กรุณาลองใหม่อีกครั้ง', false);
    }
  }

  // Attach to all copy buttons
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const typeLabel = btn.getAttribute('data-type') || 'ข้อมูล';
      copyToClipboard(textToCopy, typeLabel, btn);
    });
  });


  /* ==========================================================================
     5. Web Share API & Profile Share Button
     ========================================================================== */
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Wave Chatkawee | Bio Links & Portfolio',
        text: 'ติดตามโปรไฟล์และช่องทางติดต่อของ Wave Chatkawee (@wxveatp_ii) ✨',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          showToast('แชร์สำเร็จ', 'ขอบคุณที่แชร์โปรไฟล์ครับ! 🚀');
        } catch (err) {
          if (err.name !== 'AbortError') {
            fallbackShare();
          }
        }
      } else {
        fallbackShare();
      }
    });
  }

  function fallbackShare() {
    copyToClipboard(window.location.href, 'ลิงก์โปรไฟล์', null);
  }


  /* ==========================================================================
     6. Mobile Touch Ripple Effect
     ========================================================================== */
  const rippleTargets = document.querySelectorAll('.link-card, .quick-copy-btn, .icon-btn');
  rippleTargets.forEach((card) => {
    card.addEventListener('pointerdown', function (e) {
      const rect = card.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-wave');

      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      card.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 650);
    });
  });

});

