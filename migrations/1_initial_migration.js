const contract = artifacts.require("carRegistrationContract");

module.exports = function (deployer) {
  deployer.deploy(contract, 2); //2 is an argument the contructor expects for the fee
};
