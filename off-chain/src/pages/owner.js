import React from "react";
import web3 from "../web3";
import contract from "../carRegistrationContract";

class Owner extends React.Component {
  //the pourpose to use the constructur is to initialize the state vars
  state = {
    tokenId: "",
    message: "",
    price: "",
    buyer: "",
    tokenIdTransfer: "",
    tokenIdDelete: "",
  };

  onSubmitCreateTransferIntention = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Creating transfer intention..." });

    try {
      await contract.methods
        .tranferIntention(
          this.state.tokenId,
          this.state.buyer,
          web3.utils.toWei(this.state.price, "ether")
        )
        .send({ from: accounts[0] });
      this.setState({ tokenId: "" });
      this.setState({ price: "" });
      this.setState({ buyer: "" });
      this.setState({ message: "Transfer intention created" });
    } catch {
      this.setState({ message: "Error creating transfer intention" });
    }
  };

  onSubmitDeleteTransferIntention = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Deleting transfer intention..." });

    try {
      await contract.methods
        .deleteTranferIntention(this.state.tokenIdDelete)
        .send({ from: accounts[0] });
      this.setState({ message: "Transfer intention Deleted" });
      this.setState({ tokenIdDelete: "" });
    } catch {
      this.setState({ message: "Error deleting transfer intention" });
    }
  };

  onSubmitTransfer = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Transfering the car..." });

    try {
      await contract.methods
        .carTransfer(this.state.tokenIdTransfer)
        .send({ from: accounts[0], gas: "5000000" });

      this.setState({ message: "Car transfered! " });
    } catch {
      this.setState({ message: "Error transfering the car" });
    }
  };

  render() {
    return (
      <div>
        <hr />
        <h1 align="center">Owner functions</h1>
        <hr />
        <form onSubmit={this.onSubmitCreateTransferIntention}>
          <h2>Create transfer intention</h2>
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
            Price:
            <input
              value={this.state.price}
              onChange={(event) => this.setState({ price: event.target.value })}
            />
            .Eth
          </h3>
          <h3>
            Buyer:
            <input
              value={this.state.buyer}
              onChange={(event) => this.setState({ buyer: event.target.value })}
            />
          </h3>
          <button>Create Transfer Intention</button>
        </form>
        <hr />

        <form onSubmit={this.onSubmitDeleteTransferIntention}>
          <h2>Delete Transfer Intention</h2>
          <h3>
            TokenId:
            <input
              value={this.state.tokenIdDelete}
              onChange={(event) =>
                this.setState({ tokenIdDelete: event.target.value })
              }
            />
          </h3>
          <button>Delete Transfer Intention</button>
        </form>
        <hr />

        <form onSubmit={this.onSubmitTransfer}>
          <h2>Car Transfer</h2>
          <h3>
            TokenId:
            <input
              value={this.state.tokenIdTransfer}
              onChange={(event) =>
                this.setState({ tokenIdTransfer: event.target.value })
              }
            />
          </h3>
          <button>Transfer</button>
        </form>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default Owner;
