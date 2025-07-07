
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ShrineNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => string) public nftType;
    mapping(uint256 => string) public rarity;
    mapping(uint256 => uint256) public power;
    mapping(address => uint256) public culturalCapital;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string nftType, string rarity);
    event CulturalCapitalEarned(address indexed user, uint256 amount);

    constructor() ERC721("ShrineNFT", "SNFT") {}

    function mintNFT(
        address to,
        string memory uri,
        string memory _nftType,
        string memory _rarity,
        uint256 _power
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        nftType[tokenId] = _nftType;
        rarity[tokenId] = _rarity;
        power[tokenId] = _power;
        
        emit NFTMinted(to, tokenId, _nftType, _rarity);
        return tokenId;
    }

    function earnCulturalCapital(address user, uint256 amount) public onlyOwner {
        culturalCapital[user] += amount;
        emit CulturalCapitalEarned(user, amount);
    }

    function getUserNFTs(address user) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (_exists(i) && ownerOf(i) == user) {
                tokenIds[index] = i;
                index++;
            }
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
