import config from '@/config';
import {setApiUrl, setOnBeforeHttp} from '@mxjs/taro';
import Taro from '@tarojs/taro';
import $ from 'miaoxing';
import '@/components/Page';
import qs from 'query-string';
import appendUrl from 'append-url';

// bootstrap: 引入自定义的样式主题
import 'fower-preset-miaoxing';

const login = async () => {
  if (process.env.TARO_ENV === 'h5') {
    return loginWechatOa();
  }

  // 1. 调用登录获取 code
  const res = await Taro.login();
  if (!res.code) {
    $.alert('微信登录失败：' + res.errMsg);
    return;
  }

  // 2. 去后台换为 OpenID，返回登录 token
  const {ret} = await $.http({
    url: $.apiUrl('wechat-mp/login'),
    method: 'post',
    // 跳过以免循环
    skipBeforeEvent: true,
    data: {
      code: res.code,
    },
  });
  if (ret.isErr()) {
    $.alert(ret.message);
    return;
  }

  // 3. 记录 token
  Taro.setStorageSync('token', ret.token);
};

/**
 * 微信服务号登录
 */
const loginWechatOa = async () => {
  if (!navigator.userAgent.includes('MicroMessenger')) {
    return;
  }

  if (Taro.getStorageSync('token')) {
    return;
  }

  const code = $.req('code');
  const state = $.req('state');

  // 授权回调
  if (code && typeof state !== 'undefined') {
    const {ret} = await $.post({
      url: $.apiUrl('wechat-oa/login'),
      data: {code, state, url: window.location.href},
    });
    if (ret.isSuc()) {
      Taro.setStorageSync('token', ret.token);
      const {code, state, ...params} = qs.parse(window.location.search);
      // 跳转移除当前地址中的 code 和 state 参数
      // noinspection ES6MissingAwait 实际不会 resolve
      Taro.redirectTo({
        url: appendUrl(window.location.pathname, params),
      });
      return;
    }

    if (ret.retryUrl) {
      window.location = ret.retryUrl;
    } else {
      $.alert(ret.message);
    }
    return;
  }

  // 跳转到授权地址
  const {ret} = await $.get($.apiUrl('wechat-oa/login', {url: window.location.href}));
  if (ret.isErr()) {
    // 忽略错误，例如未设置服务号
    return;
  }
  window.location = ret.url;
};

const bootstrap = async () => {
  // 设置请求接口的地址
  setApiUrl(config.apiUrl);

  // 请求登录
  const loginResult = login();
  setOnBeforeHttp(async () => {
    await loginResult;
  });
};

export default bootstrap;
