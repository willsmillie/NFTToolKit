export default (async () => {
  // fetch nft apis
  const { userNFTBalances } = await userAPI.getUserNFTBalances(
    { accountId: accountId, limit: 20 },
    apiKey
  );
  debug("userNFTBalances:", userNFTBalances);

  const nftOptions = new Select({
    name: "id",
    message: "Pick an nft",
    choices: userNFTBalances.map((nft) => nft.nftId),
  });

  const selectedId = await nftOptions.run();
  debug("selectedId:", selectedId);

  const selected = userNFTBalances.find((nft) => nft.nftId === selectedId);
  debug("selected", selected);
})();
