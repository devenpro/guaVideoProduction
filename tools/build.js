// VPM bundler — concatenates source files into dist/vpm.js and dist/vpm.css.
// Zero dependencies. Run via `npm run build` or `node tools/build.js`.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'build.config.json'), 'utf8'));
const stamp = new Date().toISOString();
const banner = (kind) => `/*! VPM ${kind} bundle — built ${stamp} */\n`;

function bundle(files, outRel, kind) {
  const outPath = path.join(ROOT, outRel);
  const out = banner(kind) + files
    .map((f) => `\n/* ===== ${f} ===== */\n` + fs.readFileSync(path.join(ROOT, f), 'utf8'))
    .join('\n');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, out);
  console.log(`  ${outRel}  (${(out.length / 1024).toFixed(1)} KB, ${files.length} files)`);
}

console.log('Building VPM bundles...');
bundle(cfg.js, 'dist/vpm.js', 'JS');
bundle(cfg.css, 'dist/vpm.css', 'CSS');
console.log('Done.');
