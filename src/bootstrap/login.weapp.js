import Taro from '@tarojs/taro';
import $ from 'miaoxing';

export default async () => {
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
