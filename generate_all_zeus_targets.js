const fs = require('fs');

let html = "";
html += `    <!-- FOTO FISIK ZEUS (Target 20-24) -->\n`;
html += `    <a-entity mindar-image-target="targetIndex: 20" id="target-zeus">\n`;
html += `      <a-plane class="zeus-plane" position="0 0 0" width="1" height="1.5" rotation="0 0 0" material="src: #zeus-video; shader: flat; transparent: false"></a-plane>\n`;
html += `    </a-entity>\n`;
html += `    <a-entity mindar-image-target="targetIndex: 21" id="target-zeus-tl">\n`;
html += `      <a-plane class="zeus-plane" position="0.5 -0.75 0" width="2" height="3" rotation="0 0 0" material="src: #zeus-video; shader: flat; transparent: false"></a-plane>\n`;
html += `    </a-entity>\n`;
html += `    <a-entity mindar-image-target="targetIndex: 22" id="target-zeus-tr">\n`;
html += `      <a-plane class="zeus-plane" position="-0.5 -0.75 0" width="2" height="3" rotation="0 0 0" material="src: #zeus-video; shader: flat; transparent: false"></a-plane>\n`;
html += `    </a-entity>\n`;
html += `    <a-entity mindar-image-target="targetIndex: 23" id="target-zeus-bl">\n`;
html += `      <a-plane class="zeus-plane" position="0.5 0.75 0" width="2" height="3" rotation="0 0 0" material="src: #zeus-video; shader: flat; transparent: false"></a-plane>\n`;
html += `    </a-entity>\n`;
html += `    <a-entity mindar-image-target="targetIndex: 24" id="target-zeus-br">\n`;
html += `      <a-plane class="zeus-plane" position="-0.5 0.75 0" width="2" height="3" rotation="0 0 0" material="src: #zeus-video; shader: flat; transparent: false"></a-plane>\n`;
html += `    </a-entity>\n`;

let currentIndex = 25;

for (let i = 1; i <= 7; i++) {
  html += `\n    <!-- ZEUS ${i} TARGETS (${currentIndex}-${currentIndex+4}) -->\n`;
  html += `    <a-entity mindar-image-target="targetIndex: ${currentIndex}" id="target-zeus${i}-full">\n`;
  html += `      <a-plane class="zeus-plane" position="0 0 0" width="1" height="1.777" rotation="0 0 0" material="src: #zeus-video; shader: flat; transparent: false"></a-plane>\n`;
  html += `    </a-entity>\n`;
  currentIndex++;
  
  html += `    <a-entity mindar-image-target="targetIndex: ${currentIndex}" id="target-zeus${i}-tl">\n`;
  html += `      <a-plane class="zeus-plane" position="0.5 -0.888 0" width="2" height="3.554" rotation="0 0 0" material="src: #zeus-video; shader: flat; transparent: false"></a-plane>\n`;
  html += `    </a-entity>\n`;
  currentIndex++;
  
  html += `    <a-entity mindar-image-target="targetIndex: ${currentIndex}" id="target-zeus${i}-tr">\n`;
  html += `      <a-plane class="zeus-plane" position="-0.5 -0.888 0" width="2" height="3.554" rotation="0 0 0" material="src: #zeus-video; shader: flat; transparent: false"></a-plane>\n`;
  html += `    </a-entity>\n`;
  currentIndex++;
  
  html += `    <a-entity mindar-image-target="targetIndex: ${currentIndex}" id="target-zeus${i}-bl">\n`;
  html += `      <a-plane class="zeus-plane" position="0.5 0.888 0" width="2" height="3.554" rotation="0 0 0" material="src: #zeus-video; shader: flat; transparent: false"></a-plane>\n`;
  html += `    </a-entity>\n`;
  currentIndex++;
  
  html += `    <a-entity mindar-image-target="targetIndex: ${currentIndex}" id="target-zeus${i}-br">\n`;
  html += `      <a-plane class="zeus-plane" position="-0.5 0.888 0" width="2" height="3.554" rotation="0 0 0" material="src: #zeus-video; shader: flat; transparent: false"></a-plane>\n`;
  html += `    </a-entity>\n`;
  currentIndex++;
}
html += `  </a-scene>`;

let content = fs.readFileSync('index.html', 'utf8');
const startIndex = content.indexOf('    <!-- FOTO FISIK ZEUS');
const endIndex = content.indexOf('  </a-scene>') + '  </a-scene>'.length;

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + html + content.substring(endIndex);
  // Bump version of cache to 5
  content = content.replace('targets.mind?v=4', 'targets.mind?v=5');
  content = content.replace('app.js?v=4', 'app.js?v=5');
  fs.writeFileSync('index.html', content);
  console.log("Updated index.html");
} else {
  console.log("Could not find replacement bounds");
}
