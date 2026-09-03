const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.vue')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('/Users/marquis/tix-booking/admin/pages/dashboard');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the exact string
  content = content.replace(/<main class="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-grow w-full[^>]*>/, '<main class="w-full max-w-7xl mx-auto space-y-8">');
  content = content.replace(/<main v-if="loading" class="max-w-7xl mx-auto px-4 md:px-6 py-24 flex-grow w-full[^>]*>/, '<main v-if="loading" class="w-full max-w-7xl mx-auto space-y-8">');
  content = content.replace(/<main v-else class="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-grow w-full[^>]*>/, '<main v-else class="w-full max-w-7xl mx-auto space-y-8">');

  fs.writeFileSync(file, content);
});
console.log('Padding cleaned in admin pages.');
