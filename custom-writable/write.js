
//import our stream here
const MyWritableStream=require('./MyWritableStream')

// writing millions to file using our own custom writable stream class

// Execution Time: 345.4ms
// Memory Usage: 50MB

const stream = new MyWritableStream({
  highWaterMark: 16 * 1024,
  fileName: "text.txt",
});
(async () => {
  console.time("Write Many :");
  let i = 0;
  const numbersToWrite = 1000000;

  const wrtieMany = () => {
    while (i < numbersToWrite) {
      let buff = Buffer.from(` ${i} `);

      if (i === numbersToWrite - 1) {
        return stream.end(buff);
      }
      if (!stream.write(buff)) {
        break;
      }
      i++;
    }
  };
  wrtieMany();

  stream.on("drain", () => {
    console.log("drained");
    wrtieMany();
  });
  stream.on("finish", () => {
    console.timeEnd("Write Many :");
  });
})();
