import React from "react";
import web3 from "../web3";
import contract from "../carRegistrationContract";
import { create } from "ipfs-http-client";

const client = create("https://ipfs.infura.io:5001/api/v0");

class ARA extends React.Component {
  //the pourpose to use the constructur is to initialize the state vars
  state = {
    fee: 0,
    message: "",
    newFee: "",
    owner: "",
    dealer: "",
    metadata: "",
    newDealer: "",
    tokenId: "",
    newMetadata: "",
  };

  //executes one time when the component is rendered
  async componentDidMount() {
    try {
      const fee = await contract.methods.fee().call();

      this.setState({ fee });
    } catch {
      this.setState({
        message: "Error - No contract on that address",
      });
    }
  }

  onSubmitFee = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });
    try {
      await contract.methods
        .setFee(this.state.newFee)
        .send({ from: accounts[0] });
      const fee = await contract.methods.fee().call();
      this.setState({ message: "Transaction done!" });
      this.setState({ fee });
    } catch {
      this.setState({
        message: "Transaction error",
      });
    }
  };

  onSubmitChangeDealer = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });
    try {
      await contract.methods
        .setAllowedManteinance(this.state.tokenId, this.state.newDealer)
        .send({ from: accounts[0] });
      this.setState({ message: "Transaction done!" });
      this.setState({ tokenId: "", newDealer: "" });
    } catch {
      this.setState({
        message: "Transaction error",
      });
    }
  };

  onSubmitChangeMetadata = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });
    try {
      await contract.methods
        .setURI(this.state.tokenId, this.state.newMetadata)
        .send({ from: accounts[0] });
      this.setState({ message: "Transaction done!" });
      this.setState({ tokenId: "", newMetadata: "" });
    } catch {
      this.setState({
        message: "Transaction error",
      });
    }
  };

  onSubmitNFT = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    let tokenId;

    this.setState({
      message: "Minting NFT...",
    });

    try {
      const TX = await contract.methods
        .mintNFT(this.state.owner, this.state.metadata, this.state.dealer)
        .send({ from: accounts[0], gas: "5000000" });

      tokenId = TX.events.Transfer.returnValues["tokenId"];
    } catch {
      this.setState({
        message: "Transaction error",
      });
    }
    this.setState({
      message: "NFT Minted! TokenId; " + tokenId,
    });
  };

  render() {
    //const Home = () => {
    return (
      <div>
        <hr />
        <h1 align="center">
          Automotive Registration Agency (owner of the contract)
        </h1>
        <hr />
        <form onSubmit={this.onSubmitNFT}>
          <div>
            <h1>Create new NFT</h1>
            <h4>
              Owner:{" "}
              <input
                value={this.state.owner}
                onChange={(event) =>
                  this.setState({ owner: event.target.value })
                }
              />
            </h4>
            <h4>
              Car Dealer:{" "}
              <input
                value={this.state.dealer}
                onChange={(event) =>
                  this.setState({ dealer: event.target.value })
                }
              />
            </h4>
            <h4>
              Metadata:{" "}
              <input
                value={this.state.metadata}
                onChange={(event) =>
                  this.setState({ metadata: event.target.value })
                }
              />
            </h4>

            <button>Mint NFT</button>
          </div>
        </form>
        <hr />

        <form onSubmit={this.onSubmitChangeMetadata}>
          <div>
            <h2>Change NFT Metadata </h2>
            <h4>
              Token ID
              <input
                value={this.state.tokenId}
                onChange={(event) =>
                  this.setState({ tokenId: event.target.value })
                }
              />
            </h4>
            <h4>
              New Metadata{" "}
              <input
                value={this.state.newMetadata}
                onChange={(event) =>
                  this.setState({ newMetadata: event.target.value })
                }
              />
            </h4>
            <h4>
              <button>Change Metadata</button>
            </h4>
          </div>
        </form>
        <hr />
        <h2>Actual contract fee {this.state.fee}%</h2>
        <form onSubmit={this.onSubmitFee}>
          <div>
            <input
              value={this.state.newFee}
              onChange={(event) =>
                this.setState({ newFee: event.target.value })
              }
            />
            <h4>
              <button>Change fee value</button>
            </h4>
          </div>
        </form>
        <hr />
        <form onSubmit={this.onSubmitChangeDealer}>
          <div>
            <h2>Change allowed maintenance agency </h2>
            <h4>
              Token ID
              <input
                value={this.state.tokenId}
                onChange={(event) =>
                  this.setState({ tokenId: event.target.value })
                }
              />
            </h4>
            <h4>
              New address{" "}
              <input
                value={this.state.newDealer}
                onChange={(event) =>
                  this.setState({ newDealer: event.target.value })
                }
              />
            </h4>
            <h4>
              <button>Change dealer</button>
            </h4>
          </div>
        </form>

        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default ARA;
