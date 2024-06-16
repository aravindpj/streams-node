const fs = require("node:fs/promises");
const MyReadableStream = require("./MyReadableStream");

(async () => {
  console.time("readBig");
  // const fileHandleRead = new MyReadableStream({highWaterMark:64*1024,fileName:"text.txt"})
  const fileHandleWrite = await fs.open("dest.txt", "w");
  // here we replaced our own stream
  const streamRead = new MyReadableStream({highWaterMark:64*1024,fileName:"text.txt"})
  const streamWrite = fileHandleWrite.createWriteStream();

  let split = "";

  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").split("  ");

    if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
      if (split) {
        numbers[0] = split.trim() + numbers[0].trim();
      }
    }

    if (
      Number(numbers[numbers.length - 2]) + 1 !==
      Number(numbers[numbers.length - 1])
    ) {
      split = numbers.pop();
    }

    numbers.forEach((number) => {
      let n = Number(number);

      if (n % 10 === 0) {
        if (!streamWrite.write(" " + n + " ")) {
          streamRead.pause();
        }
      }
    });
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });

  streamRead.on("end", () => {
    console.log("Done reading.");
    console.timeEnd("readBig");
  });
})();
