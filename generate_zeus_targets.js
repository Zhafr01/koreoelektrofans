const fs = require('fs');

let html = "";
let currentIndex = 21;

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

let content = fs.readFileSync('index.html', 'utf8');
content = content.replace('  </a-scene>', html + '  </a-scene>');
fs.writeFileSync('index.html', content);

console.log("Updated index.html");
