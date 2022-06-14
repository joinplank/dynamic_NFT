// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC721/extensions/ERC721URIStorage.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @dev ERC721 token with storage based token URI management.
 */
abstract contract ERC721URIStorage_extended is ERC721URIStorage {


    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURI_maintenances;
    mapping(uint256 => string) private _tokenURI_incidents;

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId, uint8 URIType) public view virtual returns (string memory) {
        //URIType 0 -> tokenURI
        //URIType 1 -> _tokenURI_maintenances
        //URIType 2 -> _tokenURI_incidents


        require(_exists(tokenId), "ERC721URIStorage_extended: URI query for nonexistent token");
        require(URIType == 0 || URIType == 1 || URIType == 2, "ERC721URIStorage_extended: Invalid URI Type");

        string memory _tokenURI;

        if(URIType == 0) return super.tokenURI(tokenId);
        if(URIType == 1) _tokenURI = _tokenURI_maintenances[tokenId];
        if(URIType == 2) _tokenURI = _tokenURI_incidents[tokenId];

        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI, uint8 URIType) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        require(URIType == 0 || URIType == 1 || URIType == 2, "ERC721URIStorage_extended: Invalid URI Type");


        if(URIType == 0) super._setTokenURI(tokenId, _tokenURI);
        if(URIType == 1) _tokenURI_maintenances[tokenId] = _tokenURI;
        if(URIType == 2) _tokenURI_incidents[tokenId] = _tokenURI;


    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokenURI_maintenances[tokenId]).length != 0) {
            delete _tokenURI_maintenances[tokenId];
        }

        if (bytes(_tokenURI_incidents[tokenId]).length != 0) {
            delete _tokenURI_incidents[tokenId];
        }


    }
}
