import bootstrap from './index';
import Taro from '@tarojs/taro';
import $, {Ret} from 'miaoxing';
import {createPromise} from '@mxjs/test';

describe('bootstrap', () => {
  test('login by mp', async () => {
    Taro.login = jest.fn().mockResolvedValueOnce({
      code: 'test-code',
    });

    $.http = jest.fn().mockResolvedValueOnce({
      ret: Ret.suc({token: 'test-token'}),
    });
    
    const promise = createPromise();
    Taro.setStorageSync = jest.fn().mockImplementationOnce(() => promise.resolve());

    await bootstrap();
    await promise;

    expect(Taro.login.mock.calls).toMatchSnapshot();
    expect($.http.mock.calls).toMatchSnapshot();
    expect(Taro.setStorageSync.mock.calls).toMatchSnapshot();
  });

  test('login by mp: Taro login fail', async () => {
    const promise = createPromise();
    Taro.login = jest.fn().mockImplementationOnce(() => promise.resolve({
      errMsg: '登录失败',
    }));

    $.alert = jest.fn();

    await bootstrap();
    await promise;

    expect(Taro.login.mock.calls).toMatchSnapshot();
    expect($.alert.mock.calls).toMatchSnapshot();
  });

  test('login by mp: HTTP fail', async () => {
    Taro.login = jest.fn().mockResolvedValueOnce({
      code: 'test-code',
    });

    const promise = createPromise();
    $.http = jest.fn().mockImplementationOnce(() => promise.resolve({
      ret: Ret.err('HTTP error'),
    }));

    $.alert = jest.fn();

    await bootstrap();
    await promise;

    expect(Taro.login.mock.calls).toMatchSnapshot();
    expect($.http.mock.calls).toMatchSnapshot();
    expect($.alert.mock.calls).toMatchSnapshot();
  });
});
