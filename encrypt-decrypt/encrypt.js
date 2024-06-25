const { Transform } = require("node:stream");
const fs = require("fs/promises");
const readline = require("readline");

class Encryption extends Transform {
  constructor() {
    super();

    this.processedSize = 0;
  }

  _transform(chunk, encoding, callback) {
    // Encrypting logic
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] !== 255) {
        chunk[i] = chunk[i] + 1;
      }
    }

    // Update processed size
    this.processedSize += chunk.length;

    // Emit progress event with the cumulative size
    this.emit("progress", this.processedSize);

    callback(null, chunk);
  }
}

(async () => {
  const readFileHandler = await fs.open("text.txt", "r");
  const writeFileHandler = await fs.open("enc.txt", "w");

  const readStream = readFileHandler.createReadStream();
  const writeStream = writeFileHandler.createWriteStream();
  const fileSize = (await readFileHandler.stat()).size;
  const encrypt = new Encryption();

  // Setup readline interface for dynamic console output
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Handle progress event
  encrypt.on("progress", (sizeRead) => {
    // Calculate percentage
    const percentage = (sizeRead / fileSize) * 100;

    // Log percentage with two decimal points
    const percentageFixed = percentage.toFixed(2);

    // Clear the line and display the percentage
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Progress: ${percentageFixed}%`);
  });

  // Close readline interface on stream end
  writeStream.on("finish", () => {
    rl.close();
    console.log("\nEncryption completed.");
  });

  readStream.pipe(encrypt).pipe(writeStream);
})();
