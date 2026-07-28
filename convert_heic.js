const fs = require('fs');
const convert = require('heic-convert');

(async () => {
  try {
    const inputBuffer = fs.readFileSync('public/images/IMG_2545.HEIC');
    const outputBuffer = await convert({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'JPEG',      // output format
      quality: 1           // the jpeg compression quality, between 0 and 1
    });
    fs.writeFileSync('public/images/IMG_2545.jpg', outputBuffer);
    console.log('Conversion successful!');
  } catch (error) {
    console.error('Error converting file:', error);
  }
})();
