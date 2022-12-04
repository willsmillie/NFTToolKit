const { Select, Confirm } = require("enquirer");
const sdk = require("@loopring-web/loopring-sdk");
const fs = require("fs");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SendNFTs = async () => {
  console.log("Sending NFTs...");
  //   var transfer_results = [];
  // var completedTransfers = [];
  // const shouldSkip = (address) => completedTransfers.includes(address);
  // let memo = "Sent w/ https://github.com/tomfuertes/loopring-sdk-bulk-send";

  // const exchangeAPI = new sdk.ExchangeAPI({ chainId: CHAIN_ID });
  // const userAPI = new sdk.UserAPI({ chainId: CHAIN_ID });
  // const walletAPI = new sdk.WalletAPI({ chainId: CHAIN_ID });

  // try {
  //   debug("Fetching tranfer history (to avoid sending duplicates)");
  //   // check against past transaction
  //   const txs = await loadTxHistory();
  //   completedTransfers = [
  //     ...new Set(
  //       txs.filter((tx) => tx.nftId === selectedId).map((tx) => tx.account)
  //     ),
  //   ];
  //   const pendingTransfers = accounts.filter(
  //     (a) => !completedTransfers.includes(a)
  //   );

  //   const selectedFeeKey = await feeOptions.run();
  //   debug("selectedFeeKey:", selectedFeeKey);
  //   const selectedFee = fees[selectedFeeKey];

  //   const goOn = new Confirm({
  //     name: "question",
  //     message: `Transfer to ${
  //       pendingTransfers.length
  //     } accounts? ${JSON.stringify(pendingTransfers)}`,
  //   });

  //   if (!(await goOn.run())) {
  //     throw new Error("User cancelled");
  //   }

  //   for (const item of pendingTransfers) {
  //     const address = await resolveENS(item.toLowerCase());

  //     if (!address) {
  //       console.error(`${item} ENS not found`);
  //       continue;
  //     }

  //     let completedTransaction = shouldSkip(address);
  //     if (completedTransaction) {
  //       console.info(`Skipping ${address}: a transaction already exists`);
  //       continue;
  //     }

  //     // get storage id for sending
  //     const { offchainId } = await userAPI.getNextStorageId(
  //       { accountId: accountId, sellTokenId: selected.tokenId },
  //       apiKey
  //     );

  //     // Might want to grab fees again jic but hasn't error for me yet AFAIK
  //     const opts = {
  //       request: {
  //         exchange: exchangeAddress,
  //         fromAccountId: accountId,
  //         fromAddress: ETH_ACCOUNT_ADDRESS,
  //         toAccountId: 0, // toAccountId is not required, input 0 as default
  //         toAddress: address,
  //         token: {
  //           tokenId: selected.tokenId,
  //           nftData: selected.nftData,
  //           amount: "1",
  //         },
  //         maxFee: {
  //           tokenId: selectedFee.tokenId,
  //           amount: selectedFee.fee,
  //         },
  //         storageId: offchainId,
  //         memo: memo,
  //         validUntil: Math.round(Date.now() / 1000) + 30 * 86400,
  //       },
  //       web3,
  //       chainId: parseInt(CHAIN_ID, 10),
  //       walletType: sdk.ConnectorNames.Unknown,
  //       eddsaKey: eddsaKey.sk,
  //       apiKey,
  //     };

  //     const transferResult = await userAPI.submitNFTInTransfer(opts);
  //     const { status, code, message } = transferResult;
  //     debug("transferResult", transferResult);

  //     const res = { address, status };
  //     if (code) res.code = code;
  //     if (message) res.message = message;

  //     transfer_results.push(res);

  //     await sleep(250);
  //   }
};

module.exports = { name: "Send NFTs", run: SendNFTs };
