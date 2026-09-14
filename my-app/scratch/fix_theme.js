const fs = require('fs');
const path = require('path');

const ADMIN_DIR = path.join(process.cwd(), 'src/app/admin');

const replacements = [
  { regex: /bg-black\/60/g, replacement: 'bg-overlay' },
  { regex: /border-red-500\/40/g, replacement: 'border-danger' },
  { regex: /border-red-500\/30/g, replacement: 'border-danger' },
  { regex: /border-red-500/g, replacement: 'border-danger' },
  { regex: /bg-red-500\/10/g, replacement: 'bg-danger-bg' },
  { regex: /bg-red-500\/5/g, replacement: 'bg-danger-bg' },
  { regex: /bg-red-500/g, replacement: 'bg-danger' },
  { regex: /text-red-500/g, replacement: 'text-danger' },
  { regex: /bg-red-600/g, replacement: 'bg-danger' },
  { regex: /hover:bg-red-600/g, replacement: 'hover:bg-danger' },
  
  { regex: /bg-blue-500\/20/g, replacement: 'bg-info-bg' },
  { regex: /border-blue-500\/30/g, replacement: 'border-info' },
  { regex: /text-blue-600/g, replacement: 'text-info' },
  
  { regex: /text-amber-500/g, replacement: 'text-warning' },
  
  { regex: /border-gray-300/g, replacement: 'border-border' },
  { regex: /bg-gray-100/g, replacement: 'bg-input' },
  { regex: /bg-white\/10/g, replacement: 'bg-card' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      replacements.forEach(({ regex, replacement }) => {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(ADMIN_DIR);
console.log("Theme fix complete.");
