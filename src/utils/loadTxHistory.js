const sleep = require("./sleep");
const ora = require("ora"); // spinner for async requests
const ProgressBar = require("ora-progress-bar");

const {
  walletAPI,
  nftAPI,
  userAPI,
  authenticate,
  exchangeAPI,
  web3,
  sdk,
} = require("../web3");

// retrieve the users transaction history to processes past transactions
const loadTxHistory = async (context) => {
  const { apiKey, accountId, eddsaKey, exchangeAddress } = context;
  var totalNum = null;
  var results = [];
  var exit = false;

  // retrieve the NFTs transfer history
  var now = Date.now();
  var before = new Date();
  let numberOfDays = 7;
  before = before.setDate(before.getDate() - numberOfDays);

  // Transfer nft to addresses
  const progressBar = new ProgressBar(
    "[getTxHistory] Getting transaction history...",
    0
  );

  while (totalNum == null || results.length < totalNum) {
    const historyRes = await userAPI.getUserNFTTransactionHistory(
      {
        accountId: accountId,
        start: before,
        end: now,
        offset: results.length,
        types: [sdk.UserNFTTxTypes.TRANSFER],
      },
      apiKey
    );

    if (!totalNum) {
      totalNum = historyRes.totalNum;
      progressBar.updateGoal(totalNum);
    }

    progressBar.progress(historyRes.userNFTTxs.length);
    results = results.concat(historyRes.userNFTTxs).sort((x, y) => {
      return new Date(x.timestamp) < new Date(y.timestamp) ? 1 : -1;
    });

    await sleep(250);
  }

  return results.map((i) => {
    return {
      id: i.id,
      account: i.receiverAddress,
      nftId: i.nftStatusInfo.nftId,
      timestamp: i.timestamp,
    };
  });
};

module.exports = loadTxHistory;
