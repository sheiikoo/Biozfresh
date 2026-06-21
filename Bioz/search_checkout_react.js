const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'biozfresh-mobile-web', 'client', 'src');

function walkDir(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = walkDir(srcPath);
console.log('Total files found in client/src:', allFiles.length);

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('checkout') || content.includes('Checkout') || content.includes('Delivery')) {
    console.log(`File: ${path.relative(srcPath, file)}`);
  }
});
