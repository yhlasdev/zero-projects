const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'locales', 'tk.json');

try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Using a simple regex-based approach to find and remove the second "documents" block if it exists
    // This is because JSON.parse might fail if there are true duplicates in some environments, 
    // although standard JSON.parse usually just takes the last one.
    
    const json = JSON.parse(content);
    const cleaned = JSON.stringify(json, null, 2);
    fs.writeFileSync(filePath, cleaned, 'utf8');
    console.log('tk.json cleaned successfully');
} catch (e) {
    console.error('Error processing JSON:', e);
    process.exit(1);
}
