import {render, waitFor, fireEvent} from '@testing-library/react';
import $, {Ret} from 'miaoxing';
import {createPromise, bootstrap, setUrl, resetUrl} from '@mxjs/test';
import Taro from '@tarojs/taro';
import {init} from 'taro-test';
import Show from './show';
import {createProduct} from '../../tests/utils';

init();
bootstrap();

describe('Show', () => {
  beforeEach(() => {
    setUrl('/products/show?id=1');
  });

  afterEach(() => {
    resetUrl();
  });

  test('basic', async () => {
    const product = createProduct();
    const promise = createPromise();
    const promise2 = createPromise();
    const promise3 = createPromise();

    $.http = jest.fn()
      .mockImplementationOnce(() => promise.resolve({
        ret: Ret.suc({
          data: createProduct(),
        }),
      }))
      .mockImplementationOnce(() => promise2.resolve({
        ret: Ret.suc({
          data: {
            count: 1,
          },
        }),
      }))
      .mockImplementationOnce(() => promise3.resolve({
        ret: Ret.suc({
          data: {
            isFreeShipping: true,
            rules: [],
          },
        }),
      }));

    const {container, getByText} = render(<Show />);

    await waitFor(() => {
      expect(getByText('包邮')).not.toBeNull();
    });

    expect(getByText(product.name)).not.toBeNull();

    expect(container).toMatchSnapshot();
    expect($.http).toMatchSnapshot();
  });

  test('action', async () => {
    const promise = createPromise();
    const promise2 = createPromise();
    const promise3 = createPromise();
    const promise4 = createPromise();

    $.http = jest.fn()
      .mockImplementationOnce(() => promise.resolve({
        ret: Ret.suc({
          data: createProduct(),
        }),
      }))
      .mockImplementationOnce(() => promise2.resolve({
        ret: Ret.suc({
          data: {
            count: 97,
          },
        }),
      }))
      .mockImplementationOnce(() => promise3.resolve({
        ret: Ret.suc({
          data: {
            isFreeShipping: true,
            rules: [],
          },
        }),
      }))
      .mockImplementationOnce(() => promise4.resolve({
        ret: Ret.suc({
          exists: false,
        }),
      }));

    const {container, getByText, findByText, findAllByText} = render(<Show />);

    await waitFor(() => {
      expect(getByText('包邮')).not.toBeNull();
    });

    // 点击查看图片
    const image = container.querySelector('taro-image-core');

    Taro.previewImage = jest.fn();

    fireEvent.click(image);
    expect(Taro.previewImage).toBeCalled();
    expect(Taro.previewImage.mock.calls).toMatchSnapshot();

    // 点击选择规格
    const selected = getByText('尺寸 / 颜色');
    fireEvent.click(selected);

    const skuValue1 = await findByText('M');
    fireEvent.click(skuValue1);

    const skuValue2 = await findByText('红色');
    fireEvent.click(skuValue2);

    // 加入购物车
    const createCarts = await findAllByText('加入购物车');
    fireEvent.click(createCarts[1]);

    await promise4;
    expect($.http).toMatchSnapshot();

    // 关闭后显示选中的规格
    await findByText('已选：M / 红色');

    // 购物车数量增加
    await findByText('98');
  });
});
