const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'locales', 'tk.json');
const content = fs.readFileSync(filePath, 'utf8');

// Parse and re-stringify to remove duplicates (last one wins)
try {
    const json = JSON.parse(content);
    const cleaned = JSON.stringify(json, null, 2);
    fs.writeFileSync(filePath, cleaned, 'utf8');
    console.log('tk.json cleaned successfully');
} catch (e) {
    console.error('Error parsing JSON:', e);
}
