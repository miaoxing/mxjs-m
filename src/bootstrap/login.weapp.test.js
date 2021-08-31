import '@mxjs/taro';
import login from './login.weapp';
import Taro from '@tarojs/taro';
import $, {Ret} from 'miaoxing';
import {createPromise} from '@mxjs/test';
import {waitFor} from '@testing-library/react';

describe('login weapp', () => {
  test('suc', async () => {
    Taro.login = jest.fn().mockResolvedValueOnce({
      code: 'test-code',
    });

    $.http = jest.fn().mockResolvedValueOnce({
      ret: Ret.suc({token: 'test-token'}),
    });

    Taro.setStorageSync = jest.fn();

    await login();
    await waitFor(() => {
      expect(Taro.setStorageSync).toBeCalled();
    });

    expect(Taro.login.mock.calls).toMatchSnapshot();
    expect($.http.mock.calls).toMatchSnapshot();
    expect(Taro.setStorageSync.mock.calls).toMatchSnapshot();
  });

  test('Taro.login fail', async () => {
    const promise = createPromise();
    Taro.login = jest.fn().mockImplementationOnce(() => promise.resolve({
      errMsg: '测试登录失败',
    }));

    $.alert = jest.fn();

    await login();
    await promise;

    expect(Taro.login.mock.calls).toMatchSnapshot();
    expect($.alert.mock.calls).toMatchSnapshot();
  });

  test('HTTP fail', async () => {
    Taro.login = jest.fn().mockResolvedValueOnce({
      code: 'test-code',
    });

    const promise = createPromise();
    $.http = jest.fn().mockImplementationOnce(() => promise.resolve({
      ret: Ret.err('HTTP error'),
    }));

    $.alert = jest.fn();

    await login();
    await promise;

    expect(Taro.login.mock.calls).toMatchSnapshot();
    expect($.http.mock.calls).toMatchSnapshot();
    expect($.alert.mock.calls).toMatchSnapshot();
  });
});
