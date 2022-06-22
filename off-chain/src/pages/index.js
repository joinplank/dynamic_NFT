import web3 from "../web3";
import contract from "../carRegistrationContract";

import React from "react";

class Home extends React.Component {
  //the pourpose to use the constructur is to initialize the state vars
  constructor(props) {
    super(props);
    this.state = { owner: "" };
    this.state = { balance: "aa" };
    this.message = { message: "" };
  }

  //executes one time when the component is rendered
  async componentDidMount() {
    try {
      const owner = await contract.methods.owner().call();
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(contract.options.address)
      );
      this.setState({ owner, balance });
    } catch {
      this.setState({
        message: "Error - No contract on that address",
      });
    }
  }

  render() {
    //const Home = () => {
    return (
      <div>
        <h1>Automotive Registration System on the blockchain</h1>
        <h2>This contract is owned by {this.state.owner} </h2>
        <h2>Contract balance {this.state.balance} eth</h2>
        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default Home;
