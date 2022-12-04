const { Select, Confirm, prompt } = require("enquirer");
const { userAPI, authenticate, web3 } = require("../web3");
const { stringToArray } = require("../utils/Address");
const MyNFTs = require("./MyNFTs");

const TokenHolders = async () => {
  //   const { accountId, apiKey } = await authenticate();

  //   const lookUpTokensNow = await new Confirm({
  //     name: "look-up",
  //     message: "Would you like to run fetch all of your tokens now?",
  //   }).run();

  // get a list of tokens
  var input = await prompt({
    type: "input",
    name: "tokenIds",
    message:
      "Enter a comma-delimited list of token IDs, or leave empty view your holdings",
  });

  var tokenIds = stringToArray(input.tokenIds);
  if (tokenIds.length === 0) tokenIds = await MyNFTs.run();

  const params = {
    address: tokenIds[0],
    // fromBlock: "0x1",
    // toBlock: "latest",
    // topics: [
    //   web3.utils.sha3("adduintevent(uint,uint)"),
    //   web3.utils.sha3("0x8"),
    // ],
  };

  const r = await web3.eth.getTransactionCount(tokenIds[0]);
  // callback code here
  console.log(r);
};

module.exports = {
  name: "Token Holders - Look up current holders for a list of tokenIds",
  run: TokenHolders,
};
