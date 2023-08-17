// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFTCollection is ERC721Enumerable, Ownable {
    struct NFTMetadata {
        string name;
        string description;
        string image;
    }

    NFTMetadata[] public nfts;
    uint256 public maxQuantity = 5;
    uint256 public currentTokenId = 0;

    constructor() ERC721("MyNFTCollection", "MNC") {
        nfts.push(NFTMetadata('Starfish 1', 'In a pot', 'QmR4wTnnLk1vvZHeuTxWw36gr854vopW1Sko3mpnjwRMYQ'));
        nfts.push(NFTMetadata('Starfish 2', 'In a pot', 'QmNmP5DWh7XRrH3PRq5WhopfjaMTq9AKCW38UabyyPEjex'));
        nfts.push(NFTMetadata('Starfish 3', 'In a pot', 'QmakGhb1reAY7Uj3V44RzRvtCooyyxH6KJ7VXuSR3N1eoB'));
        nfts.push(NFTMetadata('Starfish 4', 'In a pot', 'QmcokD2gVJCqsS9dJ1Pf2vmcLbN1jBhLWrp7Yrj4R8X5KP'));
        nfts.push(NFTMetadata('Starfish 5', 'In a pot', 'QmcKqrbYprcw5N91WN77qgGhdHwYMp8j52SQn39E5oN75X'));
    }

    // Override the baseURI function to return the base URL for the NFTs (IPFS gateway)
    function _baseURI() internal pure override returns (string memory) {
        return "https://gateway.ipfs.io/ipfs/";
    }

    // Returns the prompt used to generate the images for the given NFT tokenId
    function promptDescription(uint256 tokenId) external view returns (string memory) {
        require(tokenId < nfts.length, "TokenId does not exist");
        return nfts[tokenId].description;
    }

    // Function to mint NFTs (Only contract owner can call this function)
    function mintNFT(uint256 quantity) external onlyOwner {
        require(currentTokenId + quantity <= maxQuantity, "Exceeds maximum token limit");
        for (uint256 i = 0; i < quantity; i++) {
            _mint(msg.sender, currentTokenId);
            currentTokenId++;
        }
    }
}

contract FxPortalBridge {
    event Deposit(address indexed from, address indexed to, uint256 tokenId, string data);

    function deposit(string calldata data, address to, uint256 tokenId) external {

        emit Deposit(msg.sender, to, tokenId, data);
    }
}
