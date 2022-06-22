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
    value: "",
    brand: "",
    model: "",
    chassis: "",
    motor: "",
    date: "",
    plate: "",
    srcPicture: "",
    owner: "",
    dealer: "",
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

    console.log("Cuenta:", accounts[0]);

    this.setState({ message: "Waiting on transaction success..." });
    try {
      await contract.methods
        .setFee(this.state.value)
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

  // onSubmitNFT = async (event) => {
  //   event.preventDefault();
  //   const accounts = await web3.eth.getAccounts();
  //
  //   //const  href={`#demo${this.state.brand}`}
  //   this.setState({
  //     message: "Uploading metadata",
  //   });

  // const metadata = {
  //   attributes: [
  //     {
  //       trait_type: "Brand",
  //       value: "${this.state.brand}",
  //     },
  //     {
  //       trait_type: "Model",
  //       value: "Hilux",
  //     },
  //     {
  //       trait_type: "Chassis SN",
  //       value: "227383922837290",
  //     },
  //     {
  //       trait_type: "Motor SN",
  //       value: "FF5559339H72922",
  //     },
  //     {
  //       trait_type: "Construction date",
  //       value: "5/13/2003",
  //     },
  //     {
  //       trait_type: "Registration Plate Number",
  //       value: "EVR 555",
  //     },
  //   ],
  //   description: "Text : Toyota Hilux CS 2003",
  //   image:
  //     "https://ipfs.io/ipfs/bafkreifo2sbrizpi32b2qa3mwe47iyelfouowi4akogk7tyfsqn5on5cga",
  //   name: "Toyota Hilux CS 2003",
  // };

  //const file = new File([JSON.parse(JSON.stringify(metadata))], "file.json");

  //const added = await client.add(JSON.stringify(metadata));
  //const tokenURI = `https://ipfs.infura.io/ipfs/${added.path}`;

  //console.log("tokenURI: ", tokenURI);

  //const TX = await contract.methods
  //  .mintNFT(this.state.owner, tokenURI, this.state.dealer)
  //  .send({ from: accounts[0], gas: "5000000" });

  //let tokenId = TX.events.Transfer.returnValues["tokenId"];

  //this.setState({
  //  message: tokenId,
  //});
  //};

  onChangePicture = async (event) => {
    const file = event.target.files[0];
    this.setState({
      message: "Uploading Picture",
    });
    try {
      const added = await client.add(file);
      const srcPicture = `https://ipfs.infura.io/ipfs/${added.path}`;
      this.setState({ srcPicture });
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
    //const Home = () => {
    return (
      <div>
        <hr />
        <h1 align="center">
          Automotive Registration Agency (owner of the contract)
        </h1>
        <hr />
        <h1>Actual fee {this.state.fee}%</h1>
        <form onSubmit={this.onSubmitFee}>
          <div>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
            <button>Change fee value</button>
          </div>
        </form>
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
                   Picture: <input type="file" onChange={this.onChangePicture} />
                 </h4>
                <h4>
                   <img src={this.state.srcPicture} width="200px" />
                 </h4>
                 <button>Mint NFT</button>

                   </div>
                 </form>

        // <form onSubmit={this.onSubmitNFT}>
        //   <div>
        //     <h1>Create new NFT</h1>
        //     <h4>
        //       Brand:{" "}
        //       <input
        //         value={this.state.brand}
        //         onChange={(event) =>
        //           this.setState({ brand: event.target.value })
        //         }
        //       />
        //     </h4>{" "}
        //     <h4>
        //       Model:{" "}
        //       <input
        //         value={this.state.model}
        //         onChange={(event) =>
        //           this.setState({ model: event.target.value })
        //         }
        //       />
        //     </h4>
        //     <h4>
        //       Chassis number:{" "}
        //       <input
        //         value={this.state.chassis}
        //         onChange={(event) =>
        //           this.setState({ chassis: event.target.value })
        //         }
        //       />
        //     </h4>
        //     <h4>
        //       Motor number:{" "}
        //       <input
        //         value={this.state.motor}
        //         onChange={(event) =>
        //           this.setState({ motor: event.target.value })
        //         }
        //       />
        //     </h4>
        //     <h4>
        //       Fabrication date:{" "}
        //       <input
        //         value={this.state.date}
        //         onChange={(event) =>
        //           this.setState({ date: event.target.value })
        //         }
        //       />
        //     </h4>
        //     <h4>
        //       Plate number:{" "}
        //       <input
        //         value={this.state.plate}
        //         onChange={(event) =>
        //           this.setState({ plate: event.target.value })
        //         }
        //       />
        //     </h4>
        //     <h4>
        //       Owner:{" "}
        //       <input
        //         value={this.state.owner}
        //         onChange={(event) =>
        //           this.setState({ owner: event.target.value })
        //         }
        //       />
        //     </h4>
        //     <h4>
        //       Car Dealer:{" "}
        //       <input
        //         value={this.state.dealer}
        //         onChange={(event) =>
        //           this.setState({ dealer: event.target.value })
        //         }
        //       />
        //     </h4>
        //     <h4>
        //       Picture: <input type="file" onChange={this.onChangePicture} />
        //     </h4>
        //     <h4>
        //       <img src={this.state.srcPicture} width="200px" />
        //     </h4>
        //     <button>Mint NFT</button>
        //   </div>
        // </form>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default ARA;
