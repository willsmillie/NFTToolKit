const { getMints, getInfoForNFTDatas } = require("../utils/Requests");

// Fetches NFTs minted by the current account
const MyNFTs = async (context) => {
  const { apiKey, accountId } = context;

  // Fetch minted nfts and get their nftData
  const nfts = await getMints(apiKey, accountId);
  if (!nfts) return console.log("NO NFTS :(");
  let nftDatas = nfts.map((e) => e.nftData);

  // Load metadata info from the nftData and get nftIds
  let infos = await getInfoForNFTDatas(apiKey, nftDatas);

  return infos;
};

module.exports = {
  name: "🪙   My NFTs - Get a list of minted tokens",
  run: MyNFTs,
};
