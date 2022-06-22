import React from "react";
import web3 from "../web3";
import contract from "../carRegistrationContract";

class NewOwner extends React.Component {
  //the pourpose to use the constructur is to initialize the state vars
  state = {
    tokenId: "",
    message: "",
    amount: "",
  };

  onSubmitPay = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Paying for the car" });

    try {
      await contract.methods.payTranfer(this.state.tokenId).send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.amount, "ether"),
      });
      this.setState({ tokenId: "" });
      this.setState({ amount: "" });
      this.setState({ message: "Car paid!" });
    } catch {
      this.setState({ message: "Error paying the car" });
    }
  };

  onSubmitTransfer = async (event) => {
    event.preventDefault();
  };

  render() {
    return (
      <div>
        <hr />
        <h1 align="center">New Owner functions</h1>
        <hr />
        <form onSubmit={this.onSubmitPay}>
          <h2>Pay for a car</h2>
          <h3>
            TokenId:
            <input
              value={this.state.tokenId}
              onChange={(event) =>
                this.setState({ tokenId: event.target.value })
              }
            />
          </h3>
          <h3>
            Amount:
            <input
              value={this.state.amount}
              onChange={(event) =>
                this.setState({ amount: event.target.value })
              }
            />
          </h3>
          <button>Paga ra prata</button>
        </form>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default NewOwner;
