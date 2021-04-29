import { POST, signStr, post_tokenHeder } from './requst';

const SERVER_URL = 'https://guigu.motionpaydev.com/';
let BASE_URL = '';
if (process.env.NODE_ENV == 'development') {
  BASE_URL = '/api/';
} else {
  BASE_URL = '/';
}

//二维码支付
export function getQRPayUrl(params, data) {
  return POST(BASE_URL + 'onlinePayment/v1_1/pay/prePay', params, data);
}

export function wapPay(params, data) {
  return POST(BASE_URL + 'onlinePayment/v1_1/pay/wapPay', params, data);
}

//WAP支付链接
export function getPayUrl(params, data) {
  let param = signStr(params, data);
  let URL = SERVER_URL + '/onlinePayment/v1_1/pay/getPayUrl?';
  URL += `mid=${param.mid}&out_trade_no=${param.out_trade_no}&sign=${param.sign}`;
  return URL;
}

//js api 支付

export function jsApiPay(params, data) {
  return POST(BASE_URL + 'onlinePayment/v1_1/pay/jsapi', params, data);
}

//收银台 订单状态查询
export function checkOrder(params, data) {
  return POST(
    BASE_URL + 'onlinePayment/v1_2/pay/singleTradeInquiry',
    params,
    data,
  );
}

//web支付下单
export function webPay(param, data) {
  return POST(BASE_URL + 'onlinePayment/v1_1/pay/webPay', param, data);
}
//this is mockOne
export function getInfoByToken(params) {
  return post_tokenHeder(BASE_URL + 'onlinePayment/v1_1/pay/getParams', params);
}

export function getWxOpenId(params, data) {
  return POST(BASE_URL + 'onlinePayment/v1_1/pay/getOpenid', params, data);
}

//get host url
export function geth5Url(params, data) {
  return POST(BASE_URL + 'onlinePayment/v1_1/pay/getHostUrl', params, data);
}
//
export function closeOrder(params, data) {
  return POST(BASE_URL + 'onlinePayment/v1_1/pay/orderClose', params, data);
}
