const { nftAPI, userAPI } = require("../web3");
const ora = require("ora");
const sleep = require("./sleep");
const ProgressBar = require("ora-progress-bar");

// Convenience for making the HTTP req header
const makeHeader = (apiKey) => {
  return {
    "X-API-KEY": apiKey,
  };
};

// Factory method to create a request, adding the header and converting the response to JSON
const makeRequest = async (url, key) => {
  return await fetch(encodeURI(url), {
    method: "GET",
    headers: makeHeader(key),
  })
    .then((res) => res.json())
    .catch(console.error);
};

// Resolves a loopring account Id to a wallet address
const getAccount = async (apiKey, accountId) => {
  let url = `https://api3.loopring.io/api/v3/account?accountId=${accountId}`;
  return await makeRequest(url, apiKey);
};

// GET created nfts by account id
const getMints = async (apiKey, accountId) => {
  const spinner = ora("[getMints] Fetching...").start();

  var results = [];
  var totalNum = 1;
  var error = null;
  var reqs = 0;

  while (results.length < totalNum) {
    var url = `https://api3.loopring.io/api/v3/user/nft/mints?accountId=${accountId}`;

    var lastResult = results[results.length - 1];
    if (lastResult) {
      let createdAt = lastResult.createdAt;
      url = url + `&end=${createdAt}`;
    }

    var res = await makeRequest(url, apiKey);
    if (res?.totalNum) totalNum = res.totalNum;
    if (res?.mints?.length === 0 || res?.mints == undefined) break;

    results.push(...(res?.mints ?? []));
    reqs++;
    sleep(250);
  }

  results && !error
    ? spinner.succeed(`[getMints] Fetched ${results.length} minted NFTs!\n`)
    : spinner.fail(`[getMints] Failed to fetch NFTs:!\n${error ?? ""}`);
  spinner.stop();

  return results;
};

// GET NFT Datas by minter, tokenAddress, and NFT Id
const getNFTData = async (apiKey, minter, tokenAddress, nftId) => {
  let url = `https://api3.loopring.io/api/v3/nft/info/nftData?minter=${minter}&tokenAddress=${tokenAddress}&nftId=${nftId}`;
  return await makeRequest(url, apiKey).then((r) => r ?? []);
};

// GET Holders for NFT Data
const nftHolders = async (apiKey, nftData) => {
  let url = `https://api3.loopring.io/api/v3/nft/info/nftHolders?nftData=${nftData}`;
  return await makeRequest(url, apiKey).then((e) => e.nftHolders);
};

// Get info token info
const getInfoForNFTDatas = async (apiKey, nftDatas) => {
  const spinner = ora("[getNftInfos] Fetching...").start();

  var results = [];
  var error = null;
  var offset = 0;

  while (results.length < nftDatas.length) {
    var batch = [];

    for (var i = 0; i < 25; i++) {
      let element = nftDatas[offset + i];
      if (element === null || element === undefined) break;
      batch.push(element);
    }

    let url = `https://api3.loopring.io/api/v3/nft/info/nfts?nftDatas=${batch}`;
    let response = await makeRequest(url, apiKey).catch((e) => (error = e));
    if (response.size == 0 || response == null) break;
    results = [...results, ...response];
    offset += 25;
    sleep(250);
  }

  results && !error
    ? spinner.succeed(
        `[getNftInfos] Fetched ${Object.keys(results).length} infos for tokens!`
      )[getMints]
    : spinner.fail(`[getNftInfos] Failed: ${error ?? ""}`);
  spinner.stop();

  return results;
};

// Gets the metadata from the pinned IPFS cid via a https gateway
const getMetadataForNFTIds = async (nftIds) => {
  if (!nftIds) return;
  let uniqueIds = new Set([...nftIds]);

  const spinner = ora("[getMetadata] Fetching...").start();

  var results = {};

  for (i in nftIds) {
    let id = nftIds[i];
    spinner.text = `[getMetadata] Fetching... ${i}/${nftIds.length}`;

    let cid = nftAPI.ipfsNftIDToCid(id);
    var res = await fetch(`https://gateway.ipfs.io/ipfs/${cid}`)
      .then((r) => {
        let json = r.json();
        if (json) return json;
        console.log(r);
      })
      .catch((e) => {
        spinner.warn(`Failed to fetch IPFS cid (${cid}) for token: ${id}`);
      });

    if (res) {
      results[id] = res;
    }

    sleep(250);
  }

  results
    ? spinner.succeed(
        `[getMetadata] Fetched ${Object.keys(results).length} metadatas tokens!`
      )
    : spinner.fail(`[getMetadata] Failed while fetching token metadata`);
  spinner.stop();

  return results;
};

module.exports = {
  nftHolders,
  getAccount,
  getNFTData,
  getMints,
  getMetadataForNFTIds,
  getInfoForNFTDatas,
};
