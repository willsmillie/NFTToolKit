const { walletAPI } = require("../web3");

const resolveENS = async (domain) =>
  domain.endsWith(".eth")
    ? (
        await walletAPI.getAddressByENS({
          fullName: domain,
        })
      ).address
    : domain;

module.exports = resolveENS;
