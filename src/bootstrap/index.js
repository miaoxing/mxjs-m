import config from '@/config';
import {setApiUrl, setOnBeforeHttp} from '@mxjs/taro';
import Taro from '@tarojs/taro';
import $ from 'miaoxing';
import '@/components/Page';

// bootstrap: 引入自定义的样式主题
import 'fower-preset-miaoxing';

const login = async () => {
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
