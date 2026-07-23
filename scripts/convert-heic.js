const fs = require('fs');
const path = require('path');
const convert = require('heic-convert');

const dir = 'c:/Users/USER/Desktop/marriage/public/images';

(async () => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.toLowerCase().endsWith('.heic')) {
      const inputPath = path.join(dir, file);
      const outputPath = path.join(dir, file.replace(/\.HEIC$/i, '.jpg'));
      console.log(`Converting ${file}...`);
      const inputBuffer = fs.readFileSync(inputPath);
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.9
      });
      fs.writeFileSync(outputPath, outputBuffer);
      console.log(`Saved ${outputPath}`);
      // Clean up the original HEIC file
      fs.unlinkSync(inputPath);
    }
  }
  console.log('All HEIC files successfully converted to high-quality JPG!');
})();
