# virtual-access-token
Prototype of Virtual Access Token
## Preconditions
TBD
## How to use?
To deploy the contract, run
```
npx hardhat compile
npx hardhat --network goerli run scripts/deploy.js
```
To mint the NFT, run
```
node scripts/mint.js <contract address> ipfs://<CID of metadata>
```
Note that the metadata should be changed for each minted NFT, otherwise same NFTs with different IDs will be created.
