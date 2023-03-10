const { nftAPI, userAPI } = require("../web3");
const {
  getMetadataForNFTIds,
  getMints,
  getInfoForNFTDatas,
} = require("../utils/Requests");
const { sleep } = require("../utils");
const fs = require("fs");

// Fetches NFTs minted by the current account
const MyNFTs = async (context) => {
  const { apiKey, accountId } = context;

  // Fetch minted nfts and get their nftData
  const nfts = await getMints(apiKey, accountId);
  if (!nfts) return console.log("NO NFTS :(");
  let nftDatas = nfts.map((e) => e.nftData);

  // Load metadata info from the nftData and get nftIds
  let infos = await getInfoForNFTDatas(apiKey, nftDatas);
  let nftIds = infos.map((e) => e.nftId);

  // Fetch metadata and assemble the results into the metadata
  var metadata = await getMetadataForNFTIds(nftIds);
  for (nftId in metadata) {
    let meta = metadata[nftId];
    let info = infos.find((e) => e.nftId === nftId);
    let nft = nfts.find((e) => e.nftData === info.nftData);

    metadata[nftId] = { ...meta, ...info, ...nft };
  }

  return metadata;
};

module.exports = {
  name: "🪙   My NFTs - Get a list of minted tokens",
  run: MyNFTs,
};
