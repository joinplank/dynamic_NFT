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
    name: "",
    km: "",
    description: "",
    observations: "",
    dealer: "",
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

        //console.log("response: ", responseJson.maintenances.length);

        this.setState({
          table: responseJson.maintenances,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  onSubmitForm = async (event) => {
    event.preventDefault();
    let tokenUri;
    const accounts = await web3.eth.getAccounts();
    let responseJson = {
      maintenances: [
        {
          name: "",
          km: "",
          description: "",
          observations: "",
          dealer: "",
        },
      ],
    };
    let index = 0;

    //I dont like how this is implemented but it works anyway. There is a lot of duplicated code. Please fix it.

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

    if (tokenUri != "") {
      //no maintenance yet

      this.setState({
        messageMant: "",
      });
      try {
        let response = await fetch(tokenUri);
        responseJson = await response.json();

        index = responseJson.maintenances.length;
      } catch (error) {
        console.error(error);
      }
    }

    responseJson.maintenances[index] = {
      name: `${this.state.name}`,
      km: `${this.state.km}`,
      description: `${this.state.description}`,
      observations: `${this.state.observations}`,
      dealer: `${this.state.dealer}`,
    };

    this.setState({
      message: "Upgrading maintenance Information",
    });

    console.log("jsonnn: ", JSON.stringify(responseJson));
    const added = await client.add(JSON.stringify(responseJson));
    const metadata = `https://ipfs.infura.io/ipfs/${added.path}`;

    //console.log("metadata: ", metadata);

    try {
      await contract.methods
        .setURIManteinance(this.state.tokenId, metadata)
        .send({ from: accounts[0] });
      this.setState({
        message: "",
      });

      //to refresh
      this.setState({
        tokenId: this.state.tokenId,
      });
    } catch (e) {
      console.log(e);
      this.setState({
        message: "Transaction error",
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
                      <td>
                        <h3>{element}</h3>
                      </td>
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
          <h2>
            Name:
            <input
              value={this.state.name}
              onChange={(event) => this.setState({ name: event.target.value })}
            />
          </h2>
          <h2>
            Km:
            <input
              value={this.state.km}
              onChange={(event) => this.setState({ km: event.target.value })}
            />
          </h2>
          <h2>
            Description:
            <input
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </h2>
          <h2>
            Observations:
            <input
              value={this.state.observations}
              onChange={(event) =>
                this.setState({ observations: event.target.value })
              }
            />
          </h2>
          <h2>
            Dealer:
            <input
              value={this.state.dealer}
              onChange={(event) =>
                this.setState({ dealer: event.target.value })
              }
            />
          </h2>

          <button>Change Maintenance Information</button>
        </form>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default Maintenance;
