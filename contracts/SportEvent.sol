// Based on https://docs.openzeppelin.com/contracts/3.x/erc721
// contracts/SportEvent.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// Access Control based on https://docs.openzeppelin.com/contracts/3.x/access-control
import "@openzeppelin/contracts/access/Ownable.sol";
// Import ERC721URIStorage.sol because the function _setTokenURI() was removed in pragma 0.8.0
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SportEvent is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("SportEvent", "SET") {}

    function assignTicket(address purchaser, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        require(_tokenIds.current() < 15000);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(purchaser, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
