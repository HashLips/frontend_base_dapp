// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmartContract is ERC721, Ownable {
  using Counters for Counters.Counter;
  using Strings for uint256;
  Counters.Counter private _tokenIds;
  mapping(uint256 => string) private _tokenURIs;

  struct RenderToken {
    uint256 id;
    string uri;
  }

  constructor() ERC721("Smart Contract", "SC") {}

  function _setTokenURI(uint256 tokenId, string memory _tokenURI)
    internal
    virtual
  {
    _tokenURIs[tokenId] = _tokenURI;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );
    string memory _tokenURI = _tokenURIs[tokenId];
    return _tokenURI;
  }

  function getAllTokens() public view returns (RenderToken[] memory) {
    uint256 latestTokenCount = _tokenIds.current();
    uint256 counter = 0;
    RenderToken[] memory result = new RenderToken[](latestTokenCount);
    for (uint256 i = 0; i < latestTokenCount; i++) {
      if (_exists(counter)) {
        string memory uri = tokenURI(counter);
        result[counter] = RenderToken(counter, uri);
      }
      counter++;
    }
    return result;
  }

  function mint(address recipient, string memory uri) public returns (uint256) {
    uint256 newItemId = _tokenIds.current();
    _mint(recipient, newItemId);
    _setTokenURI(newItemId, uri);
    _tokenIds.increment();
    return newItemId;
  }
}
