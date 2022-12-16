const { userAPI, authenticate } = require("../web3");

const MyNFTs = async () => {
  const { accountId, apiKey } = await authenticate();
  const { userNFTBalances } = await userAPI.getUserNFTBalances(
    { accountId: accountId, limit: 10000 },
    apiKey
  );

  console.log(userNFTBalances);

  return userNFTBalances.map((e) => e.nftId);
};

module.exports = {
  name: "🧧 My NFTs - Fetches a list of currently held tokenIds",
  run: MyNFTs,
};
