const fs = require('fs');

// 1. UPDATE compile.html
let compileHtml = fs.readFileSync('compile.html', 'utf8');
const filesToLoad = [
  'Koreo Adam.jpeg',
  'Raijin1.jpeg',
  'Raijin2.jpeg',
  'raijin3.jpeg', 'raijin3_part_0.jpg', 'raijin3_part_1.jpg', 'raijin3_part_2.jpg', 'raijin3_part_3.jpg',
  'raijin4.jpeg', 'raijin4_part_0.jpg', 'raijin4_part_1.jpg', 'raijin4_part_2.jpg', 'raijin4_part_3.jpg',
  'zeus.png'
];
compileHtml = compileHtml.replace(/const filesToLoad = \[[\s\S]*?\];/, `const filesToLoad = [\n      '${filesToLoad.join("',\n      '")}'\n    ];`);
compileHtml = compileHtml.replace(/Memuat otomatis \d+ gambar target/g, `Memuat otomatis ${filesToLoad.length} gambar target`);
fs.writeFileSync('compile.html', compileHtml);


// 2. UPDATE index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
const aSceneStart = indexHtml.indexOf('<a-scene');
const aSceneEnd = indexHtml.indexOf('</a-scene>') + '</a-scene>'.length;

const newAScene = `<a-scene id="ar-scene"
    mindar-image="imageTargetSrc: targets.mind?v=7; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
    color-space="sRGB" renderer="colorManagement: true; physicallyCorrectLights: true; alpha: true"
    vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
    <a-assets>
      <video id="koreo-video" src="VidKoreoAdam.mp4" preload="auto" autoplay loop playsinline webkit-playsinline muted></video>
      <video id="raijin-video" src="VidRaijin.mp4" preload="auto" autoplay loop playsinline webkit-playsinline muted></video>
      <video id="zeus-video" src="vidZeus.mp4" preload="auto" autoplay loop playsinline webkit-playsinline muted></video>
    </a-assets>

    <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

    <!-- KOREO ADAM (Target 0) -->
    <a-entity mindar-image-target="targetIndex: 0" id="target-koreo-full">
      <a-plane class="koreo-plane" position="0 0 0" width="1" height="0.646" rotation="0 0 0" material="src: #koreo-video; shader: flat; transparent: false"></a-plane>
      <a-plane id="glow-frame" position="0 0 -0.001" width="1.82" height="1.04" color="#FFD700" opacity="0" material="shader: flat" visible="false"></a-plane>
    </a-entity>

    <!-- RAIJIN 1 (Target 1) -->
    <a-entity mindar-image-target="targetIndex: 1" id="target-raijin1-full">
      <a-plane class="raijin-plane" position="0 0 0" width="1" height="0.667" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>

    <!-- RAIJIN 2 (Target 2) -->
    <a-entity mindar-image-target="targetIndex: 2" id="target-raijin2-full">
      <a-plane class="raijin-plane" position="0 0 0" width="1" height="0.667" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>

    <!-- RAIJIN 3 (Target 3-7) -->
    <a-entity mindar-image-target="targetIndex: 3" id="target-raijin3-full">
      <a-plane class="raijin-plane" position="0 0 0" width="1" height="0.667" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 4" id="target-raijin3-tl">
      <a-plane class="raijin-plane" position="0.5 -0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 5" id="target-raijin3-tr">
      <a-plane class="raijin-plane" position="-0.5 -0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 6" id="target-raijin3-bl">
      <a-plane class="raijin-plane" position="0.5 0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 7" id="target-raijin3-br">
      <a-plane class="raijin-plane" position="-0.5 0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>

    <!-- RAIJIN 4 (Target 8-12) -->
    <a-entity mindar-image-target="targetIndex: 8" id="target-raijin4-full">
      <a-plane class="raijin-plane" position="0 0 0" width="1" height="0.667" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 9" id="target-raijin4-tl">
      <a-plane class="raijin-plane" position="0.5 -0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 10" id="target-raijin4-tr">
      <a-plane class="raijin-plane" position="-0.5 -0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 11" id="target-raijin4-bl">
      <a-plane class="raijin-plane" position="0.5 0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 12" id="target-raijin4-br">
      <a-plane class="raijin-plane" position="-0.5 0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>

    <!-- ZEUS (Target 13) -->
    <a-entity mindar-image-target="targetIndex: 13" id="target-zeus">
      <a-plane class="zeus-plane" position="0 0 0" width="1" height="1.5" rotation="0 0 0" material="src: #zeus-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
  </a-scene>`;

indexHtml = indexHtml.substring(0, aSceneStart) + newAScene + indexHtml.substring(aSceneEnd);
indexHtml = indexHtml.replace(/app\.js\?v=\d+/, 'app.js?v=7');
fs.writeFileSync('index.html', indexHtml);


// 3. UPDATE app.js
let appJs = fs.readFileSync('app.js', 'utf8');

// replace attachTargetEvents body
const attachStart = appJs.indexOf('function attachTargetEvents () {');
const attachEnd = appJs.indexOf('}', attachStart + 35) + 1; // wait, there are loops inside.
// better use regex or just multi replace. Let's do string replacement for the loops
let newAttachBody = `function attachTargetEvents () {
          // Target 0: Koreo Adam
          const tk = document.querySelector('[mindar-image-target="targetIndex: 0"]');
          if (tk) {
            tk.addEventListener('targetFound', onTargetFound);
            tk.addEventListener('targetLost',  onTargetLost);
          }

          // Target 1-12: Raijin
          for (let i = 1; i <= 12; i++) {
            const t = document.querySelector(\`[mindar-image-target="targetIndex: \${i}"]\`);
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
        }`;

appJs = appJs.replace(/function attachTargetEvents \(\) \{[\s\S]*?(?=\n\s+const sceneEl2)/, newAttachBody + "\n\n");
fs.writeFileSync('app.js', appJs);

console.log("Updated compile.html, index.html, app.js");
