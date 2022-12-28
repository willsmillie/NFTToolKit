export default (async () => {
  // get fees to make sure we can afford this
  const { fees } = await userAPI.getNFTOffchainFeeAmt(
    {
      accountId: accountId,
      requestType: sdk.OffchainNFTFeeReqType.NFT_TRANSFER,
      tokenAddress: selected.tokenAddress,
    },
    apiKey
  );

  const USD_COST = parseInt((fees["USDC"] || fees["USDT"]).fee, 10) / 1e6;
  console.log(USD_COST);

  const feeOptions = new Select({
    name: "color",
    message: `Pick a fee option USD ~$${USD_COST}`,
    choices: Object.entries(fees)
      .filter(([k]) => /ETH|LRC/.test(k))
      .map(([k]) => k),
  });
})();
