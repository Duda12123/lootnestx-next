const sharp = require('sharp');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const svgPath = path.join(projectRoot, 'public', 'og-image.svg');
const pngPath = path.join(projectRoot, 'public', 'og-image.png');

sharp(svgPath)
  .resize(1200, 630)
  .png()
  .toFile(pngPath)
  .then(info => {
    console.log('OG image created:', pngPath);
    console.log('Size:', info.size, 'bytes');
    console.log('Format:', info.format);
    console.log('Width:', info.width);
    console.log('Height:', info.height);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
