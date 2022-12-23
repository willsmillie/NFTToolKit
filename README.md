# NFT Tool Kit

Utils for interacting & interacting with Loopring & Gamestop marketplace NFT platforms.
This project was been forked from https://github.com/tomfuertes/loopring-sdk-bulk-send, thanks Tom!

`npm start` will prompt the following questions:

- `📦  Air Drop - Distribute a token to a list of addresses`
- `🪙   My NFTs - Get a list of minted tokens`
- `🔎  NFT Lookup - Get metadata for NFTs by id`
- `🧩  Token Holders - Look up current holders for a list of tokenIds`
- `👾  ENS Resolver - Get addresses for a list of ENS domains`

## Installation, Config, and Running

Requires a free https://infura.io/ account.

```
# Clone the repo
git clone https://github.com/willsmillie/nfttoolkit.git;

# cd into it and install dependencies
cd nfttoolkit;
npm install;

# create an env file
cp .env.example .env

### DISCLAIMER ###
# L2 accounts are "cheap" to create. I'd suggest creating a new one
# since this program requires you copy your private
# key out of your wallet / metamask / etc...
# Loose steps to do so:
# - a) create a new MetaMask/Gamestop Wallet Account
# - b) Transfer $50 to that account on L2 + Pay the activation fee
# - c) Mint from your primary account / transfer all to your bulk account
# - d) Run the program on your bulk account in case you accidentally expose your keys once copied out

# TODO: Edit .env with your private key, eth address, and infura project

npm start
```

## FAQ

- Only tested w/ a Metamask / Gamestop wallet Private Key
- "IsMobile any Navigator is undefined" is a message from the Loopring SDK running on node / not an issue.
- `status: processing` means success as far as I can tell
- if `code: undefined` or `message: undefined` do not show and instead show something else, it's likely an error and did not send
- The `Select NFT by ID` question can be found at the top of an explorer page (e.g., `0x32f006a901505c8c015714cc4390f7f5447c1b07983b050c9cd92da90777584c` for [this NFT](https://explorer.loopring.io/nft/0xb6a1df588d2cb521030a5269d42a9c34f1ecaeab-0-0x92f7c57650b6dae91b8a8d73b1fb90f70b39358e-0x32f006a901505c8c015714cc4390f7f5447c1b07983b050c9cd92da90777584c-10))

## Contributions

PRs are welcome! There are some todos below if you are interested in ways to help!

## TODO

- Add Tests
- Loop CLI so it doesn't exit
- Add better env / context to prevent passing keys arround
- Refactor / clean code
