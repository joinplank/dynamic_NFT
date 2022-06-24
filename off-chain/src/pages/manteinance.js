import React from "react";
import web3 from "../web3";
import contract from "../carRegistrationContract";
import { create } from "ipfs-http-client";

const client = create("https://ipfs.infura.io:5001/api/v0");

class Maintenance extends React.Component {
  //the pourpose to use the constructur is to initialize the state vars
  state = {
    message: "",
    messageMant: "",
    tokenId: "",
    metadata: "",
    allowed: "",
    table: [],
  };

  onSubmitView = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    let tokenUri;
    let owner;
    let responseJson;
    let owners = "";
    let table = new Array();

    this.setState({ message: "Waiting on transaction success..." });

    try {
      tokenUri = await contract.methods
        .tokenURI(this.state.tokenId, 1)
        .call({ from: accounts[0] });
      this.setState({ message: "" });
    } catch {
      this.setState({
        message: "Transaction error",
      });
    }

    try {
      let allowed = await contract.methods
        ._allowedManteninance(this.state.tokenId)
        .call({ from: accounts[0] });

      this.setState({ message: "" });
      this.setState({ allowed });
    } catch {
      this.setState({
        message: "Transaction error",
      });
    }

    if (tokenUri == "") {
      this.setState({
        messageMant: "No maintenance information for this token",
      });
    } else {
      this.setState({
        messageMant: "",
      });
      try {
        console.log("URI:" + tokenUri);
        let response = await fetch(tokenUri);
        responseJson = await response.json();
        console.log("responseJson", responseJson.maintenances);
        this.setState({
          table: responseJson.maintenances,
        });
        //console.log("QUE HAY EN TABLE", this.state.table);
      } catch (error) {
        console.error(error);
      }
    }
  };

  onSubmitForm = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    let tokenId;

    this.setState({
      message: "Upgrading maintenance Information",
    });

    try {
      await contract.methods
        .setURIManteinance(this.state.tokenId, this.state.metadata)
        .send({ from: accounts[0] });
      this.setState({
        message: "",
      });
    } catch (e) {
      console.log(e);
      this.setState({
        message: "Transaction error",
      });
    }
  };

  onChangeMant = async (event) => {
    const file = event.target.files[0];

    this.setState({
      message: "Uploading metadata",
    });

    try {
      const added = await client.add(file);
      const metadata = `https://ipfs.infura.io/ipfs/${added.path}`;

      this.setState({ metadata });

      console.log("URL MANTENIMIENTO: ", metadata);
      this.setState({
        message: "Metadata Uploaded",
      });
    } catch (error) {
      this.setState({
        message: "Error uploading metadata",
      });
    }
  };

  render() {
    return (
      <div>
        <hr />
        <h1 align="center">Maintenance Information Upgrade</h1>
        <hr />
        <form onSubmit={this.onSubmitView}>
          <div>
            <h2>
              Token ID:
              <input
                value={this.state.tokenId}
                onChange={(event) =>
                  this.setState({ tokenId: event.target.value })
                }
              />
            </h2>
          </div>
        </form>

        <hr />
        <div>
          <h2>Allowed dealer</h2>
          <h3>{this.state.allowed}</h3>
        </div>
        <hr />
        <div>
          <h2>Maintenance History</h2>
          <h3>{this.state.messageMant}</h3>

          <table border={1} cellPadding={1}>
            <thead>
              {this.state.table.length > 0 &&
                Object.keys(this.state.table[0]).map(function (element) {
                  return (
                    <th align="center">
                      <td>{element}</td>
                    </th>
                  );
                })}
            </thead>
            <tbody>
              {this.state.table.length > 0 &&
                this.state.table.map((item) => {
                  return (
                    <tr>
                      {Object.values(item).map((element) => {
                        return <td>{element}</td>;
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <hr />
        <form onSubmit={this.onSubmitForm}>
          <h4>
            New maintenance info:{" "}
            <input type="file" onChange={this.onChangeMant} />
          </h4>
          <button>Change Maintenance Information</button>
        </form>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default Maintenance;

// <table>
//   <thead>
//     <tr>
//       <th>Name</th>
//       <th>KM</th>
//       <th>Description</th>
//       <th>Observations</th>
//       <th>Dealer</th>
//     </tr>
//   </thead>
//   <tbody>
//     {responseJson.map((value, key) => {
//       return (
//         <tr key={key}>
//           <td>{value.name}</td>
//           <td>{value.km}</td>
//           <td>{value.description}</td>
//           <td>{value.observations}</td>
//           <td>{value.dealer}</td>
//         </tr>
//       );
//     })}
//   </tbody>
// </table>
