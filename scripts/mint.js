// Based on https://ethereum.org/en/developers/tutorials/how-to-mint-an-nft/
require("dotenv").config();
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

const argv = process.argv.slice(2);
const contractAddress = argv[0];
const metadata = argv[1];

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/SportEvent.sol/SportEvent.json");
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function assignTicket(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");

  const transaction = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.assignTicket(PUBLIC_KEY, tokenURI).encodeABI(),
  };

  web3.eth.accounts
    .signTransaction(transaction, PRIVATE_KEY)
    .then((signedTransaction) => {
      web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is:",
              hash,
              "\nCheck https://dashboard.alchemy.com/mempool to view the status of your transaction!",
              "\nView your transaction on Etherscan: https://goerli.etherscan.io/tx/" +
                hash
            );
          } else {
            console.log("Transaction could not be submitted:", err);
          }
        }
      );
    })
    .catch((err) => {
      console.log("Ticket assignment failed:", err);
    });
}

assignTicket(metadata);
