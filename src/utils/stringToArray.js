// const fs = require("fs");
// const file = fs.readFileSync("./accounts.txt", "utf8");
// const accounts = [...new Set(file)];

const stringToArray = (string) => {
  return (
    string
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => !line.startsWith("#"))
      .join("\n")
      // split by spaces and remove empty lines
      .split(/\s+|,+|'+|"+|`/)
      .filter(Boolean)
      // replace common characters
      .map((line) => line.replace(/['",\[\]]]/gim, "").trim())
      // remove period from front or back of lines
      .map((line) => line.replace(/^\.|\.$/gim, "").trim())
      // filter only for lines remaining with .eth or 0x
      .filter((line) => line.endsWith(".eth") || line.startsWith("0x"))
  );
};

module.exports = stringToArray;
