import React from 'react';
import { useState } from 'react';
import styles from './index.less';
import { history } from 'umi';

// export default () => {
//   const [count, setCount] = useState(0);
//   return (
//     <div>
//       <h1 className={styles.title}>Page index</h1>
//     </div>
//   );
// }

class Index extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'hello react umi',
    };
  }
  componentWillMount() {
    console.info('.componentWillMount....');
  }

  //
  componentDidMount() {
    console.info('.componentDidMount....');
  }
  inputMobile = (e: any) => {
    // console.info(e.target.value);
    let mobileNo = e.target.value;
    let val = this.refs['mobileNo'].value;
    console.info(val);
    this.setState(
      {
        mobileNo: mobileNo,
      },
      () => {
        console.info('setState callBack.....');
      },
    );
  };
  add = () => {
    alert(this.state.mobileNo);
    alert(typeof this.state.mobileNo);
    console.info(this.state, typeof null, this, typeof this, typeof this.add);
  };
  toPay() {
    console.log('####to pay....');
    history.push({
      pathname: 'pay/index',
      query: {
        a: 'b',
      },
    });
  }
  render() {
    return (
      <div className="page">
        <h1>{this.state.mobileNo}</h1>
        <h1 className={styles.title}>{this.state.title}</h1>
        <button onClick={this.add}>add</button>
        <input
          type="text"
          ref="mobileNo"
          onChange={this.inputMobile}
          placeholder="输入手机号码"
        />
        <a
          style={{
            textDecoration: 'underline',
            color: 'bulue',
            cursor: 'pointer',
          }}
          onClick={this.toPay.bind(this)}
        >
          Pay
        </a>
      </div>
    );
  }
}

export default Index;
