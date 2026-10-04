// hand-tracking.js — Koreo Adam AR
// Integrasi Google MediaPipe Hands untuk gestur tangan

(function () {
  'use strict';

  let handsTracker = null;
  let isTracking = false;
  let lightningOverlay = null;

  // Util distance
  function dist(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  // Cek apakah tangan membentuk pola "L" (Telunjuk & Jempol kebuka, lainnya nutup)
  function isLShape(landmarks) {
    // Landmarks index:
    // Wrist: 0
    // Thumb: tip 4, IP 3, MCP 2
    // Index: tip 8, DIP 7, PIP 6, MCP 5
    // Middle: tip 12, DIP 11, PIP 10, MCP 9
    // Ring: tip 16, DIP 15, PIP 14, MCP 13
    // Pinky: tip 20, DIP 19, PIP 18, MCP 17

    const wrist = landmarks[0];

    const indexExtended = dist(landmarks[8], wrist) > dist(landmarks[6], wrist);
    const middleFolded  = dist(landmarks[12], wrist) < dist(landmarks[10], wrist);
    const ringFolded    = dist(landmarks[16], wrist) < dist(landmarks[14], wrist);
    const pinkyFolded   = dist(landmarks[20], wrist) < dist(landmarks[18], wrist);
    
    // Jempol lebih kompleks, kita cek jarak tip jempol ke pangkal kelingking (17)
    // Jika lebih jauh dari MCP jempol ke pangkal kelingking, berarti merentang
    const thumbExtended = dist(landmarks[4], landmarks[17]) > dist(landmarks[2], landmarks[17]);

    return indexExtended && thumbExtended && middleFolded && ringFolded && pinkyFolded;
  }

  function onResults(results) {
    if (!lightningOverlay) {
      lightningOverlay = document.getElementById('lightning-overlay');
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length === 2) {
      // Ada dua tangan terdeteksi
      const hand1 = results.multiHandLandmarks[0];
      const hand2 = results.multiHandLandmarks[1];

      if (isLShape(hand1) && isLShape(hand2)) {
        // Kedua tangan membentuk L-shape (gestur bingkai)
        lightningOverlay.classList.remove('hidden');
        lightningOverlay.classList.add('active');
        return;
      }
    }
    
    // Jika tidak ada 2 tangan L-shape
    if (lightningOverlay) {
      lightningOverlay.classList.remove('active');
      lightningOverlay.classList.add('hidden');
    }
  }

  async function initHandTracking() {
    if (!window.Hands) {
      console.warn("MediaPipe Hands tidak tersedia");
      return;
    }

    handsTracker = new window.Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});

    handsTracker.setOptions({
      maxNumHands: 2,
      modelComplexity: 1, // 0 = lebih cepat, 1 = seimbang
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    handsTracker.onResults(onResults);
    isTracking = true;

    // Loop menangkap feed kamera
    function processFrame() {
      // MindAR menginjeksi <video> kamera langsung di body
      const cameraVideo = document.querySelector('body > video');
      if (cameraVideo && cameraVideo.readyState >= 2) {
        handsTracker.send({image: cameraVideo}).then(() => {
          if (isTracking) requestAnimationFrame(processFrame);
        });
      } else {
        if (isTracking) requestAnimationFrame(processFrame);
      }
    }

    // Mulai processing loop
    processFrame();
  }

  // Karena MindAR membuat video elemen secara dinamis setelah AR Start, 
  // kita tunggu A-Frame scene loaded lalu jalankan Hand Tracking
  window.addEventListener('DOMContentLoaded', () => {
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl) {
      if (sceneEl.hasLoaded) {
        initHandTracking();
      } else {
        sceneEl.addEventListener('loaded', initHandTracking, { once: true });
      }
    }
  });

})();
