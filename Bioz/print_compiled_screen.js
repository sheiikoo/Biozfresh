const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'biozfresh.html');
const content = fs.readFileSync(filePath, 'utf8');

function extractFunction(content, name) {
  const idx = content.indexOf(`function ${name}`);
  if (idx === -1) {
    const altIdx = content.indexOf(`window.${name}`);
    if (altIdx === -1) return null;
    return content.slice(altIdx, altIdx + 500);
  }
  return content.slice(idx, idx + 500);
}

console.log('--- renderCurrentScreen in compiled biozfresh.html ---');
console.log(extractFunction(content, 'renderCurrentScreen'));
