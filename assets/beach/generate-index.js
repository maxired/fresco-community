const fs = require("fs");
const path = require("path");

const index = require("./index.json");
(async () => {
  // Our starting point
  try {
    // Get the files as an array
    const files = await fs.promises.readdir(".");

    for (const file of files) {
      if (!file.endsWith(".png") && !file.endsWith(".jpg")) {
        continue;
      }

      if (index.filter((x) => x.filename === file).length !== 0) {
        // ignore this file
        continue;
      }

      index.push({
        filename: file,
        name: path.parse(file).name.replace(/-/g, " "),
      });
      console.log("Adding " + file);
    } // End for...of

    fs.writeFile("index.json", JSON.stringify(index), "utf8", (err) => {});
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e);
  }
})();
