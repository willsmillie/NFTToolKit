const { Select, Confirm } = require("enquirer"); // prompts for user input
const ora = require("ora"); // spinner for async requests
const ascii = require("figlet"); // ascii art generator for the banner
const fs = require("fs"); // File system read/write
require("console.mute"); // used for the ability to silence some of Loopring's logs

const { authenticate } = require("../web3"); // we authenticate the user upon startup of the program
const sleep = require("../utils/sleep"); // async method

// Tools to show in a list
const choices = [
  require("./AirDrop"),
  require("./MyNFTs"),
  require("./TokenMetadata"),
  require("./TokenHolders"),
  require("./ENSResolver"),
];

// The primary program entry point
const Main = async () => {
  // Print the banner
  await printHeader();
  // load keys and accountId for the environment
  const env = await authTool();

  // Display the main menu
  var tool = await Menu.run();
  let result = await runTool(tool, env);
  let data = JSON.stringify(result, null, 2);
  fs.writeFileSync("output.json", data);

  if (true) {
    console.log(result);
  }
};

// Select menu for picking and running tools
var Menu = new Select({
  name: "Main Menu",
  message: "Welcome to the NFT Tool Kit! What would you like to do?",
  choices: choices,
});

// Prints a large ASCII art banner
const printHeader = async () => {
  ascii("NFT Tool Kit", async (err, header) => {
    console.log(header + "\n\t\tPowered by Loopring 🏴‍☠️\n");
  });
  await sleep(250);
};

// Authenticate with Loopring's sdk
const authTool = async () => {
  const spinner = ora("Authenticating with Loopring API...").start();

  console.mute();
  const { accountId, apiKey } = await authenticate();
  console.resume();

  accountId && apiKey
    ? spinner.succeed("Authentication Succeeded!\n")
    : spinner.fail("Authentication Failed!\n");
  spinner.stop();

  return { accountId, apiKey };
};

// Runs the selected tool from the main menu, passing the env along to it
const runTool = async (tool, env) =>
  await choices.find((e) => e.name === tool).run(env);

module.exports = { Main };
