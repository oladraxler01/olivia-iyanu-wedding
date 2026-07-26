const { promisify } = require('util');
const fs = require('fs');
const convert = require('heic-convert');

(async () => {
  try {
    const files = [
      { input: './public/images/matching_game/IMG_9412.heic', output: './public/images/matching_game/IMG_9412.jpg' },
      { input: './public/images/matching_game/IMG_9510.heic', output: './public/images/matching_game/IMG_9510.jpg' }
    ];

    for (const file of files) {
      console.log(`Converting ${file.input}...`);
      const inputBuffer = await promisify(fs.readFile)(file.input);
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 1
      });
      await promisify(fs.writeFile)(file.output, outputBuffer);
      console.log(`Saved ${file.output}`);
    }
  } catch (error) {
    console.error("Error converting HEIC:", error);
  }
})();
