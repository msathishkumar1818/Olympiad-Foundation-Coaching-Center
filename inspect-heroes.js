const fs = require('fs');
const css = fs.readFileSync('assets/css/style.css', 'utf8');
const idx = css.indexOf('/* Hero 2 Panoramic Mosaic */');
console.log(JSON.stringify(css.substring(idx - 60, idx + 40)));
