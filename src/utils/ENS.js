const resolveENS = async (domain) =>
  domain.endsWith(".eth")
    ? (
        await walletAPI.getAddressByENS({
          fullName: domain,
        })
      ).address
    : domain;
