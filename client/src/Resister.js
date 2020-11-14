import React from "react";
import MarketApp from "./DiaryApp.json";
import getWeb3 from "./getWeb3";

import { Row, Col, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class Resister extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      name: null,
      email: null,
      address: "",

      // モーダル
      show: false,
      // フォームチェック
      validated: false,
    };
  }

  // モーダル設定
  handleClose = async () => {
    await this.setState({ show: false });

    // ページリロード
    document.location.reload();
  }

  handleShow = async () => this.setState({ show: true });

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

  // アカウント情報の登録
  writeRecord = async () => {
    const { accounts, contract, name, email } = this.state;
    const result = await contract.methods.registerAccount(name, email).send({
      from: accounts[0],
    });
    console.log(result);

    if (result.status === true) {
      this.handleShow();
    }
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  // フォーム最終確認
  handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
  };

  render() {
    return (
      <div id="Resister">
        <Row className="mx-4">
          <Col md={{ span: 4, offset: 4 }} xs={{ span: 12 }}>
            <Form className="justify-content-center"
              noValidate validated={this.state.validated} >

              <Form.Group controlId="validationCustom03">
                <Form.Label>UserName</Form.Label>
                <Form.Control
                  type="name"
                  onChange={this.handleChange("name")}
                  placeholder="Enter Name"
                  required />
                <Form.Control.Feedback type="invalid">
                  Please choose name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="validationCustom03">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="text"
                  onChange={this.handleChange("email")}
                  placeholder="name@example.com"
                  required />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Please choose email.
                </Form.Control.Feedback>
              </Form.Group>

              {/* フォームチェック */}
              <Form.Group>
                <Form.Check
                  required
                  label="Agree to terms and conditions"
                  feedback="You must agree before submitting."
                  onChange={this.handleSubmit}
                />
              </Form.Group>

              <Button variant="primary" type="submit" onClick={this.writeRecord}>
                会員登録
          </Button>

              {/* モーダル */}
              <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Wellcome to BcDiary!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>会員登録が完了しました。</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Form>
          </Col>
        </Row>
      </div >
    );
  }
}

export default Resister;


