const blacklist = [
  `${process.env["ETH_ACCOUNT_ADDRESS"]}`, // prevent sending nfts to your own wallet
  // BURN ADDRESSES
  "0x000000000000000000000000000000000000dEaD", // prevent sending nfts to burn addresses
];

module.exports = blacklist;
