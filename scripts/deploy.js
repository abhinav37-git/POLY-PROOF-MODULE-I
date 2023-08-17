const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  const NFTCollection = await ethers.getContractFactory("MyNFTCollection");
  const nft = await NFTCollection.deploy();
  await nft.deployed();

  console.log("NFT contract deployed to:", nft.address);

  fs.writeFileSync('metadata/contractAddress.js', `export const nftAddress = "${nft.address}" `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
