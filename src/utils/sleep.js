// The amount of time in milliseconds to wait before continuing to execute the program
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = sleep;
