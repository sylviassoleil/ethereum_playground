// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract StoreHash {
    string ipfsHash;

    /*constructor(string memory x) {
      console.log("Deploying a hash", x);
      ipfsHash = x;
    }*/

    function getHash() public view returns (string memory) {
      return ipfsHash;
    }

    function sendHash(string memory x) public {
      ipfsHash = x;
    }


}