import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap"; // 
import "bootstrap/dist/css/bootstrap.min.css"; // 


class SimpleItemCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // 時刻の表記
  unixTimeToTime = (intTime) => {
    const time = Number(intTime);
    const y = new Date(time * 1000);
    const year = y.getFullYear();
    const month = y.getMonth() + 1;
    const day = y.getDate();
    // const hour = ('0' + y.getHours()).slice(-2);
    // const min = ('0' + y.getMinutes()).slice(-2);
    // const sec = ('0' + y.getSeconds()).slice(-2);
    const Time = year + '-' + month + '-' + day + ' ';
    return Time;
  }

  render() {
    return (
      <div id="simple_card_item">
        <Card style={{ width: '18rem', height: '23rem' }}>
          <Card.Img
            variant="top"
            src={"http://drive.google.com/uc?export=view&id=" + this.props.image}
          />

          <Card.Body>
            <Card.Title>タイトル：{this.props.title}</Card.Title>
            <Card.Text>本文：{this.props.text}</Card.Text>

            <Row className="justify-content-center">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={this.props.favo_button}
              >{this.props.favo_c}
              </Button>
            </Row>
          </Card.Body>

          <Card.Footer className="text-center">
            <small className="text-muted">{this.unixTimeToTime(this.props.time)}</small>
          </Card.Footer>

        </Card>
        <br />
      </div >

    );
  }
}
export default SimpleItemCard;