const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'biozfresh.html');
const content = fs.readFileSync(filePath, 'utf8');

function extractFunction(content, name) {
  const startIndex = content.indexOf(`function ${name}`);
  if (startIndex === -1) return null;
  let braceCount = 0;
  let inString = false;
  let stringChar = '';
  let i = startIndex;
  while (i < content.length) {
    const char = content[i];
    if ((char === '"' || char === "'" || char === '`') && content[i-1] !== '\\') {
      if (!inString) { inString = true; stringChar = char; }
      else if (stringChar === char) { inString = false; }
    }
    if (!inString) {
      if (char === '{') { braceCount++; }
      else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          return content.slice(startIndex, i + 1);
        }
      }
    }
    i++;
  }
  return null;
}

console.log(extractFunction(content, 'renderTopNav'));
