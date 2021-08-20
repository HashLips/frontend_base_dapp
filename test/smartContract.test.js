const SmartContract = artifacts.require("./SmartContract.sol");

require("chai").use(require("chai-as-promised")).should();

contract("SmartContract", (accounts) => {
  let smartContract;

  before(async () => {
    smartContract = await SmartContract.deployed();
  });

  describe("smartContract deployment", async () => {
    it("deploys successfully", async () => {
      const address = await smartContract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has correct name", async () => {
      const name = await smartContract.name();
      assert.equal(name, "Smart Contract");
    });
  });

  describe("smartContract minting", async () => {
    it("minted successfully", async () => {
      const uri = "https://metadata";
      await smartContract.mint(accounts[0], uri);
      const tokenUri = await smartContract.tokenURI(0);
      const balanceOfOwner = await smartContract.balanceOf(accounts[0]);
      assert.equal(tokenUri, uri);
      assert.equal(balanceOfOwner, 1);
    });
  });
});
