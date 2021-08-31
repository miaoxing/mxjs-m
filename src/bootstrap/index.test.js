import bootstrap from './index';
import Taro from '@tarojs/taro';
import $, {Ret} from 'miaoxing';
import {createPromise} from '@mxjs/test';
import {waitFor} from '@testing-library/react';

describe('bootstrap', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete window.location;
    window.location = {
      pathname: '',
      href: '',
    };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  test('login by mp', async () => {
    Taro.login = jest.fn().mockResolvedValueOnce({
      code: 'test-code',
    });

    $.http = jest.fn().mockResolvedValueOnce({
      ret: Ret.suc({token: 'test-token'}),
    });

    Taro.setStorageSync = jest.fn();

    await bootstrap();
    await waitFor(() => {
      expect(Taro.setStorageSync).toBeCalled();
    });

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

  test('login by wechat oa', async () => {
    process.env.TARO_ENV = 'h5';

    window.location.href = 'https://test.com/path?a=b';
    window.location.search = '?a=b';
    window.location.pathname = '/path';

    let userAgent = jest.spyOn(window.navigator, 'userAgent', 'get');
    userAgent.mockReturnValue('MicroMessenger');

    Taro.getStorageSync = jest.fn().mockReturnValue(null);

    $.req = jest.fn().mockReturnValueOnce('test-code')
      .mockReturnValueOnce('test-state');

    $.http = jest.fn().mockResolvedValueOnce({
      ret: Ret.suc({token: 'test-token'}),
    });

    Taro.setStorageSync = jest.fn();
    Taro.redirectTo = jest.fn();

    await bootstrap();
    await waitFor(() => {
      expect(Taro.redirectTo).toBeCalled();
    });

    expect(Taro.getStorageSync).toMatchSnapshot();
    expect($.req).toMatchSnapshot();
    expect($.http).toMatchSnapshot();
    expect(Taro.setStorageSync).toMatchSnapshot();
    expect(Taro.redirectTo).toMatchSnapshot();
  });
});
