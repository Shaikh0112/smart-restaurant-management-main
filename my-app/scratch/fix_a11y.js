const fs = require('fs');
const path = require('path');

const ADMIN_DIR = path.join(process.cwd(), 'src/app/admin');

const replacements = [
  // Focus visible rings
  { regex: /className="([^"]*)focus:ring-2([^"]*)"/g, replacement: 'className="$1focus-visible:ring-2$2"' },
  { regex: /className="([^"]*)focus:outline-none([^"]*)"/g, replacement: 'className="$1focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary$2"' },
  { regex: /className="([^"]*)focus:ring-primary([^"]*)"/g, replacement: 'className="$1focus-visible:ring-primary$2"' },
  { regex: /className="([^"]*)focus:ring-([a-z]+-[0-9]+)([^"]*)"/g, replacement: 'className="$1focus-visible:ring-$2$3"' },
  
  // Motion safe
  { regex: /className="([^"]*)\btransition-all\b([^"]*)"/g, replacement: 'className="$1motion-safe:transition-all$2"' },
  { regex: /className="([^"]*)\btransition-colors\b([^"]*)"/g, replacement: 'className="$1motion-safe:transition-colors$2"' },
  { regex: /className="([^"]*)\banimate-pulse\b([^"]*)"/g, replacement: 'className="$1motion-safe:animate-pulse$2"' },
  { regex: /className="([^"]*)\banimate-spin\b([^"]*)"/g, replacement: 'className="$1motion-safe:animate-spin$2"' },
  
  // Exclude duplicates
  { regex: /motion-safe:motion-safe:/g, replacement: 'motion-safe:' },
  { regex: /focus-visible:focus-visible:/g, replacement: 'focus-visible:' },
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
console.log("A11y fix complete.");
