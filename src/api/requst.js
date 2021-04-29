// import  CryptoJS from 'crypto-js';
import axions from 'axios';
// import store from '../sotore'

// let [a] =[...tok];
// console.log(a)

// const APPID="5005642020001";
//const APPID="5005642020003";

// const APPSECRET ="cea2666c382fb3c8883d51275fe32826";
//const APPSECRET ="5045324ba04d0d2854e6d2468ab1f0e4";
const TIME_OUT = 6000;

function log(content) {
  if (process.env.NODE_ENV == 'development') {
    console.log(content);
  }
}

/**
 *
 */
function POST_withSigned(URL, params, data) {
  // console.log(store.state.appId)
  // let appId = store.state.appId
  // let appsecret = store.state.appSecret
  let info = JSON.parse(window.sessionStorage.getItem('info'));

  let appId = '';
  let appsecret = '';
  if (info) {
    appId = info.appId;
    appsecret = info.appSecret;
  }

  let keys = Array.from(data.keys());
  keys.sort();
  let signStr = '';
  for (let i = 0; i < keys.length; i++) {
    signStr = signStr + keys[i] + '=' + data.get(keys[i]) + '&';
  }
  signStr = signStr + 'appid=' + appId + '&appsecret=' + appsecret;

  let sign = CryptoJS.SHA1(signStr).toString(CryptoJS.enc.Hex);
  params.sign = sign.toUpperCase();
  log('请求参数:' + JSON.stringify(params));

  return axions({
    method: 'POST',
    url: URL,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: TIME_OUT,
  });
}

function signStr(params, data) {
  // let appId = store.state.appId;
  // let appsecret = store.state.appSecret;
  let info = JSON.parse(window.sessionStorage.getItem('info'));
  let appId = '';
  let appsecret = '';
  if (info) {
    appId = info.appId;
    appsecret = info.appSecret;
  }

  let keys = Array.from(data.keys());
  keys.sort();
  let signStr = '';
  for (let i = 0; i < keys.length; i++) {
    signStr = signStr + keys[i] + '=' + data.get(keys[i]) + '&';
  }
  signStr = signStr + 'appid=' + appId + '&appsecret=' + appsecret;

  let sign = CryptoJS.SHA1(signStr).toString(CryptoJS.enc.Hex);
  params.sign = sign.toUpperCase();
  return params;
}
function norm_post(URL, params) {
  log(`请求地址：${URL}`, '请求参数:' + JSON.stringify(params));
  return axions({
    method: 'POST',
    url: URL,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: TIME_OUT,
  });
}

function post_tokenHeder(URL, params) {
  log(`请求地址：${URL}`, '请求参数:' + JSON.stringify(params));
  return axions({
    method: 'POST',
    url: URL,
    data: params,
    headers: {
      'Content-Type': 'application/json',
      token: params.token,
    },
    timeout: TIME_OUT,
  });
}

export { POST_withSigned as POST, signStr, norm_post, post_tokenHeder };
