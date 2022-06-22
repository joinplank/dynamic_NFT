import React from "react";
import web3 from "../web3";
import contract from "../carRegistrationContract";

class Viewer extends React.Component {
  //the pourpose to use the constructur is to initialize the state vars
  state = {
    tokenId: "",
    message: "",
    srcPicture: "",
    brand: "",
    model: "",
    chassis: "",
    motor: "",
    date: "",
    plate: "",
    description: "",
    owner: "",
    ownerHistory: "",
    tokenIdSelected: "",
    tiMessage: "",
    tiBuyer: "",
    tiPrice: "",
    tiPaid: "",
    messageMant: "",
    table: [],
  };

  onSubmitView = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    let tokenUri;
    let owner;
    let responseJson;
    let owners = "";

    this.setState({ message: "Waiting on transaction success..." });

    await contract.getPastEvents(
      "Transfer",
      {
        filter: { tokenId: this.state.tokenId },
        fromBlock: 0,
        toBlock: "latest",
      },
      (err, events) => {
        console.log(events);
        let response;
        for (let i = 0; i < events.length; i++) {
          //console.log("Dueño:", events[0].returnValues["to"]);
          owners =
            owners +
            events[i].returnValues["to"] +
            " (Blocknumber: " +
            events[i].blockNumber +
            "); ";
        }
        this.setState({ ownerHistory: owners });
      }
    );

    try {
      owner = await contract.methods
        .ownerOf(this.state.tokenId)
        .call({ from: accounts[0] });
      this.setState({ owner });
    } catch (e) {
      console.log("ERROR: ", e);
    }

    try {
      tokenUri = await contract.methods
        .tokenURI(this.state.tokenId, 0)
        .call({ from: accounts[0] });
      this.setState({ message: "" });
    } catch {
      this.setState({
        message: "Transaction error",
        srcPicture: "",
        brand: "",
        model: "",
        chassis: "",
        motor: "",
        date: "",
        plate: "",
        owner: "",
        description: "",
        table: "",
        tokenId: "",
        tokenIdSelected: "",
        ownerHistory: "",
      });
    }

    try {
      let response = await fetch(tokenUri);
      responseJson = await response.json();
    } catch (error) {
      console.error(error);
    }

    this.setState({
      srcPicture: responseJson.image,
      description: responseJson.description,
      brand: responseJson.attributes[0].value,
      model: responseJson.attributes[1].value,
      chassis: responseJson.attributes[2].value,
      motor: responseJson.attributes[3].value,
      date: responseJson.attributes[4].value,
      plate: responseJson.attributes[5].value,
      tokenIdSelected: this.state.tokenId,
    });

    try {
      let tranferIntention = await contract.methods
        ._tranferIntentions(this.state.tokenId)
        .call({ from: accounts[0] });

      if (
        tranferIntention.buyer != "0x0000000000000000000000000000000000000000"
      ) {
        this.setState({ tiBuyer: "Buyer: " + tranferIntention.buyer });
        this.setState({
          tiPrice:
            "Price: " + web3.utils.fromWei(tranferIntention.price) + " eth",
        });
        this.setState({ tiPaid: "Paid: " + tranferIntention.paid });
      } else {
        this.setState({ tiMessage: "No tranfer intention for this car" });
      }
    } catch {
      this.setState({ tiMessage: "No tranfer intention for this car" });
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

  render() {
    return (
      <div>
        <hr />
        <h1 align="center">Car Information viewer</h1>
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
          <h1>Token Id: {this.state.tokenIdSelected} </h1>
          <h3>
            <img src={this.state.srcPicture} width="200px" />
          </h3>
          <h3>Description: {this.state.description}</h3>
          <h3>Actual Owner: {this.state.owner}</h3>
          <h3>
            Brand:
            {this.state.brand}
          </h3>
          <h3>Model:{this.state.model} </h3>
          <h3>Motor:{this.state.motor} </h3>
          <h3>Chassis: {this.state.chassis}</h3>
          <h3>Plate Number:{this.state.plate} </h3>
          <h3>Construction Date: {this.state.date}</h3>

          <h3>Owner History: {this.state.ownerHistory}</h3>
        </div>
        <hr />
        <h3>Transfer intention:</h3>
        <h4>{this.state.tiMessage}</h4>
        <h4>{this.state.tiBuyer}</h4>
        <h4>{this.state.tiPrice}</h4>
        <h4>{this.state.tiPaid}</h4>

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
                this.state.table.map((item) =>
                  Object.values(item).map((element) => {
                    return (
                      <th align="center">
                        <td>{element}</td>
                      </th>
                    );
                  })
                )}
            </tbody>
          </table>
        </div>

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default Viewer;
