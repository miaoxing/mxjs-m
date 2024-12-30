import ActionButtonGroup from './ActionButtonGroup';
import {fireEvent, render} from '@testing-library/react';
import {Ret} from 'miaoxing';

describe('ActionButtonGroup', () => {
  test('basic', async () => {
    const handleClick = jest.fn();
    const {container, queryByText} = render(
      <ActionButtonGroup
        ret={Ret.suc({
          createCart: Ret.suc(),
          createOrder: Ret.suc(),
        })}
        onClick={handleClick}
      />,
    );
    expect(container).toMatchSnapshot();

    const createCart = queryByText('加入购物车');
    fireEvent.click(createCart);

    const createOrder = queryByText('立即购买');
    fireEvent.click(createOrder);

    expect(handleClick).toMatchSnapshot();
  });

  test('hide create cart', () => {
    const {container} = render(
      <ActionButtonGroup
        ret={Ret.suc({
          createCart: Ret.err('err'),
          createOrder: Ret.suc(),
        })}
        onClick={() => {
        }}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  test('hide create order', () => {
    const {container} = render(
      <ActionButtonGroup
        ret={Ret.suc({
          createCart: Ret.suc(),
          createOrder: Ret.err('err'),
        })}
        onClick={() => {
        }}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  test('update cart', () => {
    const handleClick = jest.fn();

    const {container, queryByText} = render(
      <ActionButtonGroup
        action="updateCart"
        ret={Ret.suc({
          createCart: Ret.suc(),
          createOrder: Ret.suc(),
        })}
        onClick={handleClick}
      />,
    );
    expect(container).toMatchSnapshot();

    const button = queryByText('确 定');
    fireEvent.click(button);
    expect(handleClick).toMatchSnapshot();
  });

  test('error', () => {
    const {container} = render(
      <ActionButtonGroup
        ret={Ret.err({
          message: '商品已下架',
          createCart: Ret.err({
            message: '商品已下架',
            shortMessage: '已下架',
          }),
          createOrder: Ret.err('err'),
        })}
        onClick={() => {
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
