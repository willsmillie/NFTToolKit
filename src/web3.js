const PrivateKeyProvider = require("truffle-privatekey-provider");
const Web3 = require("web3");
const sdk = require("@loopring-web/loopring-sdk");
const { debug } = require("./utils/Debug");

// setup dot env
require("dotenv").config();

// Env vars
const {
  INFURA_PROJECT_ID,
  ETH_ACCOUNT_PRIVATE_KEY,
  ETH_ACCOUNT_ADDRESS,
  CHAIN_ID,
  VERBOSE,
} = (function () {
  const { env } = process;
  return {
    ...env,
    CHAIN_ID: parseInt(env.CHAIN_ID),
    VERBOSE: /^\s*(true|1|on)\s*$/i.test(env.VERBOSE),
  };
})();

console.log(CHAIN_ID);

// initialize provider
const provider = new PrivateKeyProvider(
  ETH_ACCOUNT_PRIVATE_KEY,
  `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`
);

const web3 = new Web3(provider);
const exchangeAPI = new sdk.ExchangeAPI({ chainId: CHAIN_ID });
const userAPI = new sdk.UserAPI({ chainId: CHAIN_ID });
const walletAPI = new sdk.WalletAPI({ chainId: CHAIN_ID });

const signatureKeyPairMock = async (accInfo, exchangeAddress) => {
  const keySeed =
    accInfo.keySeed ||
    sdk.GlobalAPI.KEY_MESSAGE.replace(
      "${exchangeAddress}",
      exchangeAddress
    ).replace("${nonce}", (accInfo.nonce - 1).toString());
  const eddsaKey = await sdk.generateKeyPair({
    web3,
    address: accInfo.owner,
    keySeed,
    walletType: sdk.ConnectorNames.Unknown,
    chainId: parseInt(CHAIN_ID, 10),
  });
  return eddsaKey;
};

const authenticate = async () => {
  try {
    // get info from chain / init of LoopringAPI contains process.env.CHAIN_ID
    const { exchangeInfo } = await exchangeAPI.getExchangeInfo();
    debug(exchangeInfo);
    // exchange address can change over time
    const { exchangeAddress } = exchangeInfo;
    debug("exchangeInfo", exchangeAddress);

    // Get the accountId and other metadata needed for sig
    debug("ETH_ACCOUNT_ADDRESS", ETH_ACCOUNT_ADDRESS);
    const { accInfo } = await exchangeAPI.getAccount({
      owner: ETH_ACCOUNT_ADDRESS,
    });
    debug("accInfo", accInfo);
    const { accountId } = accInfo;
    debug("accountId", accountId);

    // Auth to API via signature
    const eddsaKey = await signatureKeyPairMock(accInfo, exchangeAddress);
    const { apiKey } = await userAPI.getUserApiKey({ accountId }, eddsaKey.sk);
    if (/5/.test(CHAIN_ID)) {
      debug("auth:", { eddsaKey, apiKey });
    }

    return { ...accInfo, apiKey };
  } catch (error) {
    console.error(error);
    return;
  }
};

module.exports = { web3, exchangeAPI, userAPI, walletAPI, authenticate };
