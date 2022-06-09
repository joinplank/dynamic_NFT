const contract = artifacts.require("carRegistrationContract");

module.exports = function (deployer) {
  deployer.deploy(contract);
};
