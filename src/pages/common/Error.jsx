import React from 'react';

class Error extends React.Component {
  state = {};

  render() {
    return (
      <div className="container" id="container">
        <div className="page msg_warn js_show" style={{ height: '100%' }}>
          <div className="weui-msg">
            <div className="weui-msg__icon-area">
              <i className="weui-icon-warn weui-icon_msg" />
            </div>
            <div className="weui-msg__text-area">
              <h1 className="weui-msg__title">{this.state.msg}</h1>
              {/* <p class="weui-msg__desc">内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现<a href="javascript:">文字链接</a></p> */}
            </div>
            {/* <div class="weui-msg__tips-area">
            <p class="weui-msg__tips">提示详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现<a href="javascript:">文字链接</a></p>
          </div> */}
            {/* <div class="weui-msg__opr-area">
          <p class="weui-btn-area">
              <a href="javascript:;" @click="closeNow" class="weui-btn weui-btn_primary">关闭</a>
          </p>
          </div> */}
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    let { code } = this.props.location.query;
    if (code) {
      let msg = '';
      code = parseInt(code);
      switch (code) {
        case 1001:
          msg = '请求参数错误或无效';
          break;
        case 1002:
          msg = '订单信息不一致';
          break;
        case 1003:
          msg = '订单已取消';
          break;
        default:
          msg = '请求参数错误或无效';
      }
      this.setState({
        msg: msg,
      });
    }
  }
}

export default Error;
