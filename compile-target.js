// compile-target.js
// Jalankan: node compile-target.js
// Output: targets.mind

const path = require('path');
const fs   = require('fs');

async function compile () {
  console.log('📦 Loading MindAR compiler...');

  // Try to load the compiler from node_modules
  let compiler;
  try {
    const { Compiler } = require('@tensorflow-models/body-pix');
    // Wrong package, but let's try the actual one
  } catch (_) {}

  // MindAR's compiler is browser-based; use the bundled one
  try {
    const mindarPath = path.join(__dirname, 'node_modules', 'mind-ar', 'src', 'image-target', 'compiler.js');
    if (fs.existsSync(mindarPath)) {
      const { Compiler } = require(mindarPath);
      console.log('✅ MindAR compiler loaded');
      // ... compile logic
    } else {
      console.log('⚠️  mind-ar compiler not found at:', mindarPath);
      console.log('Listing node_modules/mind-ar if it exists:');
      const nmPath = path.join(__dirname, 'node_modules', 'mind-ar');
      if (fs.existsSync(nmPath)) {
        console.log(fs.readdirSync(nmPath));
      } else {
        console.log('mind-ar not installed');
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

compile();
