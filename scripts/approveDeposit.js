const { ethers } = require("hardhat");
const fxRootContractABI = require("../artifacts/contracts/MyNFTCollection.sol/FxPortalBridge.json"); // Update the path accordingly
const tokenContractJSON = require("../artifacts/contracts/MyNFTCollection.sol/MyNFTCollection.json"); // Update the path accordingly
require("dotenv").config();

const tokenAddress = "0xD287B7f2EC64125db87F6F939AE1eCCDbbA74e9F"; // Update with the actual ERC721A contract address
const tokenABI = tokenContractJSON.abi;
const fxERC20RootAddress = "0xF9bc4a80464E48369303196645e876c8C7D972de"; // Update with the actual FXRoot contract address

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://ethereum-goerli.publicnode.com"); // Update the network URL
  const privateKey = process.env.PRIVATE_KEY;

  const wallet = new ethers.Wallet(privateKey, provider);
  const [signer] = await ethers.getSigners();

  const NFT = await ethers.getContractFactory("MyNFTCollection");
  const nft = await NFT.attach(tokenAddress);

  const fxRoot = await ethers.getContractAt(fxRootContractABI, fxERC20RootAddress);

  const tokenIds = [0, 1, 2, 3];

  const approveTx = await nft.connect(signer).setApprovalForAll(fxERC20RootAddress, true);
  await approveTx.wait();
  console.log("Approval confirmed");

  for (let i = 0; i < tokenIds.length; i++) {
    try {
      const depositTx = await fxRoot
        .connect(signer)
        .deposit(nft.address, wallet.address, tokenIds[i], "0x6566");

      await depositTx.wait();
      console.log(`Deposited token ${tokenIds[i]}`);
    } catch (error) {
      console.error(`Error depositing token ${tokenIds[i]}:`, error);
    }
  }

  console.log("Approved and deposited");

  const balance = await nft.balanceOf(wallet.address);

  console.log(
    "Balance",
    wallet.address,
    "is: ",
    balance.toString()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });