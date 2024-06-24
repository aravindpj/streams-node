const { Transform } = require("node:stream");
const fs = require("fs/promises");
class decryption extends Transform {
  _transform(chunk, encoding, callback) {
    // encrypting logic
    //<Buffer 32 +1 ff 45+1>
    // 0xff in decimal 255 , which means 1 byte maximum can only hold

    for (let i = 0; i < chunk.length; i++) {
      //dont need to inc decimal val 255 it will be loose our data
      if (chunk[i] !== 255) {
        chunk[i] = chunk[i] - 1;
      }
    }

    callback(null, chunk);
  }
}

(async () => {
  const readFileHandler = await fs.open("enc.txt", "r");
  const writeFileHandler = await fs.open("dec.txt", "w");

  const readStream = readFileHandler.createReadStream();
  const writeStream = writeFileHandler.createWriteStream();
  const decrypt = new decryption();
  console.log(decrypt)
  readStream.pipe(decrypt).pipe(writeStream);
})();