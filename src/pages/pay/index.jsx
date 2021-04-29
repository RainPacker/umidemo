import React from 'react';
import './index.css';
import { geth5Url } from '@/api/pay';
class Index extends React.Component {
  state = {
    title: 'hello react umi',
    total: 0.01,
  };
  render() {
    return (
      <div>
        <h1>Motion Pay</h1>
        <div
          className="product"
          style={{
            height: 0,
            width: 0,
            padding: 0,
            margin: 0,
            position: 'absolute',
            top: '-50px',
            right: '30px',
          }}
        ></div>
        <div className="shopping-cart">
          <div className="totals">
            <div className="totals-item">
              <label>Subtotal</label>
              <div className="totals-value" id="cart-subtotal">
                <input
                  type="text"
                  style={{ width: '60%' }}
                  value={this.state.total}
                  onChange={this.inputVal}
                  onBlur={this.getPayMoney}
                  maxLength="5"
                />
              </div>
            </div>
            <div className="totals-item">
              <label>Tax (5%)</label>
              <div className="totals-value" id="cart-tax">
                0
              </div>
            </div>

            <div className="totals-item totals-item-total">
              <label>Grand Total</label>
              <div className="totals-value" id="cart-total">
                {this.state.total}
              </div>
            </div>
          </div>
          <button className="checkoutUPOP" onClick={this.toUnionPay}></button>
          <button
            className="checkoutWechat"
            onClick={this.toWechatPay}
          ></button>
          <button className="checkoutAlipay" onClick={this.toAlipay}></button>

          <div className="paywith">
            <h1>Pay With</h1>
          </div>
        </div>
      </div>
    );
  }
  inputVal = e => {
    console.log(e);
    this.setState({
      total: e.target.value,
    });
  };
  getPayMoney = () => {};
  toUnionPay = () => {
    alert(1);
    let data = new Map();
    let param = {};
    geth5Url(param, data)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };
  toWechatPay = () => {
    alert(3);
  };
  toAlipay = () => {
    alert(2);
  };
}

export default Index;
