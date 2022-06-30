const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = process.env.MNEMONIC;
const infuraAccesToken = process.env.INFURA_ACCESS_TOKEN;

const provider = new HDWalletProvider(mnemonic, infuraAccesToken);

const web3 = new Web3(provider);

const data = require("../build/contracts/carRegistrationContract.json");
const abiArray = data.abi;
const contract_address = process.env.CONTRACT_ADDRESS;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account ", accounts[0]);

  const contract = await new web3.eth.Contract(abiArray, contract_address);
  const tokenURI =
    "https://ipfs.io/ipfs/bafkreihur4jhgzf34uvfds57s7qfqjyknxjfq4xxs4fv4lmd2lyoo67654";
  await contract.methods.mintNFT(tokenURI).send({ from: accounts[0] });

  console.log("New Car NFT Minted!");
};

deploy();
