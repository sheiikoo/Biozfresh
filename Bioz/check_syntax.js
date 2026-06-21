const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filePath = path.join(__dirname, '..', 'biozfresh.html');
const content = fs.readFileSync(filePath, 'utf8');

// Extract the script block
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.lastIndexOf('</script>');

if (scriptStart === -1 || scriptEnd === -1) {
  console.error('Script block not found!');
  process.exit(1);
}

const scriptCode = content.slice(scriptStart + 8, scriptEnd);

console.log('Script block extracted. Length:', scriptCode.length);

try {
  // Try to compile the script in Node vm
  new vm.Script(scriptCode);
  console.log('JavaScript syntax is perfectly valid! No syntax errors.');
} catch (e) {
  console.error('SYNTAX ERROR DETECTED:');
  console.error(e.message);
  console.error(e.stack);
}
