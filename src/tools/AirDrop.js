const { Select, Confirm, prompt } = require("enquirer");
const {
  sleep,
  stringToArray,
  tryReadFile,
  blacklist,
  loadTxHistory,
  resolveENS,
} = require("../utils");

const { getMints } = require("../utils/Requests");

const ora = require("ora"); // spinner for async requests
const ProgressBar = require("ora-progress-bar");
const TokenHolders = require("./TokenHolders");

require("console.mute"); // used for the ability to silence some of Loopring's logs

const { userAPI, web3, sdk } = require("../web3");

const AirDrop = async (context) => {
  const { apiKey, accountId, eddsaKey, exchangeAddress } = context;

  let memo = "Sent w/ https://github.com/willsmillie/nfttoolkit";

  // Select NFT
  const selectNFT = async () => {
    var nfts = await getMints(apiKey, accountId);
    var nftIds = nfts.map((e) => e.nftId);

    // Prompt user to select an NFT
    const nftOptions = new Select({
      name: "id",
      message: `Select an nft (by nftId) (${nftIds.length} results)`,
      choices: nftIds,
    });

    const selectedId = await nftOptions.run();
    const selected = nfts.find((nft) => nft.nftId === selectedId);
    return selected;
  };

  // Get address list
  const selectAddresses = async () => {
    // Ask for a comma-delimited list of addresses (hex or ens)
    const input = await prompt({
      type: "input",
      name: "addresses",
      message:
        "Enter a file path, or comma-delimited list of addresses (ens or hex)",
    });

    var selectedAddresses = stringToArray(tryReadFile(input.addresses));

    // resolve the input addresses throttling the loop to prevent rate limiting
    var resolvedAddresses = [];
    for (i in selectedAddresses) {
      let address = selectedAddresses[i];
      let r = await resolveENS(address);
      resolvedAddresses.push(r);
    }

    return resolvedAddresses;
  };

  // Get Fees
  const selectFee = async (selection) => {
    // get fees to make sure we can afford this
    const { fees } = await userAPI.getNFTOffchainFeeAmt(
      {
        accountId: accountId,
        requestType: sdk.OffchainNFTFeeReqType.NFT_TRANSFER,
        tokenAddress: selection.tokenAddress,
      },
      apiKey
    );

    const USD_COST = parseInt((fees["USDC"] || fees["USDT"]).fee, 10) / 1e6;
    const feeOptions = new Select({
      name: "fee",
      message: `Pick a fee option USD ~$${USD_COST}`,
      choices: Object.entries(fees)
        .filter(([k]) => /ETH|LRC/.test(k))
        .map(([k]) => k),
    });

    const selectedFee = await feeOptions.run();
    return fees[selectedFee];
  };

  // transfer a single token to an address with a selected fee
  const transferTokenToAddress = async (nft, address, fee) => {
    if (blacklist.includes(address))
      return console.warn(`Address is blacklisted, skipping ${address}`);

    // get storage id for sending
    console.mute();
    const { offchainId } = await userAPI.getNextStorageId(
      { accountId: accountId, sellTokenId: nft.tokenId },
      apiKey
    );
    console.resume();

    // Might want to grab fees again jic but hasn't error for me yet AFAIK
    const opts = {
      request: {
        exchange: exchangeAddress,
        fromAccountId: accountId,
        fromAddress: process.env["ETH_ACCOUNT_ADDRESS"],
        toAccountId: 0, // toAccountId is not required, input 0 as default
        toAddress: address,
        token: {
          tokenId: nft.tokenId,
          nftData: nft.nftData,
          amount: "1",
        },
        maxFee: {
          tokenId: fee.tokenId,
          amount: fee.fee,
        },
        storageId: offchainId,
        memo: memo,
        validUntil: Math.round(Date.now() / 1000) + 30 * 86400,
      },
      web3,
      chainId: parseInt(process.env["CHAIN_ID"], 10),
      walletType: sdk.ConnectorNames.Unknown,
      eddsaKey: eddsaKey.sk,
      apiKey,
    };

    console.mute();
    const { status, code, message } = await userAPI.submitNFTInTransfer(opts);
    console.resume();

    const res = { address, status };
    if (code) res.code = code;
    if (message) res.message = message;
    return res;
  };

  // primary transfer loop
  try {
    // check against past transactions or current holders to prevent duplicate sends
    let txs = await loadTxHistory(context);
    // Prompt user for required inputs
    let nft = await selectNFT();
    let addresses = await selectAddresses();

    // remove any addresses which are already holding, or are blacklisted
    let pending_holders = addresses.filter(
      (address) =>
        // has not been transfered
        !txs.find((tx) => tx.account === address && tx.nftId === nft.nftId) &&
        // is not blacklisted
        !blacklist.find((add) => add === address)
    );

    // flatten the array removing duplicate items
    let uniqueAddresses = [...new Set(pending_holders)];
    console.log(
      `ℹ️  ${uniqueAddresses.length} of ${
        addresses.length
      } transfers are pending. ${
        addresses.length - uniqueAddresses.length
      } have already been transferred.`
    );
    let fee = await selectFee(nft);

    // confirm transfers
    const goOn = new Confirm({
      name: "question",
      message: `Transfer to ${uniqueAddresses.length} accounts?`,
    });
    if (!(await goOn.run())) throw new Error("User cancelled");

    // Transfer nft to addresses
    var progressBar = new ProgressBar(
      "[AirDrop] Transferring...",
      uniqueAddresses.length
    );

    var results = [];
    for (i in uniqueAddresses) {
      // For every nft data (loopring id), make a call to the rest endpoint
      let address = uniqueAddresses[i];

      try {
        let transfer = await transferTokenToAddress(nft, address, fee);
        if (transfer.message) {
          console.warn("⚠️  " + transfer.message);
        }
        results.push(transfer);
        progressBar.updateProgress(i);
      } catch (error) {
        console.log(error);
      }
      await sleep(50);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  name: "📦  Air Drop - Distribute a token to a list of addresses",
  run: AirDrop,
};
