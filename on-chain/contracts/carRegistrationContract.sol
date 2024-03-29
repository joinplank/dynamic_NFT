
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721URIStorage_extended.sol";

contract carRegistrationContract is ERC721URIStorage_extended,Ownable{
  using Counters for Counters.Counter;

  Counters.Counter private tokenId;
  mapping(uint256 => address) public _allowedManteninance;

  struct TransferStruct{
    address buyer;
    uint256 price;
    bool paid;
  }

  mapping(uint256 => TransferStruct) public _tranferIntentions;

  uint8 public fee;

  constructor(uint8 _fee) ERC721("AutomotiveRegistrationAgency", "ARA"){
    fee = _fee;
  }

  function mintNFT(address _owner, string memory _tokenURI, address _manteinanceAgency) public onlyOwner returns (uint256){
    tokenId.increment();
    uint256 newId = tokenId.current();
    _mint(_owner, newId);
    _setTokenURI(newId, _tokenURI);
    _allowedManteninance[newId] = _manteinanceAgency;
    return newId;
  }

  function setAllowedManteinance(uint256 _tokenId, address _allowed) external onlyOwner{
      require(_exists(_tokenId), "URI query for nonexistent token");
      _allowedManteninance[_tokenId] = _allowed;
    }


    function setFee(uint8 _newFee) external onlyOwner{
      require(_newFee >= 0 && _newFee <= 100, "Invaid fee value");
      fee = _newFee;
    }

  //I defined 3 types of URIs and I assign an identification number for each.
  //I dont like "maggic numbers" but as far as I know there is not a #define macro
  //in solidity and, on the other hand, to declare const global variable
  //would implicate gas consumition.
  //URIType 0 -> tokenURI
  //URIType 1 -> _tokenURI_maintenances


  function setURIManteinance(uint256 _tokenId, string memory _tokenURI) external {
    require(_exists(_tokenId), "URI query for nonexistent token");
    require(msg.sender == _allowedManteninance[_tokenId] || msg.sender == owner());
    _setTokenURI(_tokenId, _tokenURI, 1);

  }


  function setURI(uint256 _tokenId, string memory _tokenURI) external onlyOwner{
    require(_exists(_tokenId), "URI query for nonexistent token");
    _setTokenURI(_tokenId, _tokenURI, 0);
  }


//TRANSFER INTENTION FUNTIONS

  function tranferIntention(uint256 _tokenId, address _buyer, uint256 _price) external{
    require(_exists(_tokenId), "Tranfer intention for nonexistent token");
    require(ownerOf(_tokenId) == msg.sender, "Not the owner of the car");

    _tranferIntentions[_tokenId] = TransferStruct(_buyer,_price, false);
  }

  function deleteTranferIntention(uint256 _tokenId) external{
    require(_exists(_tokenId), "Tranfer intention for nonexistent token");
    require( (msg.sender == owner()) || (ownerOf(_tokenId) == msg.sender), "Not the owner of the car");

    delete _tranferIntentions[_tokenId];
  }

  function payTranfer(uint256 _tokenId) external payable{
    require(_exists(_tokenId), "Nonexistent token");
    require(_tranferIntentions[_tokenId].buyer != address(0), "No tranfer intention for this car");
    require(_tranferIntentions[_tokenId].buyer == msg.sender, "No tranfer intention for the sender");
    require(msg.value == _tranferIntentions[_tokenId].price, "Not the accorded price");

    _tranferIntentions[_tokenId].paid = true;
  }

  function carTransfer(uint256 _tokenId) external{
    require(_exists(_tokenId), "Nonexistent token");
    require(_tranferIntentions[_tokenId].paid, "Not paid!");
    require(ownerOf(_tokenId) == msg.sender);
    //Possible vulnerability, please check!

    payable(ownerOf(_tokenId)).transfer(_tranferIntentions[_tokenId].price - (_tranferIntentions[_tokenId].price * 2 / 100));
    transferFrom(msg.sender, _tranferIntentions[_tokenId].buyer, _tokenId);

    delete _tranferIntentions[_tokenId];
  }


}
