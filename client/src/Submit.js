import React from "react";
import MarketApp from "./DiaryApp.json";
import getWeb3 from "./getWeb3";

import { Row, Col, Button, Form, Modal } from "react-bootstrap"; // 
import "bootstrap/dist/css/bootstrap.min.css"; // 

class Submit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      title: null,
      text: null,
      price: null,
      googleDocID: "",
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
  handleShow = () => this.setState({ show: true });

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

  // 投稿する関数
  submitItem = async () => {
    const {
      accounts,
      contract,
      title,
      text,
      googleDocID,
    } = this.state;

    const result = await contract.methods
      .submit(title, text, googleDocID)
      .send({
        from: accounts[0],
        value: 1 * (10 ** 18),
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
      <div id="Submit">
        <Row className="mx-4">
          <Col md={{ span: 4, offset: 4 }} xs={{ span: 12 }}>
            <Form className="justify-content-center"
              noValidate validated={this.state.validated} >

              <Form.Group controlId="validationCustom03">
                <Form.Label>タイトルを入力して下さい。</Form.Label>
                <Form.Control
                  onChange={this.handleChange("title")}
                  placeholder="Title name"
                  type="text"
                  required />
                <Form.Control.Feedback type="invalid">
                  Please enter title name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="validationCustom03">
                <Form.Label>本文を入力して下さい。</Form.Label>
                <Form.Control
                  as="textarea"
                  onChange={this.handleChange("text")}
                  placeholder="Text"
                  rows={3}
                  required />
                <Form.Control.Feedback type="invalid">
                  Please enter Text.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="validationCustom03">
                <Form.Label>Googleドライブにアップロードした画像のファイルIDを入力して下さい。</Form.Label>
                <Form.Control
                  onChange={this.handleChange("googleDocID")}
                  placeholder="File ID"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter fileID.
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

              <Form.Group controlId="validationCustom03">
                <Form.Text className="text-muted">
                  ※1Etherを手数料として頂きます。
                </Form.Text>
              </Form.Group>


              {/* 出品するコントラクトを呼び出すボタンを配置する */}
              <Button variant="primary" onClick={this.submitItem} type="submit" className="btn btn-default">
                出品
          </Button>


              <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Completed Transaction!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>投稿が完了しました。</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Close
            </Button>
                </Modal.Footer>
              </Modal>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Submit;
