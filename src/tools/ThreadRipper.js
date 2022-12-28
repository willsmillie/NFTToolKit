const { Select, Confirm, prompt } = require("enquirer");
const { nftAPI, userAPI, authenticate, web3 } = require("../web3");

const { nftHolders, getAccount } = require("../utils/Requests");
const { sleep, resolveENS, stringToArray } = require("../utils");

const ThreadRipper = async (context) => {
  const { apiKey, accountId } = context;
};

// Resolves a Loopring account Id to its wallet address
module.exports = {
  name: "🧵  Thread Ripper - Get commented addresses from social media threads",
  run: ThreadRipper,
};
