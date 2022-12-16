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
  if (tokenIds.length == 0 || tokenIds == undefined)
    tokenIds = ["0xe5c6e1935702cc28c0da959e06196920649a8579"]; //await MyNFTs.run();

  for (idx in tokenIds) {
    let token = tokenIds[idx];

    // const latest = await web3.eth.getBlock("latest");
    const logs = await getPastLogs(token, "0", "latest");

    for (i in logs) {
      let event = logs[i];

      let transaction = web3.eth.abi.decodeLog(
        [
          {
            type: "address",
            name: "operator",
            indexed: true,
          },
          {
            type: "address",
            name: "from",
            indexed: true,
          },
          {
            type: "address",
            name: "to",
            indexed: true,
          },
          {
            type: "uint256",
            name: "id",
          },
          {
            type: "uint256",
            name: "value",
          },
        ],
        event.data,
        [event.topics[1], event.topics[2], event.topics[3]]
      );

      console.log(
        `\n` +
          `New ERC-1155 transaction found in block ${event.blockNumber} with hash ${event.transactionHash}\n` +
          `Operator: ${transaction.operator}\n` +
          `From: ${
            transaction.from === "0x0000000000000000000000000000000000000000"
              ? "New mint!"
              : transaction.from
          }\n` +
          `To: ${transaction.to}\n` +
          `id: ${transaction.id}\n` +
          `value: ${transaction.value}`
      );
    }
  }
};

async function getPastLogs(address, fromBlock, toBlock) {
  if (fromBlock <= toBlock) {
    try {
      const options = {
        address: address,
        fromBlock: fromBlock,
        toBlock: toBlock,
        topics: [
          "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
        ],
      };
      return await web3.eth.getPastLogs(options);
    } catch (error) {
      const midBlock = (fromBlock + toBlock) >> 1;
      const arr1 = await getPastLogs(address, fromBlock, midBlock);
      const arr2 = await getPastLogs(address, midBlock + 1, toBlock);
      return [...arr1, ...arr2];
    }
  }
  return [];
}

module.exports = {
  name: "🔎 Token Holders - Look up current holders for a list of tokenIds",
  run: TokenHolders,
};
