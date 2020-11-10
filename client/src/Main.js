import React from "react";
import MarketApp from "./DiaryApp.json";
import getWeb3 from "./getWeb3";
import ItemCard from "./ItemCard";

import { CardDeck } from "react-bootstrap"; // 
import "bootstrap/dist/css/bootstrap.min.css"; // 

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      address: "",
      _numItems: 0, //出品されている商品数
      // ブロックチェーンの情報を記入
      lines: [],
      sellerValue: 1,
      buyerValue: 1,
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

    // 出品されている商品数を取得する
    var num = await contract.methods.numItems().call();
    this.setState({ _numItems: num });

    const { _numItems } = this.state;
    for (var idx = 0; idx < _numItems; idx++) {
      const item = await contract.methods.items(idx).call();
      const image = await contract.methods.images(idx).call();
      console.log(item);
      this.state.lines.push({
        item,
        image,
      });
      this.setState(this.state.lines);
    }
    console.log(this.state.lines);
  };

  // 購入する関数
  buyItem = async (idx, price) => {
    const { accounts, contract } = this.state;

    console.log(accounts);

    const result = await contract.methods.buy(idx).send({
      from: accounts[0],
      value: price,
    });
    console.log(result);

    if (result.status === true) {
      alert("購入が完了しました");
    }
    // トランザクション完了後、ページリロード
    document.location.reload()
  };

  // 発送完了する関数
  shipItem = async (idx) => {
    const { accounts, contract } = this.state;

    console.log(accounts);

    const result = await contract.methods.ship(idx).send({
      from: accounts[0],
    });
    console.log(result);

    if (result.status === true) {
      alert("発送が完了しました");
    }
    // トランザクション完了後、ページリロード
    document.location.reload()
  };

  // 受け取りを完了する関数
  receiveItem = async (idx) => {
    const { accounts, contract } = this.state;

    console.log(accounts);

    const result = await contract.methods.receive(idx).send({
      from: accounts[0],
    });
    console.log(result);

    if (result.status === true) {
      alert("受け取りが完了しました");
    }
    // トランザクション完了後、ページリロード
    document.location.reload()
  };

  // 購入者が出品者を評価する関数
  seller_Evaluate = async (idx) => {
    const { accounts, contract } = this.state;

    console.log(accounts);

    console.log('sellerValue= ' + Number(this.state.sellerValue));

    const result = await contract.methods.sellerEvaluate(idx, Number(this.state.sellerValue)).send({
      from: accounts[0],
    });
    console.log(result);

    if (result.status === true) {
      alert("出品者の評価が完了しました");
    }

    // sellerValueを初期値に戻す
    this.setState({ sellerValue: 1 });

    // トランザクション完了後、ページリロード
    document.location.reload()
  };

  // 出品者が購入者を評価する関数
  buyer_Evaluate = async (idx) => {
    const { accounts, contract } = this.state;

    console.log(accounts);

    console.log('buyerValue= ' + Number(this.state.buyerValue));

    const result = await contract.methods.buyerEvaluate(idx, Number(this.state.buyerValue)).send({
      from: accounts[0],
    });
    console.log(result);

    if (result.status === true) {
      alert("購入者の評価が完了しました");
    }

    // buyerValueを初期値に戻す
    this.setState({ buyerValue: 1 });

    // トランザクション完了後、ページリロード
    document.location.reload()
  };

  // stateの変更
  update_sellerValue(state) {
    this.setState({ sellerValue: state });
  }

  // stateの変更
  update_buyerValue(state) {
    this.setState({ buyerValue: state });
  }


  render() {
    // 商品情報を表示する
    const card = this.state.lines.map((block, i) => {

      // 商品状態の確認，true⇒売切れ，false⇒出品中に表示を変更する
      var goods_status_text = "";

      if (this.state.lines[i].item[11] === true) {
        goods_status_text = "売切れ×";
      } else {
        goods_status_text = "出品中";
      }

      var text1 = "済み";
      var text2 = "完了していません";

      // 支払い状態の確認，true⇒済み，false⇒完了していません、に表示を変更する
      var payment_text = "";

      if (this.state.lines[i].item[6] === true) {
        payment_text = text1;
      } else {
        payment_text = text2;
      }

      // 発送状態の確認，true⇒済み，false⇒完了していません、に表示を変更する
      var shipment_text = "";

      if (this.state.lines[i].item[7] === true) {
        shipment_text = text1
      } else {
        shipment_text = text2;
      }

      // 受け取り状態の確認，true⇒済み，false⇒完了していません、に表示を変更する
      var receivement_text = "";

      if (this.state.lines[i].item[8] === true) {
        receivement_text = text1
      } else {
        receivement_text = text2;
      }

      // 出品者の評価状態の確認，true⇒済み，false⇒完了していません、に表示を変更する
      var sellerReputate_text = "";

      if (this.state.lines[i].item[9] === true) {
        sellerReputate_text = text1
      } else {
        sellerReputate_text = text2;
      }

      // 購入者の評価状態の確認，true⇒済み，false⇒完了していません、に表示を変更する
      var buyerReputate_text = "";

      if (this.state.lines[i].item[10] === true) {
        buyerReputate_text = text1
      } else {
        buyerReputate_text = text2;
      }

      // .mapで展開された数だけ、Cardコンポーネントを呼び出す
      return (
        <ItemCard
          {...block}
          key={i}
          num={Number(i)}
          image={this.state.lines[i].image[0]}
          name={this.state.lines[i].item[3]}
          price={this.state.lines[i].item[5]}
          introduction={this.state.lines[i].item[4]}
          goods_status={goods_status_text}
          seller={this.state.lines[i].item[2]}
          seller_addr={this.state.lines[i].item[0]}
          buyer_addr={this.state.lines[i].item[1]}
          payment={payment_text}
          shipment={shipment_text}
          receivement={receivement_text}
          seller_reputate={sellerReputate_text}
          buyer_reputate={buyerReputate_text}

          // 商品購入ボタンの関数
          buy_button={() => this.buyItem(i, this.state.lines[i].item[5])}
          buy_button_status={this.state.lines[i].item[6]}
          // 商品発送ボタンの関数
          ship_button={() => this.shipItem(i)}
          ship_button_status={this.state.lines[i].item[7]}
          // 商品受け取りボタンの関数
          receive_button={() => this.receiveItem(i)}
          receive_button_status={this.state.lines[i].item[8]}
          // 出品者評価の関数
          sellerEvaluate_button={() => this.seller_Evaluate(i)}
          sellerEvaluate_button_status={this.state.lines[i].item[9]}
          update_sellerValue={this.update_sellerValue.bind(this)}
          // 購入者評価の関数
          buyerEvaluate_button={() => this.buyer_Evaluate(i)}
          buyerEvaluate_status={this.state.lines[i].item[10]}
          update_buyerValue={this.update_buyerValue.bind(this)}
        />
      );
    });

    return (
      <div id="main-wrapper">
        <div id="card-container">
          <CardDeck className="justify-content-center">
            {/* カード代入 */}
            {card}
          </CardDeck>
        </div>

      </div>
    );
  }
}
export default Main;
