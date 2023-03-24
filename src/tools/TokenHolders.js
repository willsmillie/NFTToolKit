const { Select, Confirm, prompt } = require("enquirer");
const ora = require("ora");

const MyNFTs = require("./MyNFTs");
const { nftAPI, userAPI, authenticate, web3 } = require("../web3");
const { nftHolders, getAccount } = require("../utils/Requests");
const { sleep, stringToArray } = require("../utils");

// Fetches token holders for a list of NFT Datas
const TokenHolders = async ({ apiKey, accountId, nft }) => {
  // Prompt user to input a list of nftDatas
  const input =
    nft ??
    (await prompt({
      type: "input",
      name: "nftData",
      message:
        "Enter a comma-delimited list of NFT Data, or leave empty all minted tokens",
    }));

  // convert the list to an array
  var nftDatas = stringToArray(input.nftData);

  // If no text is provided fetch all minted nfts
  if (nftDatas.length == 0 || nftDatas == undefined) {
    nftDatas = await MyNFTs.run({ apiKey, accountId }).then((r) =>
      Object.values(r).map((e) => e.nftData)
    );
  }

  // Store the results by creating a list of the account Ids holding token(s)
  var holdersByToken = {};
  var allIds = [];

  // For every nft data (loopring id), make a call to the rest endpoint
  var spinner = ora("[TokenHolders] Fetching holders...").start();
  for (i in nftDatas) {
    // update the spinner progress
    spinner.text = `[TokenHolders] Fetching holders for NFT ${i} of ${nftDatas.length}`;
    // get the data
    let data = nftDatas[i];
    const result = await nftHolders(apiKey, data);

    // add each holder to the results
    for (idx in result) {
      var { accountId } = result[idx];
      holdersByToken[data] = [...(holdersByToken[data] ?? []), accountId];
      allIds.push(accountId);
    }

    await sleep(250);
  }

  // Stop the spinner
  spinner.stop();

  // resolve the loopring account id (integer) to the hex wallet address
  let addresses = await resolveAccountIdsToAddresses(apiKey, [
    ...new Set(allIds),
  ]);

  return addresses;
};

// Resolves a Loopring account Id to its wallet address
const resolveAccountIdsToAddresses = async (apiKey, accountIds) => {
  // Display a spinner
  var spinner = ora("[TokenHolders] Resolving accountIds to addresses").start();

  // Loop over the accounts provided resolving them and appending to the results
  const results = [];
  for (i in accountIds) {
    spinner.text = `[getMetadata] Resolving accountIds to addresses ${i}/${accountIds.length}`;
    var accountId = accountIds[i];
    let res = await getAccount(apiKey, accountId);
    if (res?.owner) results.push(res.owner);
    await sleep(250);
  }

  // stop the spinner
  spinner.stop();

  // remove duplicates
  let uniqueAddresses = [...new Set(results)];
  return uniqueAddresses;
};

module.exports = {
  name: "🧩  Token Holders - Look up current holders for a list of tokenIds",
  run: TokenHolders,
};
