const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Replace target indices >= 15
content = content.replace(/targetIndex:\s*(\d+)/g, (match, p1) => {
    let index = parseInt(p1, 10);
    if (index >= 15) {
        return `targetIndex: ${index + 10}`;
    }
    return match;
});

// Create HTML for Raijin 3 and 4
const newTargets = `
    <!-- RAIJIN 3 TARGETS (15-19) -->
    <a-entity mindar-image-target="targetIndex: 15" id="target-raijin3-full">
      <a-plane class="raijin-plane" position="0 0 0" width="1" height="0.667" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 16" id="target-raijin3-tl">
      <a-plane class="raijin-plane" position="0.5 -0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 17" id="target-raijin3-tr">
      <a-plane class="raijin-plane" position="-0.5 -0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 18" id="target-raijin3-bl">
      <a-plane class="raijin-plane" position="0.5 0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 19" id="target-raijin3-br">
      <a-plane class="raijin-plane" position="-0.5 0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>

    <!-- RAIJIN 4 TARGETS (20-24) -->
    <a-entity mindar-image-target="targetIndex: 20" id="target-raijin4-full">
      <a-plane class="raijin-plane" position="0 0 0" width="1" height="0.667" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 21" id="target-raijin4-tl">
      <a-plane class="raijin-plane" position="0.5 -0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 22" id="target-raijin4-tr">
      <a-plane class="raijin-plane" position="-0.5 -0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 23" id="target-raijin4-bl">
      <a-plane class="raijin-plane" position="0.5 0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
    <a-entity mindar-image-target="targetIndex: 24" id="target-raijin4-br">
      <a-plane class="raijin-plane" position="-0.5 0.334 0" width="2" height="1.334" rotation="0 0 0" material="src: #raijin-video; shader: flat; transparent: false"></a-plane>
    </a-entity>
`;

const insertIndex = content.indexOf('<!-- FOTO FISIK RAIJIN');
if (insertIndex !== -1) {
    content = content.slice(0, insertIndex) + newTargets + '\n    ' + content.slice(insertIndex);
    
    // Bump version for cache busting
    content = content.replace('targets.mind?v=5', 'targets.mind?v=6');
    content = content.replace('app.js?v=5', 'app.js?v=6');
    
    fs.writeFileSync('index.html', content);
    console.log("Updated index.html");
} else {
    console.log("Could not find insertion point");
}
