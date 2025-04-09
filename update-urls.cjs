const fs = require('fs');
const path = require('path');

const fromUrl = 'http://localhost:5000';
const toUrl = 'https://medaccess-backend.onrender.com';

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile()) {
      callback(filepath);
    }
  });
}

const jsFiles = [];
walkSync('src', (filepath) => {
  if (filepath.endsWith('.js') || filepath.endsWith('.jsx')) {
    jsFiles.push(filepath);
  }
});

let modifiedCount = 0;

jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes(fromUrl)) {
    const newContent = content.replace(new RegExp(fromUrl, 'g'), toUrl);
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Modified: ${file}`);
    modifiedCount++;
  }
});

console.log(`Total files modified: ${modifiedCount}`); 