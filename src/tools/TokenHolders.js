const { Select, Confirm, prompt } = require("enquirer");
const { userAPI, authenticate, web3 } = require("../web3");
const { stringToArray } = require("../utils/Address");
const MyNFTs = require("./MyNFTs");

const TokenHolders = async () => {
  // get a list of tokens
  var input = await prompt({
    type: "input",
    name: "tokenIds",
    message:
      "Enter a comma-delimited list of token IDs, or leave empty view your holdings",
  });

  var tokenIds = stringToArray(input.tokenIds);
  // if (tokenIds.length === 0) tokenIds = await MyNFTs.run();

  for (idx in tokenIds) {
    let token = tokenIds[idx];

    // var events = aContract.getPastEvents("Transfer", {
    //   filter: {},
    //   fromBlock: 5555555,
    //   toBlock: 5555555,
    // });

    let txHistory = await web3.eth.getPastLogs({
      address: token,
      fromBlock: "earliest",
      toBlock: "latest",
      topics: [
        "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
      ],
    });

    console.log(txHistory);
  }
};

module.exports = {
  name: "Token Holders - Look up current holders for a list of tokenIds",
  run: TokenHolders,
};
