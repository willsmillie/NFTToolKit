// retrieve the users transaction history to processes past transactions
export default const loadTxHistory = async ({apiKey}) => {
  var totalNum = null;
  var results = [];
  var exit = false;
  
  // retrieve the NFTs transfer history
  var now = Date.now();
  var before = new Date();
  let numberOfDays = 7
  before = before.setDate(before.getDate() - numberOfDays);

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
    }

    results = results.concat(historyRes.userNFTTxs).sort((x, y) => {
      return new Date(x.timestamp) < new Date(y.timestamp) ? 1 : -1;
    });

    await sleep(250);
  }

  console.log(`✅ ${results.length} transfers were fetched.`);

  return results.map((i) => {
    return {
      id: i.id,
      account: i.receiverAddress,
      nftId: i.nftStatusInfo.nftId,
      timestamp: i.timestamp,
    };
  });
};
