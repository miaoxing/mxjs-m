import ShippingFee from './ShippingFee';
import {render, waitFor} from '@testing-library/react';
import $, {Ret} from 'miaoxing';
import {createPromise, bootstrap} from '@mxjs/test';

bootstrap();

describe('ShippingFee', () => {
  test('basic', async () => {
    const promise = createPromise();

    $.http = jest.fn()
      .mockImplementationOnce(() => promise.resolve({
        ret: Ret.suc({
          data: {
            rules: [
              {
                startFee: '9.8',
                service: {
                  name: '快递',
                },
              },
            ],
          },
          city: '深圳',
        }),
      }));

    const {container} = render(<ShippingFee productId={1}/>);

    await waitFor(() => {
      expect(container.textContent).toContain('9.8');
    });

    expect(container).toMatchSnapshot();
    expect($.http).toMatchSnapshot();
  });

  test('without city', async () => {
    const promise = createPromise();

    $.http = jest.fn()
      .mockImplementationOnce(() => promise.resolve({
        ret: Ret.suc({
          data: {
            rules: [
              {
                startFee: '9.8',
                service: {
                  name: '快递',
                },
              },
            ],
          },
          city: '',
        }),
      }));

    const {container} = render(<ShippingFee productId={1}/>);

    await waitFor(() => {
      expect(container.textContent).toContain('9.8');
    });

    expect(container).toMatchSnapshot();
    expect($.http).toMatchSnapshot();
  });

  test('free shipping', async () => {
    const promise = createPromise();

    $.http = jest.fn()
      .mockImplementationOnce(() => promise.resolve({
        ret: Ret.suc({
          data: {
            isFreeShipping: true,
            rules: [],
          },
          city: '广州',
        }),
      }));

    const {container} = render(<ShippingFee productId={1}/>);

    await waitFor(() => {
      expect(container.textContent).toContain('包邮');
    });

    expect(container).toMatchSnapshot();
    expect($.http).toMatchSnapshot();
  });

  test('start fee 0', async () => {
    const promise = createPromise();

    $.http = jest.fn()
      .mockImplementationOnce(() => promise.resolve({
        ret: Ret.suc({
          data: {
            isFreeShipping: false,
            rules: [
              {
                startFee: 0,
                service: {
                  name: '快递',
                },
              },
            ],
          },
          city: '北京',
        }),
      }));

    const {container} = render(<ShippingFee productId={1}/>);

    await waitFor(() => {
      expect(container.textContent).toContain('￥0');
    });

    expect(container).toMatchSnapshot();
    expect($.http).toMatchSnapshot();
  });
});
