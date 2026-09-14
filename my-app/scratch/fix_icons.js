const fs = require('fs');
const path = require('path');

const ADMIN_DIR = path.join(process.cwd(), 'src/app/admin');

// List of all Lucide icons used (heuristic)
const iconNames = ['UserCheck', 'UserX', 'UserPlus', 'Shield', 'Search', 'AlertCircle', 'CheckCircle2', 'RefreshCw', 'Info', 'Clock', 'ChevronRight', 'ChevronDown', 'ChevronLeft', 'X', 'Plus', 'Trash2', 'Edit', 'Eye', 'Menu', 'LogOut', 'Settings', 'Download', 'Upload', 'FileText', 'Calendar', 'Camera', 'QrCode', 'CreditCard', 'DollarSign', 'Percent', 'Star', 'Mail', 'Phone', 'MapPin', 'Home', 'Users', 'Package', 'ShoppingCart', 'ShoppingBag', 'TrendingUp', 'TrendingDown', 'Activity', 'Archive', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Maximize', 'Minimize', 'Printer'];

const replacements = iconNames.map(icon => {
  return {
    // find <IconName ... /> without size or strokeWidth
    regex: new RegExp(`<${icon}\\s+([^>]*?)(?<!size={)(?<!strokeWidth={)>`, 'g'),
    replacement: (match, p1) => {
      if (p1.includes('size=') || p1.includes('strokeWidth=')) {
        return `<${icon} ${p1}>`;
      }
      return `<${icon} ${p1} size={18} strokeWidth={2}>`;
    }
  };
});

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
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
console.log("Icon fix complete.");
