const { Select, Confirm, prompt } = require("enquirer");
const { nftAPI, userAPI, authenticate, web3 } = require("../web3");

const { getAccount, getMetadataForNFTIds } = require("../utils/Requests");
const { stringToArray } = require("../utils");

const MetadataRetriever = async (context) => {
  const { apiKey, accountId } = context;
  // Ask for a comma-delimited list of addresses (hex or ens)
  const input = await prompt({
    type: "input",
    name: "nftIds",
    message: "Enter a comma-delimited list of nftIds (ens or hex)",
  });

  // convert the input to an array
  var nftIds = stringToArray(input.nftIds);
  if (nftIds.length == 0 || nftIds == undefined)
    return console.error("No nftIds were provided");

  // resolve every nftId, if its a hex address it'll be passed through
  const results = await getMetadataForNFTIds(nftIds);

  return results;
};

// Resolves a Loopring account Id to its wallet address
module.exports = {
  name: "🌐  Get Metadata - Retrieve metadata (ipfs, nft, collection) via nftId.",
  run: MetadataRetriever,
};
