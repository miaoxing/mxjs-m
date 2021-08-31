import config from '@/config';
import {setApiUrl, setOnBeforeHttp} from '@mxjs/taro';
import '@/components/Page';
import login from './login';

// bootstrap: 引入自定义的样式主题
import 'fower-preset-miaoxing';

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
