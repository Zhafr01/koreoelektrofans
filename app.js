// app.js — Koreo Adam AR Logic
// Elektro Fans um WebAR App

(function () {
  'use strict';

  // ─── State ───────────────────────────────────────────────────────────────
  let isMuted     = true;   // start muted (browser policy)
  let targetFound = false;
  let videoEl, videoPlaneEl;
  let raijinVideoEl;
  let zeusVideoEl;

  // ─── Elements ─────────────────────────────────────────────────────────────
  const loadingScreen  = document.getElementById('loading-screen');
  const loadingBar     = document.getElementById('loading-bar');
  const uiOverlay      = document.getElementById('ui-overlay');
  const detectedBadge  = document.getElementById('detected-badge');
  const btnMute        = document.getElementById('btn-mute');
  const iconSoundOn    = document.getElementById('icon-sound-on');
  const iconSoundOff   = document.getElementById('icon-sound-off');

  // ─── Simulated Loading Progress ───────────────────────────────────────────
  function simulateLoading (callback) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(callback, 300);
      }
      loadingBar.style.width = progress + '%';
    }, 200);
  }

  // ─── Boot App ─────────────────────────────────────────────────────────────
  async function boot () {
    // Jangan panggil getUserMedia di sini — mobile Chrome memblokir tanpa user gesture.
    // MindAR akan start secara manual saat tombol ditekan (lihat btnStart click handler).

    const btnStart = document.getElementById('btn-start-ar');
    const loadingBarContainer = document.getElementById('loading-bar-container');
    
    // Sembunyikan loading bar, tampilkan tombol
    loadingBarContainer.classList.add('hidden');
    btnStart.classList.remove('hidden');

    btnStart.addEventListener('click', async () => {
      btnStart.disabled = true;
      btnStart.innerHTML = '<span>⏳</span> Memulai...';

      // 🔓 UNLOCK AUTOPLAY untuk semua video — wajib sebelum user gesture hilang
      const v  = document.getElementById('koreo-video');
      const vr = document.getElementById('raijin-video');
      const vz = document.getElementById('zeus-video');
      for (const vid of [v, vr, vz]) {
        if (!vid) continue;
        vid.muted = true;
        try { await Promise.race([vid.play(), new Promise(r => setTimeout(r, 500))]); } catch(e) {}
      }

      // 📷 Minta izin kamera secara eksplisit — wajib di mobile
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        // Langsung stop — MindAR akan buka sendiri kameranya
        stream.getTracks().forEach(t => t.stop());
      } catch (camErr) {
        const msg = camErr.name === 'NotAllowedError'
          ? '🚫 Izin kamera ditolak. Buka Pengaturan browser dan izinkan kamera, lalu refresh.'
          : `❌ Kamera tidak bisa dibuka: ${camErr.message}`;
        showError(msg);
        btnStart.disabled = false;
        btnStart.innerHTML = '<span>⚡</span> Coba Lagi';
        return;
      }

      // 📷 Start MindAR — dengan retry jika system belum siap
      const tryStartAR = () => {
        const sceneEl = document.querySelector('a-scene');
        if (!sceneEl) return;
        const arSystem = sceneEl.systems['mindar-image-system'];
        if (arSystem) {
          arSystem.start();
        } else {
          // System belum mount — tunggu scene loaded
          sceneEl.addEventListener('loaded', () => {
            const sys = sceneEl.systems['mindar-image-system'];
            if (sys) sys.start();
          }, { once: true });
        }
      };
      try { tryStartAR(); } catch(e) { console.warn('MindAR start failed:', e); }


      // Mulai loading animasi
      btnStart.classList.add('hidden');
      loadingBarContainer.classList.remove('hidden');

      simulateLoading(() => {
        // Hide loading, show UI
        loadingScreen.classList.add('hidden');
        uiOverlay.classList.remove('hidden');

        // Grab elemen
        videoEl      = document.getElementById('koreo-video');
        videoPlaneEl = document.getElementById('ar-video-plane');
        raijinVideoEl = document.getElementById('raijin-video');
        zeusVideoEl  = document.getElementById('zeus-video');

        // Helper: pasang event ke semua target
        function attachTargetEvents () {
          // Target 0: Koreo Adam
          const tk = document.querySelector('[mindar-image-target="targetIndex: 0"]');
          if (tk) {
            tk.addEventListener('targetFound', onTargetFound);
            tk.addEventListener('targetLost',  onTargetLost);
          }

          // Target 1-12: Raijin
          for (let i = 1; i <= 12; i++) {
            const t = document.querySelector(`[mindar-image-target="targetIndex: ${i}"]`);
            if (t) {
              t.addEventListener('targetFound', onRaijinFound);
              t.addEventListener('targetLost',  onRaijinLost);
            }
          }

          // Target 13: Zeus
          const tz = document.querySelector('[mindar-image-target="targetIndex: 13"]');
          if (tz) {
            tz.addEventListener('targetFound', onZeusFound);
            tz.addEventListener('targetLost',  onZeusLost);
          }
        }



        const sceneEl2 = document.querySelector('a-scene');
        if (sceneEl2 && sceneEl2.hasLoaded) attachTargetEvents();
        else if (sceneEl2) sceneEl2.addEventListener('loaded', attachTargetEvents, { once: true });
      });
    });
  }

  // ─── Target Found ──────────────────────────────────────────────────────────
  function onTargetFound () {
    if (targetFound) return;
    targetFound = true;

    document.body.classList.add('target-found');
    document.body.classList.remove('target-lost');

    detectedBadge.classList.remove('hidden');
    videoEl.muted = isMuted;
    videoEl.currentTime = 0;

    // Set material needsUpdate sebelum play agar WebGL texture terbaca
    const forceTextureUpdate = () => {
      document.querySelectorAll('.koreo-plane').forEach(el => {
        const mesh = el.getObject3D('mesh');
        if (mesh && mesh.material) {
          mesh.material.needsUpdate = true;
          if (mesh.material.map) mesh.material.map.needsUpdate = true;
        }
      });
    };

    videoEl.play().then(() => {
      forceTextureUpdate();
      // Loop force update selama 1 detik untuk memastikan frame pertama terbaca
      let count = 0;
      const tid = setInterval(() => {
        forceTextureUpdate();
        if (++count >= 10) clearInterval(tid);
      }, 100);
    }).catch((err) => {
      console.warn('Autoplay blocked:', err);
    });

    setTimeout(() => detectedBadge.classList.add('hidden'), 3000);
  }

  // ─── Target Lost ───────────────────────────────────────────────────────────
  function onTargetLost () {
    if (!targetFound) return;
    targetFound = false;
    
    document.body.classList.remove('target-found');
    document.body.classList.add('target-lost');
    
    detectedBadge.classList.add('hidden');
    
    // Jangan di-pause, biarkan play secara senyap agar tekstur tidak hilang
    videoEl.muted = true;
  }

  // ─── Raijin Target Found ───────────────────────────────────────────────────
  let raijinFound = false;

  function onRaijinFound () {
    if (raijinFound) return;
    raijinFound = true;

    detectedBadge.classList.remove('hidden');
    raijinVideoEl.muted = isMuted;
    raijinVideoEl.currentTime = 0;

    const forceRaijinUpdate = () => {
      document.querySelectorAll('.raijin-plane').forEach(el => {
        const mesh = el.getObject3D('mesh');
        if (mesh && mesh.material) {
          mesh.material.needsUpdate = true;
          if (mesh.material.map) mesh.material.map.needsUpdate = true;
        }
      });
    };

    raijinVideoEl.play().then(() => {
      forceRaijinUpdate();
      let count = 0;
      const tid = setInterval(() => {
        forceRaijinUpdate();
        if (++count >= 10) clearInterval(tid);
      }, 100);
    }).catch((err) => {
      console.warn('Raijin autoplay blocked:', err);
    });

    setTimeout(() => detectedBadge.classList.add('hidden'), 3000);
  }

  // ─── Raijin Target Lost ────────────────────────────────────────────────────
  function onRaijinLost () {
    if (!raijinFound) return;
    raijinFound = false;

    detectedBadge.classList.add('hidden');
    raijinVideoEl.muted = true;
  }

  // ─── Zeus Target Found ───────────────────────────────────────────────────
  let zeusFound = false;

  function onZeusFound () {
    if (zeusFound) return;
    zeusFound = true;

    detectedBadge.classList.remove('hidden');
    zeusVideoEl.muted = isMuted;
    zeusVideoEl.currentTime = 0;

    const forceZeusUpdate = () => {
      document.querySelectorAll('.zeus-plane').forEach(el => {
        const mesh = el.getObject3D('mesh');
        if (mesh && mesh.material) {
          mesh.material.needsUpdate = true;
          if (mesh.material.map) mesh.material.map.needsUpdate = true;
        }
      });
    };

    zeusVideoEl.play().then(() => {
      forceZeusUpdate();
      let count = 0;
      const tid = setInterval(() => {
        forceZeusUpdate();
        if (++count >= 10) clearInterval(tid);
      }, 100);
    }).catch((err) => {
      console.warn('Zeus autoplay blocked:', err);
    });

    setTimeout(() => detectedBadge.classList.add('hidden'), 3000);
  }

  // ─── Zeus Target Lost ────────────────────────────────────────────────────
  function onZeusLost () {
    if (!zeusFound) return;
    zeusFound = false;

    detectedBadge.classList.add('hidden');
    zeusVideoEl.muted = true;
  }

  // ─── Mute / Unmute ────────────────────────────────────────────────────────
  function toggleMute () {
    isMuted = !isMuted;
    if (videoEl) videoEl.muted = isMuted;
    if (raijinVideoEl) raijinVideoEl.muted = isMuted;
    if (zeusVideoEl) zeusVideoEl.muted = isMuted;
    if (!isMuted && videoEl && videoEl.paused && targetFound) {
      videoEl.play().catch(() => {});
    }
    if (!isMuted && raijinVideoEl && raijinVideoEl.paused && raijinFound) {
      raijinVideoEl.play().catch(() => {});
    }
    if (!isMuted && zeusVideoEl && zeusVideoEl.paused && zeusFound) {
      zeusVideoEl.play().catch(() => {});
    }
    iconSoundOn.classList.toggle('hidden',  isMuted);
    iconSoundOff.classList.toggle('hidden', !isMuted);
  }

  btnMute.addEventListener('click', toggleMute);

  // ─── Flashlight / Torch ───────────────────────────────────────────────────
  const btnTorch = document.getElementById('btn-torch');
  let torchOn = false;

  btnTorch.addEventListener('click', async () => {
    // MindAR injects a hidden video element with the camera feed
    const videos = document.querySelectorAll('video');
    let camTrack = null;
    videos.forEach(v => {
      if (v.srcObject && v.srcObject.getVideoTracks) {
        camTrack = v.srcObject.getVideoTracks()[0];
      }
    });

    if (camTrack) {
      const caps = camTrack.getCapabilities ? camTrack.getCapabilities() : {};
      if (caps.torch) {
        torchOn = !torchOn;
        try {
          await camTrack.applyConstraints({ advanced: [{ torch: torchOn }] });
          // Highlight button if on
          btnTorch.style.background = torchOn ? 'rgba(255, 215, 0, 0.25)' : 'rgba(255, 255, 255, 0.1)';
          btnTorch.style.borderColor = torchOn ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)';
        } catch(e) {
          showError('Gagal menyalakan senter.');
        }
      } else {
        showError('Maaf, Senter tidak didukung di perangkat/browser ini.');
      }
    } else {
      showError('Tunggu kamera aktif terlebih dahulu.');
    }
  });

  // ─── Error helper ─────────────────────────────────────────────────────────
  function showError (msg) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
      background:rgba(255,40,40,0.15); border:1.5px solid #ff4444;
      color:#ff8888; padding:12px 20px; border-radius:12px;
      font-family:'Outfit',sans-serif; font-size:0.82rem; text-align:center;
      max-width:280px; z-index:9999; backdrop-filter:blur(8px);
    `;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  }

  // ─── Kick off ─────────────────────────────────────────────────────────────
  window.addEventListener('DOMContentLoaded', boot);

})();
