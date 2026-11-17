import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(astro|md)$/.test(entry.name)) {
      const text = fs.readFileSync(full, 'utf8');
      const patterns = [
        /const description =\s*'([^']+)'/g,
        /const title = '([^']+)'/g,
        /^description: (.+)$/gm,
        /^title: (.+)$/gm,
      ];
      for (const pattern of patterns) {
        for (const match of text.matchAll(pattern)) {
          const value = match[1].trim();
          const kind = pattern.source.startsWith('const title') || pattern.source.startsWith('^title') ? 'title' : 'desc';
          if (kind === 'desc' || value.includes('|') || value.length > 20) {
            console.log(`${kind}\t${value.length}\t${path.relative('src', full)}\t${value}`);
          }
        }
      }
    }
  }
}

walk('src');
