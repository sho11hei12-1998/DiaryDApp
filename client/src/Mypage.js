import React from "react";
import MarketApp from "./DiaryApp.json";
import getWeb3 from "./getWeb3";
import SimpleItemCard from "./SimpleItemCard";

import { Row, Col, CardDeck, Tabs, Tab } from "react-bootstrap"; // 
import "bootstrap/dist/css/bootstrap.min.css"; // 

class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,

      _numItems: 0, //出品されている商品数
      // ブロックチェーンの情報を記入
      lines: [],

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

    const { accounts, contract } = this.state;

    console.log(accounts);

    // アカウント情報の読み込み
    const result1 = await contract.methods.viewAccount(accounts[0]).call();
    console.log(result1);
    const outputName = result1[0];
    const outputEmail = result1[1];
    const outputNumWrite = result1[2];
    this.setState({ outputName, outputEmail, outputNumWrite });

    // 全体の投稿数を取得する
    const num = await contract.methods.numItems().call();
    this.setState({ _numItems: num });

    const { _numItems } = this.state;
    for (var idx = 0; idx < _numItems; idx++) {
      const item = await contract.methods.items(idx).call();
      const image = await contract.methods.images(idx).call();
      this.state.lines.push({
        item,
        image,
      });
      this.setState(this.state.lines);
    }
    console.log(this.state.lines);
  };

  render() {
    // 出品した商品を表示させる
    const card1 = this.state.lines.map((block, i) => {

      if (this.state.lines[i].item[0] === this.state.accounts[0]) {
        return (
          <SimpleItemCard
            {...block}
            key={i}
            num={Number(i)}
            image={this.state.lines[i].image}
            title={this.state.lines[i].item[1]}
            text={this.state.lines[i].item[2]}
            time={this.state.lines[i].item[3]}
          />
        );
      }
      else {
        return null
      }
    });

    // 購入した商品を表示させる
    const card2 = this.state.lines.map((block, i) => {

      if (this.state.lines[i].item[1] === this.state.accounts[0]) {
        return (
          <SimpleItemCard
            {...block}
            key={i}
            num={Number(i)}
            image={this.state.lines[i].image}
            title={this.state.lines[i].item[3]}
            text={this.state.lines[i].item[4]}
          />
        );
      }
      else {
        return null
      }
    });

    return (
      <div id="Mypage" className="mx-4">
        <Row>
          <Col md={{ span: 4, offset: 4 }} xs={{ span: 12 }}>
            <p>Name: {this.state.outputName}</p>
            <p>Address: {this.state.accounts}</p>
            <p>投稿数: {this.state.outputNumWrite}</p>
          </Col>
        </Row>

        <br />

        <Row>
          <Col>
            <Tabs
              defaultActiveKey="card1"
              id="uncontrolled-tab-example"
              className="justify-content-center">

              <Tab eventKey="card1" title="投稿">
                <CardDeck className="justify-content-center mt-4">
                  {/* カード代入 */}
                  {card1}
                </CardDeck>
              </Tab>
              <Tab eventKey="card2" title="お気に入り">
                <CardDeck className="justify-content-center mt-4">
                  {/* カード代入 */}
                  {card2}
                </CardDeck>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Mypage;


