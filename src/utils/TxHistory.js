// retreive the users transaction history
export default const loadTxHistory = async () => {
  var totalNum = null;
  var results = [];
  var exit = false;

  // retreives the NFTs transfer history
  var now = Date.now();
  var yesterday = new Date();
  yesterday = yesterday.setDate(yesterday.getDate() - 7);

  while (totalNum == null || results.length < totalNum) {
    const historyRes = await userAPI.getUserNFTTransactionHistory(
      {
        accountId: accountId,
        start: yesterday,
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
