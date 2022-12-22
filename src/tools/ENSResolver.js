const { Select, Confirm, prompt } = require("enquirer");
const { nftAPI, userAPI, authenticate, web3 } = require("../web3");
const { stringToArray } = require("../utils/Address");

const { nftHolders, getAccount } = require("../utils/Requests");
const { resolveENS } = require("../utils/ENS");
const sleep = require("../utils/sleep");

const ENSResolver = async ({ apiKey, accountId }) => {
  // Ask for a comma-delimited list of addresses (hex or ens)
  const input = await prompt({
    type: "input",
    name: "ensList",
    message: "Enter a comma-delimited list of addresses (ens or hex)",
  });

  // convert the input to an array
  var ensList = stringToArray(input.ensList);
  if (ensList.length == 0 || ensList == undefined)
    return console.error("No ens names were provided");

  // Store the results by creating a list of the account Ids holding token(s)
  var resolvedAddress = {};
  var allAddresses = [];

  // resolve every ens address, if its a hex address it'll be passed through
  for (i in ensList) {
    let ens = ensList[i];
    const result = await resolveENS(ens);
    resolvedAddress[ens] = result;
    allAddresses.push(result);
    await sleep(250);
  }

  // flatten the array removing duplicate items
  let uniqueAddresses = [...new Set(allAddresses)];

  // warn if any failed
  if (uniqueAddresses.length !== ensList.length)
    console.warn("Some addresses failed to be resolved...");

  return uniqueAddresses;
};

// Resolves a Loopring account Id to its wallet address
module.exports = {
  name: "👾  ENS Resolver - Get addresses for a list of ENS domains",
  run: ENSResolver,
};
