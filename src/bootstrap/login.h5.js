import Taro from '@tarojs/taro';
import $ from 'miaoxing';
import qs from 'query-string';
import appendUrl from 'append-url';

/**
 * 微信服务号登录
 *
 * 暂未支持非微信环境
 */
export default async () => {
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
      const {code: codeIgnore, state: stateIgnore, ...params} = qs.parse(window.location.search);
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
