import React from "react";
import MarketApp from "./DiaryApp.json";
import getWeb3 from "./getWeb3";

import { Row, Col, Button, Form } from "react-bootstrap"; // 
import "bootstrap/dist/css/bootstrap.min.css"; // 

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      name: null,
      email: null,
      address: "",
      outputName: null,
      outputEmail: null,
      outputNumWrite: 0,
    };
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MarketApp.networks[networkId];
      const instance = new web3.eth.Contract(
        MarketApp.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  // アカウント情報の読み込み
  viewRecord = async () => {
    const { contract, address } = this.state;
    console.log(contract);

    const result1 = await contract.methods.viewAccount(address).call();
    console.log(result1);

    const outputName = result1[0];
    const outputEmail = result1[1];
    const outputNumWrite = result1[2];
    this.setState({ outputName, outputEmail, outputNumWrite });
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    return (
      <div id="Info">
        <Row className="mx-4">
          <Col md={{ span: 4, offset: 4 }} xs={{ span: 12 }}>
            <Form className="justify-content-center">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>検索したいアドレスを入力してください。</Form.Label>
                <Form.Control onChange={this.handleChange("address")}
                  placeholder="Search" />
              </Form.Group>
              <Button variant="primary" type="submit" onClick={this.viewRecord}>
                閲覧
          </Button>
            </Form>

            <br />
            <br />

            {this.state.outputName ? <p>UserName: {this.state.outputName}</p> : <p></p>}
            {/* {this.state.outputEmail ? (
              <p>Email: {this.state.outputEmail}</p>
            ) : (
                <p></p>
              )} */}
            {this.state.outputNumWrite ? <p>投稿数: {this.state.outputNumWrite}</p> : <p></p>}

          </Col>
        </Row>
      </div>
    );
  }
}

export default Info;


