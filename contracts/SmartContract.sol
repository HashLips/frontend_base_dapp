// SPDX-License-Identifier: GPL-3.0

/**
 
 *Luna Landers by LunaLand (LLN)
 *
 * 10,000 Lunalanders flying through the Metaverse.
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";


contract SmartContract is ERC721Enumerable, Ownable{
    uint public constant MAX_NFTS = 6666;
	bool public paused = true;
	string _baseTokenURI = "https://hlcb64ao3k.execute-api.us-east-2.amazonaws.com/";
	uint private price;

    constructor() ERC721("Oracle", "Oracle")  {

    }

    function mint(address _to, uint _count) public payable {
        require(!paused, "Pause");
        require(_count <= 20, "Exceeds 20");
        require(msg.value >= getPrice(_count), "Value below price");
        require(totalSupply() + _count <= MAX_NFTS, "Max limit");
        require(totalSupply() < MAX_NFTS, "Sale end");
        
        for(uint i = 0; i < _count; i++){
            _safeMint(_to, totalSupply());
        }
    }
    
    function getPrice(uint _count) public view returns (uint256) {
        return _count * price;
    }
    
    function setPrice(uint _price) external onlyOwner {
        price = _price;
    }
        
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function walletOfOwner(address _owner) external view returns(uint256[] memory) {
        uint tokenCount = balanceOf(_owner);
        uint256[] memory tokensId = new uint256[](tokenCount);
        for(uint i = 0; i < tokenCount; i++){
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }
    
    function pause(bool val) public onlyOwner {
        paused = val;
    }

    function withdrawAll() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }
    
}