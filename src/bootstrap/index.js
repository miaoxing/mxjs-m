import {setApiUrl, setOnBeforeHttp} from '@mxjs/taro';
import '@/components/Page';
// bootstrap: 引入自定义的样式主题
import 'fower-preset-miaoxing';
import login from './login';
import config from '../../../config';

// 允许修改构建包根目录下 config.js 来配置接口地址
let userConfig = {};
if (process.env.TARO_ENV === 'weapp') {
  // eslint-disable-next-line no-undef
  userConfig = __non_webpack_require__('./config.js');
}

const bootstrap = async () => {
  // 设置请求接口的地址
  setApiUrl(userConfig.baseApiUrl || config.url.baseApiUrl);

  // 请求登录
  const loginResult = login();
  setOnBeforeHttp(async () => {
    await loginResult;
  });
};

export default bootstrap;
