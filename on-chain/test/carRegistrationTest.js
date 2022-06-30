const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const data = require("../build/contracts/carRegistrationContract.json");
const interface = data.abi;
const bytecode = data.bytecode;

const URIGeneral = 0;
const URIManteinance = 1;

let contract;

let accounts;
const tokenURI = "ThisIsADummyTokenURI";
let manteinanceAgency;
let TX;
let tokenId;

const fee = 2;

//account[0] -> owner Contract
//account[1] -> owner NFT
//account[2] -> Manteinance Agency
//account[3] -> Another Manteinance Agency
//account[4] -> buyer

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  manteinanceAgency = accounts[2];

  contract = await new web3.eth.Contract(JSON.parse(JSON.stringify(interface)))
    .deploy({ data: bytecode, arguments: [fee] })
    .send({ from: accounts[0], gas: "5000000" });

  const TX = await contract.methods
    .mintNFT(accounts[1], tokenURI, manteinanceAgency)
    .send({ from: accounts[0], gas: "5000000" });

  tokenId = TX.events.Transfer.returnValues["tokenId"];
});

describe("Car Registration Contract - Unit Testing:", () => {
  it("Deploys a contract", () => {
    assert.ok(contract.options.address);
  });

  it("Mints an NFT", async () => {
    assert.equal(tokenId, 1);
  });

  it("Only contract owner can mint an NFT", async () => {
    try {
      const TX = await contract.methods
        .mintNFT(accounts[1], tokenURI, manteinanceAgency)
        .send({ from: accounts[1], gas: "5000000" });
    } catch (err) {
      return;
    }
    assert(false);
  });

  it("Stores URI", async () => {
    let mintedTokenId = await contract.methods
      .tokenURI(tokenId, 0)
      .call({ from: accounts[0] });

    assert.equal(mintedTokenId, tokenURI);
  });

  it("Stores allowed manteinance address", async () => {
    let mintedMannteinanceAddress = await contract.methods
      ._allowedManteninance(tokenId)
      .call({ from: accounts[0] });

    assert.equal(mintedMannteinanceAddress, manteinanceAgency);
  });

  it("Let set allowed manteinance address", async () => {
    await contract.methods
      .setAllowedManteinance(tokenId, accounts[3])
      .send({ from: accounts[0] });

    let mintedMannteinanceAddress = await contract.methods
      ._allowedManteninance(tokenId)
      .call({ from: accounts[0] });

    assert.equal(mintedMannteinanceAddress, accounts[3]);
  });

  it("Contract Owner can set manteinance URI", async () => {
    const manteinanceURI = "ThisIsADummyManteinanceURI";

    await contract.methods
      .setURIManteinance(tokenId, manteinanceURI)
      .send({ from: accounts[0] });

    let manteinanceURIReaded = await contract.methods
      ._tokenURI_maintenances(tokenId)
      .call({ from: accounts[0] });

    assert.equal(manteinanceURI, manteinanceURI);
  });

  it("Allowed agency can set manteinance URI", async () => {
    const manteinanceURI = "ThisIsADummyManteinanceURI";

    await contract.methods
      .setURIManteinance(tokenId, manteinanceURI)
      .send({ from: accounts[2] });

    let manteinanceURIReaded = await contract.methods
      ._tokenURI_maintenances(tokenId)
      .call({ from: accounts[0] });

    assert.equal(manteinanceURI, manteinanceURI);
  });

  it("Only Allowed agency or owner can set manteinance URI", async () => {
    const manteinanceURI = "ThisIsADummyManteinanceURI";
    try {
      await contract.methods
        .setURIManteinance(tokenId, manteinanceURI)
        .send({ from: accounts[4] });
    } catch (err) {
      return;
    }
    assert(false);
  });

  it("Let set URI", async () => {
    const tokenURIModified = "ThisIsADummyTokenURIModified";

    await contract.methods
      .setURI(tokenId, tokenURIModified)
      .send({ from: accounts[0] });

    let tokenURIReaded = await contract.methods
      .tokenURI(tokenId)
      .call({ from: accounts[0] });

    assert.equal(tokenURIModified, tokenURIReaded);
  });

  it("Only contract owner can set URI", async () => {
    const tokenURIModified = "ThisIsADummyTokenURIModified";
    try {
      await contract.methods
        .setURI(tokenId, tokenURIModified)
        .send({ from: accounts[1] });
    } catch (err) {
      return;
    }
    assert(false);
  });

  it("Let update fee", async () => {
    let newFee = 5;
    await contract.methods.setFee(newFee).send({ from: accounts[0] });
    var actualFee = await contract.methods.fee().call({ from: accounts[0] });
    assert.equal(newFee, actualFee);
  });

  it("Let update fee only for valid values", async () => {
    try {
      let newFee = 130;
      await contract.methods.setFee(newFee).send({ from: accounts[0] });
    } catch (err) {
      return;
    }
    assert(false);
  });

  it("Let create tranfer intention", async () => {
    await contract.methods
      .tranferIntention(tokenId, accounts[4], web3.utils.toWei("10", "ether"))
      .send({ from: accounts[1] });

    let tranferIntention = await contract.methods
      ._tranferIntentions(tokenId)
      .call({ from: accounts[0] });

    assert.equal(tranferIntention.buyer, accounts[4]);
    assert.equal(tranferIntention.price, web3.utils.toWei("10", "ether"));
    assert.equal(tranferIntention.paid, false);
  });

  it("Only the car owner can create tranfer intention ", async () => {
    try {
      await contract.methods
        .tranferIntention(tokenId, accounts[4], web3.utils.toWei("10", "ether"))
        .send({ from: accounts[0] });
    } catch (err) {
      return;
    }
    assert(false);
  });

  it("Let delete tranfer intention", async () => {
    await contract.methods
      .tranferIntention(tokenId, accounts[4], web3.utils.toWei("10", "ether"))
      .send({ from: accounts[1] });

    await contract.methods
      .deleteTranferIntention(tokenId)
      .send({ from: accounts[1] });

    tranferIntention = await contract.methods
      ._tranferIntentions(tokenId)
      .call({ from: accounts[0] });

    assert.equal(
      tranferIntention.buyer,
      "0x0000000000000000000000000000000000000000"
    );
    assert.equal(tranferIntention.price, 0);
    assert.equal(tranferIntention.paid, false);
  });

  it("Only contract owner or NFT owner can delete tranfer intention", async () => {
    await contract.methods
      .tranferIntention(tokenId, accounts[4], web3.utils.toWei("10", "ether"))
      .send({ from: accounts[1] });
    try {
      await contract.methods
        .deleteTranferIntention(tokenId)
        .send({ from: accounts[2] });
    } catch (err) {
      return;
    }
    assert(false);
  });

  it("Let pay for a transfer", async () => {
    await contract.methods
      .tranferIntention(tokenId, accounts[4], web3.utils.toWei("10", "ether"))
      .send({ from: accounts[1] });

    await contract.methods
      .payTranfer(tokenId)
      .send({ from: accounts[4], value: web3.utils.toWei("10", "ether") });

    tranferIntention = await contract.methods
      ._tranferIntentions(tokenId)
      .call({ from: accounts[0] });

    assert.equal(tranferIntention.paid, true);
  });

  it("Dont let pay for a transfer if there is no tranfer intetion", async () => {
    try {
      await contract.methods
        .payTranfer(tokenId)
        .send({ from: accounts[4], value: web3.utils.toWei("10", "ether") });
    } catch (err) {
      return;
    }
    assert(false);
  });

  it("Dont let pay for a transfer if not the buyer", async () => {
    await contract.methods
      .tranferIntention(tokenId, accounts[4], web3.utils.toWei("10", "ether"))
      .send({ from: accounts[1] });
    try {
      await contract.methods
        .payTranfer(tokenId)
        .send({ from: accounts[1], value: web3.utils.toWei("10", "ether") });
    } catch (err) {
      return;
    }
    assert(false);
  });

  it("Let transfer a car", async () => {
    let contractBalanceAfter;
    let ownerBalanceBefore;
    let ownerBalanceAfter;

    ownerBalanceBefore = web3.utils.fromWei(
      await web3.eth.getBalance(accounts[1])
    );

    await contract.methods
      .tranferIntention(tokenId, accounts[4], web3.utils.toWei("10", "ether"))
      .send({ from: accounts[1] });

    await contract.methods
      .payTranfer(tokenId)
      .send({ from: accounts[4], value: web3.utils.toWei("10", "ether") });

    await contract.methods
      .carTransfer(tokenId)
      .send({ from: accounts[1], gas: "5000000" });

    contractBalanceAfter = web3.utils.fromWei(
      await web3.eth.getBalance(contract.options.address)
    );
    ownerBalanceAfter = web3.utils.fromWei(
      await web3.eth.getBalance(accounts[1])
    );

    assert.ok(parseFloat(ownerBalanceBefore) < parseFloat(ownerBalanceAfter));
    assert.ok(contractBalanceAfter == "0.2");
  });

  it("Only car owner can transfer", async () => {
    await contract.methods
      .tranferIntention(tokenId, accounts[4], web3.utils.toWei("10", "ether"))
      .send({ from: accounts[1] });

    await contract.methods
      .payTranfer(tokenId)
      .send({ from: accounts[4], value: web3.utils.toWei("10", "ether") });

    try {
      await contract.methods
        .carTransfer(tokenId)
        .send({ from: accounts[0], gas: "5000000" });
    } catch (err) {
      return;
    }
    assert(false);
  });

  it("Cant transfer if its not paid", async () => {
    await contract.methods
      .tranferIntention(tokenId, accounts[4], web3.utils.toWei("10", "ether"))
      .send({ from: accounts[1] });

    try {
      await contract.methods
        .carTransfer(tokenId)
        .send({ from: accounts[1], gas: "5000000" });
    } catch (err) {
      return;
    }
    assert(false);
  });

  it("Let know the owner", async () => {
    let owner = await contract.methods
      .ownerOf(tokenId)
      .call({ from: accounts[0] });

    assert(owner == accounts[1]);
  });

  // it("Let burn an NFT", async () => {
  //   let tokenURI;
  //   let tokenURIManteinance;
  //   await contract.methods._burn(tokenId).send({ from: accounts[0] });
  //
  //   tokenURI = await contract.methods
  //     .tokenURI(tokenId, 0)
  //     .call({ from: accounts[0] });
  //
  //   tokenURIManteinance = await contract.methods
  //     .tokenURI(tokenId, 1)
  //     .call({ from: accounts[0] });
  //
  //   assert.equal(tokenURI, "");
  //   assert.equal(tokenURIManteinance, "");
  // });
});
