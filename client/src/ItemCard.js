import React from "react";
import { Button, Form, Card, Badge } from "react-bootstrap"; // 
import "bootstrap/dist/css/bootstrap.min.css"; // 


class ItemCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sellerValue: 1,
      buyerValue: 1,
    };
  }

  // 評価値をステートにセットする
  handleChange_1 = (event) => {
    this.setState({ sellerValue: Number(event.target.value) });
    console.log('選択中のvalue値:' + event.target.value);

    //親コンポーネントを更新
    this.props.update_sellerValue(event.target.value);
  };

  // 評価値をステートにセットする
  handleChange_2 = (event) => {
    this.setState({ buyerValue: Number(event.target.value) });
    console.log('選択中のvalue値:' + event.target.value);

    //親コンポーネントを更新
    this.props.update_buyerValue(event.target.value);
  };


  render() {
    return (
      <div id="card_item">
        <Card className="mt-4" style={{ width: '25rem' }}>
          <Card.Img
            variant="top"
            src={"http://drive.google.com/uc?export=view&id=" + this.props.image}
          />

          <Card.Body>
            <Card.Title>商品名：{this.props.name}</Card.Title>
            <Card.Text>価格：{this.props.price}(wei)</Card.Text>
            <Card.Text>商品説明：{this.props.introduction}</Card.Text>
            <Card.Text>商品状態：<Badge variant="success">{this.props.goods_status}</Badge>{' '}</Card.Text>
            <Card.Text>出品者：{this.props.seller}</Card.Text>
            <Card.Text>出品者のアドレス：{this.props.seller_addr}</Card.Text>
            <Card.Text>購入者のアドレス：{this.props.buyer_addr}</Card.Text>
            <Card.Text>支払い：{this.props.payment}</Card.Text>
            <Card.Text>発送：{this.props.shipment}</Card.Text>
            <Card.Text>受取：{this.props.receivement}</Card.Text>
            <Card.Text>出品者評価：{this.props.seller_reputate}</Card.Text>
            <Card.Text>購入者評価：{this.props.buyer_reputate}</Card.Text>

            <div id="button-box">
              {/* 購入ボタン */}
              <Button
                variant="primary"
                onClick={this.props.buy_button}
                disabled={this.props.buy_button_status}>この商品を購入</Button>
              <br />
              <br />

              {/* 発送通知ボタン */}
              <Button
                variant="primary"
                onClick={this.props.ship_button}
                disabled={this.props.ship_button_status}>発送完了通知</Button>
              <br />
              <br />

              {/* 受取完了通知ボタン */}
              <Button
                variant="primary"
                onClick={this.props.receive_button}
                disabled={this.props.receive_button_status}>受取完了通知</Button>
              <br />
              <br />


              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>出品者を評価して下さい：</Form.Label>
                <Form.Control as="select" value={this.state.sellerValue} onChange={this.handleChange_1}>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </Form.Control>
              </Form.Group>

              {/* 出品者の評価ボタン */}
              <Button
                variant="primary"
                onClick={this.props.sellerEvaluate_button}
                disabled={this.props.sellerEvaluate_button_status}>出品者を評価
              </Button>
              <br />
              <br />
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>購入者を評価して下さい：</Form.Label>
                <Form.Control as="select" value={this.state.buyerValue} onChange={this.handleChange_2}>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </Form.Control>
              </Form.Group>

              <Button
                variant="primary"
                onClick={this.props.buyerEvaluate_button}
                disabled={this.props.buyerEvaluate_status}>購入者を評価
          </Button>

            </div>
          </Card.Body>

          <Card.Footer className="text-center">
            <small className="text-muted">Product No.{this.props.num + 1}</small>
          </Card.Footer>
        </Card>

        <br />
      </div >

    );
  }
}
export default ItemCard;