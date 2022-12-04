const { Select, Confirm } = require("enquirer");
const choices = [
  require("./MyNFTs"),
  require("./SendNFTs"),
  require("./TokenHolders"),
];

const Main = async () => await Menu.run().then(runTool);
const runTool = async (value) => choices.find((e) => e.name === value).run();

const Menu = new Select({
  name: "Main Menu",
  message: "🛸 Welcome to the NFT Tool Kit! What would you like to do?",
  choices: choices,
});

module.exports = { Main };
