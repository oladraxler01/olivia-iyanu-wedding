const { promisify } = require('util');
const fs = require('fs');
const convert = require('heic-convert');

(async () => {
  try {
    const files = [
      { input: './public/images/soul connection.heic', output: './public/images/soul_connection.jpg' },
      { input: './public/images/Radiant LOVE.heic', output: './public/images/Radiant_LOVE.jpg' }
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
