const { nftAPI, userAPI } = require("../web3");

export default (async ({ apiKey, accountId }) => {
  // fetch nft apis
  const { userNFTBalances } = await userAPI.getUserNFTBalances(
    { accountId: accountId, limit: 1000 },
    apiKey
  );

  // Prompt user to select an NFT
  const nftOptions = new Select({
    name: "id",
    message: "Select an nft (by nftId)",
    choices: userNFTBalances.map((nft) => nft.nftId),
  });

  const selectedId = await nftOptions.run();
  const selected = userNFTBalances.find((nft) => nft.nftId === selectedId);
  return selected;
})();
