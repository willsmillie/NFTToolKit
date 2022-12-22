const { Select, Confirm, prompt } = require("enquirer");
const { nftAPI, userAPI } = require("../web3");
const { getMints, getNFTData } = require("../utils/Requests");
const { stringToArray } = require("../utils/Address");
const sleep = require("../utils/sleep");

const fs = require("fs");

const TokenLookup = async ({ apiKey, accountId }) => {
  const input = await prompt({
    type: "input",
    name: "nftIds",
    message:
      "Enter a comma-delimited list of NFT IDs, or leave empty view your holdings",
  });

  var nftIds = stringToArray(input.nftIds);
  if (nftIds.length == 0 || nftIds == undefined) nftIds = await MyNFTs.run();

  // Store the results by creating a list of the token(s) metadata
  var results = {};

  // For every nft data (loopring id), make a call to the rest endpoint
  const minter = "0xb28e467158f4de5a652d308ae580b1733e3fb463";
  const tokenAddress = "0xe5c6e1935702cc28c0da959e06196920649a8579";
  for (i in nftIds) {
    let id = nftIds[i];
    const result = await getNFTData(apiKey, minter, tokenAddress, id);
    results[id] = result;
    await sleep(250);
  }

  // // Load metadata info from the NFT Data
  // let infos = await nftAPI
  //   .getInfoForNFTTokens({ nftDatas: nftDatas })
  //   .then((e) => e.raw_data);
  // // if (!infos) return console.log("NO NFT INFOS :(");

  // let nftIds = infos.map((e) => e.nftId);
  // // if (!nftIds) return console.log("NO NFT IDs :(");

  // var results = {};
  // let data = JSON.stringify(results, null, 2);
  // fs.writeFileSync("metadata.json", data);

  console.log(results);

  return nftIds;
};

module.exports = {
  name: "🔎  NFT Lookup - Get metadata for NFTs by id",
  run: TokenLookup,
};
