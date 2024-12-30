/**
 * @experimental 可能移到其他位置
 */
import _ from 'lodash';
import {Ret} from 'miaoxing';

export const createSingleSkuProduct = (product) => {
  return _.merge({
    id: 1,
    name: 'alias commodi ipsam',
    intro: 'consequatur officia sequi',
    minPrice: '9',
    minMarketPrice: '10',
    minScore: 0,
    stockNum: 21,
    soldNum: 0,
    image: 'https://dev.test.com/uploads/1/210610/002439539409.png',
    startAt: '2021-06-24 11:17:00',
    endAt: null,
    maxOrderQuantity: 0,
    isAllowAddCart: true,
    isAllowCoupon: true,
    isRequireAddress: true,
    isAllowComment: true,
    deletedAt: null,
    images: [
      {
        url: 'https://dev.test.com/uploads/1/210610/002439539409.png',
        description: '',
      },
      {
        url: 'https://dev.test.com/uploads/1/210610/000924427937.jpg',
        description: '',
      },
      {
        url: 'https://dev.test.com/uploads/1/210610/000918792585.jpg',
        description: '',
      },
      {
        url: 'https://dev.test.com/uploads/1/210610/002904468645.png',
        description: '',
      },
    ],
    detail: {
      content: '<p><img src="https://dev.test.com/uploads/images/20210528/1622199614338752.png" alt="14 - 3 (2).png"/></p><p>Alice: he had a cons<span style="color: #548DD4;">ultation about this, and after a few minutes it puffed away without speaking, but at any r</span>ate,&#39; sai<span style="background-color: #F79646;">d Alice: &#39;allo</span>w me to introduce it.&#39; &#39;I don&#39;t know what a long way. So they got.</p>',
    },
    spec: {
      isDefault: false,
      specs: [
        {
          id: 1,
          name: '默认规格',
          values: [
            {
              id: 2,
              name: '默认值',
            },
          ],
        },
      ],
    },
    skus: [
      {
        id: 1,
        specValueIds: [2],
        stockNum: 21,
      },
    ],
    configs: {
      unit: '件',
    },
    createCartOrOrder: Ret.suc({
      createCart: Ret.suc(),
      createOrder: Ret.suc(),
    }),
  }, product);
};

export const createProduct = (product) => {
  return {
    ...createSingleSkuProduct(product),
    spec: {
      specs: [
        {
          id: 1,
          name: '尺寸',
          values: [
            {id: 1, name: 'S'},
            {id: 2, name: 'M'},
          ],
        },
        {
          id: 2,
          name: '颜色',
          values: [
            {id: 3, name: '红色'},
            {id: 4, name: '蓝色'},
          ],
        },
      ],
    },
    skus: [
      {
        id: 1,
        specValueIds: [1, 3],
        price: '9',
        marketPrice: '10',
        score: 0,
        stockNum: 0,
        soldNum: 0,
        image: '',
      },
      {
        id: 2,
        specValueIds: [1, 4],
        price: '11',
        marketPrice: '12',
        score: 0,
        stockNum: 6,
        soldNum: 0,
        image: '',
      },
      {
        id: 3,
        specValueIds: [2, 3],
        price: '12',
        marketPrice: '13',
        score: 0,
        stockNum: 7,
        soldNum: 0,
        image: '',
      },
      {
        id: 4,
        specValueIds: [2, 4],
        price: '14',
        marketPrice: '15',
        score: 0,
        stockNum: 8,
        soldNum: 0,
        image: '',
      },
    ],
  };
};
