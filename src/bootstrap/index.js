import {setApiUrl, setOnBeforeHttp} from '@mxjs/taro';
import '@/components/Page';
// bootstrap: 引入自定义的样式主题
import 'fower-preset-miaoxing';
import login from './login';
import config from '../../../config';

const bootstrap = async () => {
  // 设置请求接口的地址
  setApiUrl(config.url.baseApiUrl);

  // 请求登录
  const loginResult = login();
  setOnBeforeHttp(async () => {
    await loginResult;
  });
};

export default bootstrap;
