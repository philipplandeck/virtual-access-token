async function main() {
  const SportEvent = await ethers.getContractFactory("SportEvent");

  const contract = await SportEvent.deploy();
  await contract.deployed();

  const contractAddress = contract.address;
  console.log("Contract deployed to address:", contractAddress);

  // Log contact address to contracts/contracts.log
  const fs = require("fs");
  const path = require('path');
  const timestamp = new Date().toISOString().substr(0, 19).replace("T", " ");
  const logline = timestamp + "\t\t" + contractAddress + "\n";
  const filepath = path.join("contracts", "contracts.log");
  fs.appendFileSync(filepath, logline, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
