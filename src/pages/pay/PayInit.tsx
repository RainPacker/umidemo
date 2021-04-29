import React from 'react';
import { wapPay, getPayUrl, jsApiPay, webPay, getInfoByToken } from '@/api/pay';
import { history } from 'umi';
import config from '@/config';
import { isWeiXin, IsPC } from '../../utils';

class PayInit extends React.Component {
  state = {
    loading: true,
    mid: '',
    ip: '',
    isPc: false, //是否是pc 端用户
    isInWeiXin: false, //是否是微信客户端,
    payMethod: '', //支付方式A,W,UNS
    token: '',
    signAppid: '',
    signAppscrept: '',
    //
    terminal_no: '',
    goods_info: 'H5',
    out_trade_no: '',
    total_fee: 1,
    return_url: '',
    wap_url: '',
    currency_type: '',
    wxAppId: config.WXAPPID,
  };
  render() {
    const { loading } = this.state;
    if (loading) {
      return (
        <div className="wgui-message">
          <div className="wgui-message__inner">
            <div className="wgui-message_icon" />
            <div className="wgui-message_text">加载中</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  //方法
  getInfo(token: any) {
    let params = {
      token: token,
    };
    getInfoByToken(params)
      .then((res: any) => {
        let data = res.data;
        if (data.code === '0') {
          let info = data.content;

          this.setState({
            mid: info.mid,
            signAppid: info.appid,
            signAppscrept: info.appSecret,
            terminal_no: info.terminal_no,
            return_url: info.return_url,
            goods_info: info.goods_info,
            wap_url: info.wap_url,
            total_fee: parseInt(info.total_fee),
            currency_type: info.currency_type,
            out_trade_no: info.out_trade_no,
          });
          //this.currency_type = info.currency_type;
          alert(JSON.stringify(this.state, null, 2));
          if (this.state.payMethod != info.pay_channel) {
            //参数信息不一致
            this.toErrPage(1002);
            return;
          }

          //初始化基本信息到缓存 中
          let params = {
            mid: this.state.mid,
            appId: this.state.signAppid,
            appSecret: this.state.signAppscrept,
            token: this.state.token,
          };
          this.setSignInfo(params);

          //this.initToPay()
        } else {
          this.toErrPage('');
        }
      })
      .catch((err: any) => {
        console.log(err);
        this.toErrPage(null);
      });
  }

  setSignInfo(info: object) {
    window.sessionStorage.setItem('info', JSON.stringify(info));
  }

  toErrPage(code: any) {
    //跳转统一错误页面
    history.replace({
      pathname: '/error',
      query: {
        msg: '参数错误',
        code: code ? code : '1001',
      },
    });
    return false;
  }

  //支付定，微信js 支付使用
  jsPay(pay_channel: string) {
    let data = new Map();
    this.getOrderNo();
    const {
      wxAppId,
      mid,
      terminal_no,
      goods_info,
      out_trade_no,
      ip,
      total_fee,
      return_url,
      currency_type,
    } = this.state;
    let params: any = {
      mid: mid,
      pay_channel: pay_channel,
      terminal_no: terminal_no,
      goods_info: goods_info,
      out_trade_no: out_trade_no,
      spbill_create_ip: ip === '' ? '10.10.10.10' : ip,
      total_fee: total_fee,
      return_url: return_url,
      currency_type: currency_type,
    };
    if (pay_channel == 'W') {
      params.openid = 'o8HL9wUrj6tfTh45dnZc_xBNFkYw';
      //暂时写死
      params.wx_appid = wxAppId;
      data.set('openid', params.openid);
      data.set('wx_appid', params.wx_appid);
    }

    data
      .set('mid', params.mid)
      .set('pay_channel', params.pay_channel)
      .set('terminal_no', params.terminal_no)
      .set('goods_info', params.goods_info)
      .set('out_trade_no', params.out_trade_no)
      .set('spbill_create_ip', params.spbill_create_ip)
      .set('total_fee', params.total_fee)
      .set('return_url', params.return_url)
      .set('currency_type', params.currency_type);

    // alert(JSON.stringify(params,null,2))

    return jsApiPay(params, data);
  }

  ready(callback: any) {
    // 如果jsbridge已经注入则直接调用
    if (window.AlipayJSBridge) {
      callback && callback();
    } else {
      // 如果没有注入则监听注入的事件
      document.addEventListener('AlipayJSBridgeReady', callback, false);
    }
  }
  wxBridge(callback: any) {
    if (typeof WeixinJSBridge == 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', callback, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', callback);
        document.attachEvent('onWeixinJSBridgeReady', callback);
      }
    } else {
      callback();
    }
  }
  inAlipay() {
    var userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.match(/Alipay/i) == 'alipay') {
      return true;
    } else {
      return false;
    }
  }

  //初始化决定跳转支付方式处理
  initToPay() {
    this.setState({
      isPc: IsPC(),
      isInWeiXin: isWeiXin(),
    });
    //传入的支付方式
    let payType = this.state.payMethod;
    if (payType === 'A') {
      this.toAlipay();
      return;
    }
    if (payType === 'W') {
      this.toWechatPay();
      return;
    }
    if (payType === 'UNS') {
      this.toUnionPay();
      return;
    }
    //alert('请求参数错误')
    this.toErrPage(1001);
  }

  toQrPay(type: string) {
    history.replace({
      pathname: '/payQrCode',
      query: {
        _t: Math.random(),
        token: this.state.token,
        payType: type === 'wechatpay' ? 'wechatpay' : 'alipay',
      },
    });
  }

  toAlipay() {
    if (this.state.isPc) {
      console.log('pc...');
      // this.toQrPay('alipay')
      this.toAlipayPCWebPay();
    } else {
      console.log('in mobile');

      if (this.state.isInWeiXin) {
        this.toQrPay('alipay');
        //this.wapAlipay()
      } else if (this.state.isInAlipay) {
        //call js jssdk
        this.ready(() => {
          AlipayJSBridge.call('toast', {
            content: 'in alipay app',
          });
          //获取js sdk 签名
          this.jsPay('A')
            .then((res: any) => {
              let data = res.data;
              AlipayJSBridge.call('toast', {
                content: JSON.stringify(res.data, null, 2),
              });
              if (data.code === '0') {
                AlipayJSBridge.call(
                  'tradePay',
                  {
                    orderStr: data.content.orderStr, // 必传，此使用方式下该字段必传
                  },
                  function(result) {
                    alert(JSON.stringify(result));

                    if (result.code === '9000') {
                      window.location.href = this.wap_url;
                    } else {
                      alert('支付失败');
                    }
                  },
                );
              } else {
                alert('error');
              }
            })
            .catch(err => {
              alert(err.message);
              console.log(err);
            });
        });
      } else {
        this.wapAlipay();
      }
    }
  }
  toWechatPay() {
    if (this.state.isPc) {
      console.log('pc...');
      this.toQrPay('wechatpay');
    } else {
      console.log('in mobile');

      //this.wechantJSPay();

      if (this.state.isInWeiXin) {
        //跳转授权页面 获取code 使用静默授权来获取openid
        //这里暂时使用跳转做
        this.toWxAuth();
      } else {
        this.toQrPay('wechatpay');
      }
    }
  }
  toUnionPay() {
    this.wapUnionPay();
  }

  wechantJSPay() {
    this.jsPay('W')
      .then((res: any) => {
        let data = res.data;

        alert(JSON.stringify(data, null, 2));
        if (data.code === '0') {
          let content = data.content;
          this.wxBridge(() => {
            window.WeixinJSBridge.invoke(
              'getBrandWCPayRequest',
              {
                appId: content.wxAppId, //公众号名称，由商户传入
                timeStamp: content.timeStamp, //时间戳，自1970年以来的秒数
                nonceStr: content.nonce_str, //随机串
                package: `prepay_id=${content.prepay_id}`,
                signType: content.signType, //微信签名方式：
                paySign: content.paySign, //微信签名
              },
              function(res: any) {
                // alert(JSON.stringify(res, null, 2))
                if (res.err_msg == 'get_brand_wcpay_request:ok') {
                  //TODO
                }
              },
            );
          });
        } else {
          //alert(data.message)
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  getOrderNo() {
    // let orderNosuffix = '05'
    // this.out_trade_no =
    //   orderNosuffix + Math.floor(Math.random() * 10000000000)
  }

  getWapPayUrlAndRedirect() {
    let data = new Map();
    const { mid, out_trade_no } = this.state;
    let params = {
      mid: mid,
      out_trade_no: out_trade_no,
    };
    data.set('mid', params.mid).set('out_trade_no', params.out_trade_no);
    let redirectUrl = getPayUrl(params, data);
    // console.log(redirectUrl)
    window.location.href = redirectUrl;
  }
  wapUnionPay() {
    let data = new Map();
    let {
      mid,
      return_url,
      wap_url,
      total_fee,
      out_trade_no,
      ip,
      terminal_no,
      currency_type,
    } = this.state;
    this.getOrderNo();
    let params = {
      mid: mid,
      pay_channel: 'UNS',
      goods_info: 'h5',
      return_url: return_url,
      wap_url: wap_url,
      total_fee: total_fee,
      out_trade_no: out_trade_no,
      spbill_create_ip: ip ? ip : '10.10.10.10',
      terminal_no: terminal_no,
      currency_type: currency_type,
    };
    data
      .set('mid', params.mid)
      .set('pay_channel', params.pay_channel)
      .set('goods_info', params.goods_info)
      .set('return_url', params.return_url)
      .set('wap_url', params.wap_url)
      .set('total_fee', params.total_fee)
      .set('out_trade_no', params.out_trade_no)
      .set('spbill_create_ip', params.spbill_create_ip)
      .set('terminal_no', params.terminal_no)
      .set('currency_type', params.currency_type);

    wapPay(params, data)
      .then((res: any) => {
        let data = res.data;
        if (data.code == '0') {
          //获取跳转url
          this.getWapPayUrlAndRedirect();
        } else {
          alert(data.message);
        }
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }
  wapAlipay() {
    let data = new Map();
    this.getOrderNo();
    let {
      mid,
      return_url,
      wap_url,
      total_fee,
      out_trade_no,
      ip,
      terminal_no,
      currency_type,
    } = this.state;
    let params = {
      mid: mid,
      pay_channel: 'A',
      goods_info: 'h5',
      return_url: return_url,
      wap_url: wap_url,
      total_fee: total_fee,
      out_trade_no: out_trade_no,
      spbill_create_ip: ip ? ip : '10.10.10.10',
      terminal_no: terminal_no,
      currency_type: currency_type,
    };
    data
      .set('mid', params.mid)
      .set('pay_channel', params.pay_channel)
      .set('goods_info', params.goods_info)
      .set('return_url', params.return_url)
      .set('wap_url', params.wap_url)
      .set('total_fee', params.total_fee)
      .set('out_trade_no', params.out_trade_no)
      .set('spbill_create_ip', params.spbill_create_ip)
      .set('terminal_no', params.terminal_no)
      .set('currency_type', params.currency_type);

    wapPay(params, data)
      .then((res: any) => {
        let data = res.data;
        if (data.code == '0') {
          //获取跳转url
          this.getWapPayUrlAndRedirect();
        } else {
          alert(data.message);
        }
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  //微信跳转授权页面专用
  toWxAuth() {
    let appId = this.state.wxAppId;
    let redirectUrl = encodeURIComponent(config.AUTH_URL + this.state.token);

    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base&state=STATE#wechat_redire`;
  }

  //支付宝PC 收银台支付
  toAlipayPCWebPay() {
    const {
      mid,
      return_url,
      wap_url,
      total_fee,
      out_trade_no,
      ip,
      terminal_no,
      currency_type,
    } = this.state;
    this.getOrderNo();
    let params = {
      mid: mid,
      pay_channel: 'A',
      goods_info: 'PC',
      return_url: return_url,
      wap_url: wap_url,
      total_fee: total_fee,
      out_trade_no: out_trade_no,
      spbill_create_ip: ip ? ip : '10.1.10.10',
      terminal_no: terminal_no,
      currency_type: currency_type,
    };
    let data = new Map();
    data
      .set('mid', params.mid)
      .set('pay_channel', params.pay_channel)
      .set('goods_info', params.goods_info)
      .set('return_url', params.return_url)
      .set('wap_url', params.wap_url)
      .set('total_fee', params.total_fee)
      .set('out_trade_no', params.out_trade_no)
      .set('spbill_create_ip', params.spbill_create_ip)
      .set('terminal_no', params.terminal_no)
      .set('currency_type', params.currency_type);

    webPay(params, data)
      .then((res: any) => {
        let data = res.data;

        if (data.code === '0') {
          this.getWapPayUrlAndRedirect();
        } else {
          alert(data.message);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  //方法end

  componentDidMount() {
    let str = `                                                                                                    
    \\  |       |  _)              _ \\             __ __|                                      
   |\\/ |  _ \\  __| |  _ \\  __ \\  |   | _\` | |   |    |  _ \\  __|                              
   |   | (   | |   | (   | |   | ___/ (   | |   |    |  __/ (                                 
  _|  _|\\___/ \\__|_|\\___/ _|  _|_|   \\__,_|\\__, |   _|\\___|\\___|                              
                                           ____/                                              
                                                                                              
                                                       `;
    console.log('%c' + str, 'color:#54B8E9;font-size:10px');

    let { token, payType } = this.props.location.query;
    this.setState({
      token: token,
      payMethod: payType,
    });

    if (!payType) {
      this.toErrPage(null);
      return;
    }
    if (!token) {
      this.toErrPage(null);
      return;
    }

    this.getInfo(token);
  }
}
export default PayInit;
