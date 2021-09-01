import '@mxjs/taro';
import login from './login.h5';
import Taro from '@tarojs/taro';
import $, {Ret} from 'miaoxing';
import {waitFor} from '@testing-library/react';

describe('login h5', () => {
  process.env.TARO_ENV = 'h5';
  const originalLocation = window.location;

  beforeEach(() => {
    delete window.location;
    window.location = {
      pathname: '',
      href: '',
    };

    let userAgent = jest.spyOn(window.navigator, 'userAgent', 'get');
    userAgent.mockReturnValue('MicroMessenger');
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  test('suc', async () => {
    process.env.TARO_ENV = 'h5';

    window.location.href = 'https://test.com/path?a=b';
    window.location.search = '?a=b';
    window.location.pathname = '/path';

    Taro.getStorageSync = jest.fn().mockReturnValue(null);

    $.req = jest.fn().mockReturnValueOnce('test-code')
      .mockReturnValueOnce('test-state');

    $.http = jest.fn().mockResolvedValueOnce({
      ret: Ret.suc({token: 'test-token'}),
    });

    Taro.setStorageSync = jest.fn();
    Taro.redirectTo = jest.fn();

    await login();
    await waitFor(() => {
      expect(Taro.redirectTo).toBeCalled();
    });

    expect(Taro.getStorageSync).toMatchSnapshot();
    expect($.req).toMatchSnapshot();
    expect($.http).toMatchSnapshot();
    expect(Taro.setStorageSync).toMatchSnapshot();
    expect(Taro.redirectTo).toMatchSnapshot();
  });

  test('token exists', async () => {
    Taro.getStorageSync = jest.fn().mockReturnValue('exists');

    await login();

    expect(Taro.getStorageSync).toMatchSnapshot();
  });

  test('redirect if no token', async () => {
    window.location.href = 'https://test.com/path?a=b';

    Taro.getStorageSync = jest.fn().mockReturnValue(null);

    $.http = jest.fn().mockResolvedValueOnce({
      ret: Ret.suc({
        url: 'https://open.weixin.qq.com/?redirect_uri=test',
      }),
    });

    await login();
    await waitFor(() => {
      expect($.http).toBeCalled();
    });

    expect(Taro.getStorageSync).toMatchSnapshot();
    expect($.http).toMatchSnapshot();
    expect(window.location).toBe('https://open.weixin.qq.com/?redirect_uri=test');
  });

  test('redirect if has code without state', async () => {
    window.location.href = 'https://test.com/path?a=b';

    Taro.getStorageSync = jest.fn().mockReturnValue(null);

    $.req = jest.fn().mockReturnValueOnce('test-code')
      .mockReturnValueOnce(undefined);

    $.http = jest.fn().mockResolvedValueOnce({
      ret: Ret.suc({
        url: 'https://open.weixin.qq.com/?redirect_uri=test',
      }),
    });

    await login();
    await waitFor(() => {
      expect($.http).toBeCalled();
    });

    expect(Taro.getStorageSync).toMatchSnapshot();
    expect($.http).toMatchSnapshot();
    expect(window.location).toBe('https://open.weixin.qq.com/?redirect_uri=test');
  });
});
