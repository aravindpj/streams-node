const { Transform } = require("node:stream");
const fs = require("fs/promises");
const readline = require("readline");

class decryption extends Transform {
  constructor() {
    super();
    this.processedSize = 0;
  }
  _transform(chunk, encoding, callback) {
    // encrypting logic
    //<Buffer 32 +1 ff 45+1>
    // 0xff in decimal 255 , only 8bit maximum can hold

    for (let i = 0; i < chunk.length; i++) {
      //dont need to inc decimal val 255 it will be loose our data
      if (chunk[i] !== 255) {
        chunk[i] = chunk[i] - 1;
      }
    }
    this.processedSize += chunk.length;

    this.emit("progress", this.processedSize);
    callback(null, chunk);
  }
}

(async () => {
  const readFileHandler = await fs.open("enc.txt", "r");
  const writeFileHandler = await fs.open("dec.txt", "w");
  const fileSize = (await readFileHandler.stat()).size;
  const readStream = readFileHandler.createReadStream();
  const writeStream = writeFileHandler.createWriteStream();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const decrypt = new decryption();

  decrypt.on("progress", (sizeRead) => {
    const percentage = ((sizeRead / fileSize) * 100).toFixed(2);

    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Progress: ${percentage}%`);
  });

  writeStream.on("finish", () => {
    rl.close();
    console.log(`Decryption completed`);
  });

  console.log(decrypt);
  readStream.pipe(decrypt).pipe(writeStream);
})();
