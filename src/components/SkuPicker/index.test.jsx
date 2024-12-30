import SkuPicker from './index';
import {render, fireEvent, waitFor} from '@testing-library/react';
import Taro from '@tarojs/taro';
import {bootstrap, createPromise} from '@mxjs/test';
import $, {Ret} from 'miaoxing';
import {reset} from 'use-uid';
import {init} from 'taro-test';
import {createProduct, createSingleSkuProduct} from '../../tests/utils';

init();

bootstrap();

describe('SkuPicker', () => {
  beforeEach(() => {
    reset();
  });

  test('basic', async () => {
    const {container} = render(<SkuPicker product={createSingleSkuProduct()}/>);

    expect(container).toMatchSnapshot();
  });

  test('close', () => {
    const handleClose = jest.fn();
    const {getByText} = render(<SkuPicker isOpened={true} onClose={handleClose} product={createSingleSkuProduct()}/>);

    const close = getByText('×');
    fireEvent.click(close);

    expect(handleClose).toBeCalledTimes(1);
    expect(handleClose.mock.calls).toMatchSnapshot();
  });

  test('preview image', () => {
    const {container} = render(<SkuPicker product={createSingleSkuProduct()}/>);

    // 点击查看图片
    const image = container.querySelector('taro-image-core');

    Taro.previewImage = jest.fn();

    fireEvent.click(image);
    expect(Taro.previewImage).toBeCalled();
    expect(Taro.previewImage.mock.calls).toMatchSnapshot();
  });

  test('hide default spec', () => {
    const product = createSingleSkuProduct({
      spec: {
        isDefault: true,
      },
    });

    const {queryByText} = render(<SkuPicker product={product}/>);

    expect(queryByText('默认')).toBeNull();
  });

  test('default selected if only one spec value', () => {
    const {getByText} = render(<SkuPicker product={createSingleSkuProduct()}/>);

    const first = getByText('默认值');

    expect(first.className).toContain('active');
  });

  test('dont disable sold out spec if selected', () => {
    const {getByText} = render(<SkuPicker product={createProduct()} selectedValueIds={[1, 3]}/>);

    // 选中的规格，不禁用
    const size = getByText('S');
    expect(size.className).toContain('active');
    expect(size.className).not.toContain('disabled');

    // 取消选择后，被禁用
    fireEvent.click(size);
    expect(size.className).toContain('disabled');

    // 再次点击，不能选中，依然是禁用状态
    fireEvent.click(size);
    expect(size.className).not.toContain('active');
    expect(size.className).toContain('disabled');
  });

  test('maxOrderQuantity', () => {
    const {queryByText} = render(<SkuPicker product={createProduct({maxOrderQuantity: 11})}/>);

    expect(queryByText(/每人限购 11 件/)).not.toBeNull();
  });

  test('select spec', async () => {
    const {container, getByText, queryByText, findByText} = render(<SkuPicker product={createProduct()}/>);

    expect(queryByText('9 ~ 14')).not.toBeNull();
    expect(queryByText(/剩下(\s+)21(\s+)件/)).not.toBeNull();

    const stepper = container.querySelector('.mx-stepper-input');

    // TODO Error: The given element does not have a value setter
    // fireEvent.change(stepper, {target: {value: '7'}});
    const plus = container.querySelector('.mx-stepper-plus');
    for (let i = 1; i < 7; i++) {
      fireEvent.click(plus);
    }
    expect(stepper.value).toBe(7);

    const sizeS = getByText('S');
    fireEvent.click(sizeS);
    expect(sizeS.className).toContain('active');
    expect(queryByText('9 ~ 11')).not.toBeNull();
    expect(queryByText(/剩下(\s+)6(\s+)件/)).not.toBeNull();
    expect(stepper.value).toBe(6);

    // S 红色 无货
    const colorRed = getByText('红色');
    expect(colorRed.className).toContain('disabled');

    const colorBlue = getByText('蓝色');
    fireEvent.click(colorBlue);
    expect(colorBlue.className).toContain('active');
    await findByText('11');
    expect(queryByText(/剩下(\s+)6(\s+)件/)).not.toBeNull();

    const sizeM = getByText('M');
    fireEvent.click(sizeM);
    expect(sizeM.className).toContain('active');
    expect(sizeS.className).not.toContain('active');
    await waitFor(() => expect(colorRed.className).not.toContain('disabled'));
    expect(queryByText('14')).not.toBeNull();
    expect(queryByText(/剩下(\s+)8(\s+)件/)).not.toBeNull();
  });

  test('create cart', async () => {
    $.http = jest.fn()
      .mockImplementationOnce(() => new Promise(resolve => resolve({
        ret: Ret.suc(),
      })));

    const handleClose = jest.fn();

    const promise = createPromise();
    const handleAfterRequest = jest.fn()
      .mockImplementationOnce(() => promise.resolve());

    const {container, getByText} = render(<SkuPicker
      product={createProduct()}
      action="createCart"
      onClose={handleClose}
      onAfterRequest={handleAfterRequest}
    />);

    const sizeS = getByText('S');
    fireEvent.click(sizeS);

    const colorBlue = getByText('蓝色');
    fireEvent.click(colorBlue);

    const plus = container.querySelector('.mx-stepper-plus');
    fireEvent.click(plus);

    const btn = getByText('加入购物车');
    fireEvent.click(btn);

    await promise;

    expect(container).toMatchSnapshot();
    expect($.http).toMatchSnapshot();
    expect(handleClose).toMatchSnapshot();
    expect(handleAfterRequest).toMatchSnapshot();
  });

  test('update cart', async () => {
    $.http = jest.fn()
      .mockImplementationOnce(() => new Promise(resolve => resolve({
        ret: Ret.suc(),
      })));

    const handleClose = jest.fn();

    const promise = createPromise();
    const handleAfterRequest = jest.fn()
      .mockImplementationOnce(() => promise.resolve());

    const {container, getByText} = render(<SkuPicker
      product={createProduct()}
      action="updateCart"
      cartId={1}
      selectedValueIds={[2, 3]}
      quantity={3}
      onClose={handleClose}
      onAfterRequest={handleAfterRequest}
    />);

    const plus = container.querySelector('.mx-stepper-plus');
    fireEvent.click(plus);

    const btn = getByText('确 定');
    fireEvent.click(btn);

    await promise;

    expect(container).toMatchSnapshot();
    expect($.http).toMatchSnapshot();
    expect(handleClose).toMatchSnapshot();
    expect(handleAfterRequest).toMatchSnapshot();
  });

  test('create order', async () => {
    Taro.navigateTo = jest.fn();

    const promise = createPromise();
    const handleClose = jest.fn()
      .mockImplementationOnce(() => promise.resolve());

    const {container, getByText} = render(<SkuPicker
      product={createProduct()}
      action="createOrder"
      onClose={handleClose}
    />);

    const sizeS = getByText('S');
    fireEvent.click(sizeS);

    const colorBlue = getByText('蓝色');
    fireEvent.click(colorBlue);

    const plus = container.querySelector('.mx-stepper-plus');
    fireEvent.click(plus);

    const btn = getByText('立即购买');
    fireEvent.click(btn);

    await promise;

    expect(container).toMatchSnapshot();
    expect(Taro.navigateTo).toMatchSnapshot();
    expect(handleClose).toMatchSnapshot();
  });

  test('show unselected tips', async () => {
    $.err = jest.fn();

    const promise = createPromise();
    $.http = jest.fn()
      .mockImplementationOnce(() => promise.resolve({
        ret: Ret.suc(),
      }));

    const {getByText} = render(<SkuPicker
      product={createProduct()}
      action="createCart"
    />);

    const btn = getByText('加入购物车');
    fireEvent.click(btn);

    const sizeS = getByText('S');
    fireEvent.click(sizeS);
    fireEvent.click(btn);

    const colorBlue = getByText('蓝色');
    fireEvent.click(colorBlue);

    fireEvent.click(btn);

    await promise;

    expect($.http).toMatchSnapshot();
    expect($.err).toMatchSnapshot();
  });
});
