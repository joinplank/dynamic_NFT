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
    brand: "",
    model: "",
    chassis: "",
    motor: "",
    date: "",
    plate: "",
    srcPicture: "",
    srcPictureInfura: "",
    description: "",
    name: "",
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

    this.setState({
      message: "Uploading metadata...",
    });

    const metadata = {
      attributes: [
        {
          trait_type: "Brand",
          value: `${this.state.brand}`,
        },
        {
          trait_type: "Model",
          value: `${this.state.model}`,
        },
        {
          trait_type: "Chassis SN",
          value: `${this.state.chassis}`,
        },
        {
          trait_type: "Motor SN",
          value: `${this.state.motor}`,
        },
        {
          trait_type: "Construction date",
          value: `${this.state.date}`,
        },
        {
          trait_type: "Registration Plate Number",
          value: `${this.state.plate}`,
        },
      ],
      description: `${this.state.description}`,
      image: `${this.state.srcPicture}`,
      name: `${this.state.name}`,
    };

    //const file = new File([JSON.parse(JSON.stringify(metadata))], "file.json");

    const added = await client.add(JSON.stringify(metadata));
    const tokenURI = `https://ipfs.io/ipfs/${added.path}`;

    console.log("tokenURI: ", tokenURI);

    //mint NFT
    const TX = await contract.methods
      .mintNFT(this.state.owner, tokenURI, this.state.dealer)
      .send({ from: accounts[0], gas: "5000000" });

    let tokenId = TX.events.Transfer.returnValues["tokenId"];

    this.setState({
      message: "Token ID: " + tokenId,
    });
  };

  onChangePicture = async (event) => {
    const file = event.target.files[0];
    this.setState({
      message: "Uploading Picture",
    });
    try {
      const added = await client.add(file);
      const srcPicture = `https://ipfs.io/ipfs/${added.path}`;
      //I use the infura src for the image to appear quikly. But I dont use it to form the metadata since opensea doesent eccept it
      const srcPictureInfura = `https://ipfs.infura.io/ipfs/${added.path}`;
      this.setState({ srcPicture });
      this.setState({ srcPictureInfura });

      console.log("URL FOTO: ", srcPictureInfura);

      this.setState({
        message: "",
      });
    } catch (error) {
      this.setState({
        message: "Error uploading picture",
      });
    }
  };

  render() {
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
              Brand:{" "}
              <input
                value={this.state.brand}
                onChange={(event) =>
                  this.setState({ brand: event.target.value })
                }
              />
            </h4>{" "}
            <h4>
              Model:{" "}
              <input
                value={this.state.model}
                onChange={(event) =>
                  this.setState({ model: event.target.value })
                }
              />
            </h4>
            <h4>
              Chassis number:{" "}
              <input
                value={this.state.chassis}
                onChange={(event) =>
                  this.setState({ chassis: event.target.value })
                }
              />
            </h4>
            <h4>
              Motor number:{" "}
              <input
                value={this.state.motor}
                onChange={(event) =>
                  this.setState({ motor: event.target.value })
                }
              />
            </h4>
            <h4>
              Fabrication date:{" "}
              <input
                value={this.state.date}
                onChange={(event) =>
                  this.setState({ date: event.target.value })
                }
              />
            </h4>
            <h4>
              Plate number:{" "}
              <input
                value={this.state.plate}
                onChange={(event) =>
                  this.setState({ plate: event.target.value })
                }
              />
            </h4>
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
              Car Dealer Address:{" "}
              <input
                value={this.state.dealer}
                onChange={(event) =>
                  this.setState({ dealer: event.target.value })
                }
              />
            </h4>
            <h4>
              Description:{" "}
              <input
                value={this.state.description}
                onChange={(event) =>
                  this.setState({
                    description: event.target.value,
                    name: event.target.value,
                  })
                }
              />
            </h4>
            <h4>
              Picture: <input type="file" onChange={this.onChangePicture} />
            </h4>
            <h4>
              <img src={this.state.srcPictureInfura} width="200px" />
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
