// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SmartContract {
  constructor(string memory _name, string memory _symbol) {
    name = _name;
    symbol = _symbol;
  }

  string public name;
  string public symbol;

  function updateName(string memory _name) public {
    name = _name;
  }
}
