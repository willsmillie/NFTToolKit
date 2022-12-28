const fs = require("fs");
const path = require("path");

function tryReadFile(pathItem) {
  let exists = !!path.extname(pathItem);
  if (exists) {
    try {
      return fs.readFileSync(pathItem, "utf8");
    } catch (error) {
      return pathItem;
    }
  } else {
    return pathItem;
  }
}

module.exports = tryReadFile;
