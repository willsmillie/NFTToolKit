const { walletAPI } = require("../web3");

const resolveENS = async (domain) =>
  domain.toLowerCase().endsWith(".eth")
    ? (
        await walletAPI.getAddressByENS({
          fullName: domain.toLowerCase(),
        })
      ).address
    : domain;

module.exports = resolveENS;
