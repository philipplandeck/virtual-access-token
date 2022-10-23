# Virtual Access Token
## Instructions
To deploy the contract, run
```
npx hardhat compile
npx hardhat --network goerli run scripts/deploy.js
```
To mint an NFT, run
```
node scripts/mint.js <contract address> ipfs://<CID of metadata>
```
