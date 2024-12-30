import {useEffect, useState} from 'react';
import {Image, Text, View} from '@fower/taro';
import {Block} from '@tarojs/components';
import {AtFloatLayout} from 'taro-ui';
import './index.scss';
import clsx from 'clsx';
import $ from 'miaoxing';
import Taro from '@tarojs/taro';
import FooterBar from '@mxjs/m-footer-bar';
import ActionButtonGroup from '../ActionButtonGroup';
import Stepper from '@mxjs/m-stepper';
import PropTypes from 'prop-types';
import useUid from 'use-uid';

const contains = function (container, array) {
  for (const el of array) {
    if (!container.includes(el)) {
      return false;
    }
  }
  return true;
};

const getRange = (skus, key) => {
  if (skus.length === 1) {
    return skus[0][key];
  }

  let min = parseFloat(skus[0][key]);
  let max = min;
  skus.forEach(sku => {
    const value = parseFloat(sku[key]);
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  });

  if (min === max) {
    return min;
  } else {
    return min + ' ~ ' + max;
  }
};

const getPrice = function (validSkus) {
  let price = getRange(validSkus, 'price');
  let score = getRange(validSkus, 'score');

  return (
    <Block>
      {!!price && <Text textXs>￥</Text>}
      {!!price && price}
      {price && score ? ' + ' : ''}
      {!!score && score + '积分'}
    </Block>
  );
};

// TODO 简化
const calSoldOutValueIds = function (skus, ids = []) {
  // 1. 找出所有售罄的规格值编号
  const valueStockNums = {};
  skus.forEach(sku => {
    sku.specValueIds.forEach(valueId => {
      if (!valueStockNums[valueId]) {
        valueStockNums[valueId] = 0;
      }
      valueStockNums[valueId] += sku.stockNum;
    });
  });

  let soldOutValueIds = [];
  for (const valueId in valueStockNums) {
    if (valueStockNums[valueId] === 0) {
      soldOutValueIds.push(parseInt(valueId, 10));
    }
  }

  // 2. 找出选中后，剩下的是售罄的规则值编号
  if (ids.length) {
    skus.forEach(sku => {
      if (sku.stockNum !== 0) {
        return;
      }
      ids.forEach(id => {
        if (sku.specValueIds.includes(id)) {
          sku.specValueIds.forEach(valueId => {
            if (valueId === id) {
              return;
            }
            soldOutValueIds.push(valueId);
          });
        }
      });
    });
  }

  return soldOutValueIds;
};

const generateSelectedText = (product, selectedValueIds) => {
  const requiredSpecNames = [];
  const selectedValueNames = [];
  product.spec.specs.map(spec => {
    if (!selectedValueIds[spec.id]) {
      requiredSpecNames.push(spec.name);
      return;
    }
    spec.values.forEach(value => {
      if (value.id === selectedValueIds[spec.id]) {
        selectedValueNames.push(value.name);
      }
    });
  });

  // 还有规格没选完，提示没选完的规格名称
  if (requiredSpecNames.length) {
    return requiredSpecNames.join(' / ');
  }

  // 全部规格选完，提示已选的规格值
  return '已选：' + selectedValueNames.join(' / ');
};

/**
 * 通过规格值数组，计算出规格值对象
 */
const calSelectedValueIds = (product, ids) => {
  const selectedValueIds = {};

  // 如果只有一个规格，默认选中
  if (ids.length === 0 && product.spec.specs.length === 1) {
    const spec = product.spec.specs[0];
    selectedValueIds[spec.id] = spec.values[0].id;
    return selectedValueIds;
  }

  product.spec.specs.forEach(spec => {
    spec.values.forEach(value => {
      if (ids.includes(value.id)) {
        selectedValueIds[spec.id] = value.id;
      }
    });
  });
  return selectedValueIds;
};

const useStateWithDep = (defaultValue, dep) => {
  const hasDep = typeof dep !== 'undefined';
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(hasDep ? defaultValue() : defaultValue);
  }, [JSON.stringify(hasDep ? dep : defaultValue)]);
  return [value, setValue];
};

const SkuPicker = (
  {
    product,
    isOpened,
    onClose,
    action,
    quantity: quantityProp = 1,
    selectedValueIds: selectedValueIdsProp = [],
    cartId,
    onAfterSelectSpec,
    onAfterRequest,
  },
) => {
  // 当前可购买的数量
  const [stockNum, setStockNum] = useState();

  // 当前的价格范围
  const [price, setPrice] = useState();

  // 购买的数量
  const [quantity, setQuantity] = useStateWithDep(quantityProp);

  // 当前选中的规格值编号
  const [selectedValueIds, setSelectedValueIds] = useStateWithDep(() => {
    return calSelectedValueIds(product, selectedValueIdsProp);
  }, selectedValueIdsProp);

  // 选中所有规格后计算出的 SKU 编号
  const [skuId, setSkuId] = useState();

  // 售罄的规格值编号
  const [soldOutValueIds, setSoldOutValueIds] = useState(() => calSoldOutValueIds(product.skus));

  // 选择/取消选择规格值
  const selectValueId = (i, valueId) => {
    const isUnselect = selectedValueIds[i] === valueId;

    // 允许取消选择，但不可选中已售罄的规格值
    if (!isUnselect && soldOutValueIds.includes(valueId)) {
      return;
    }

    if (isUnselect) {
      delete selectedValueIds[i];
    } else {
      selectedValueIds[i] = valueId;
    }
    setSelectedValueIds({...selectedValueIds});
  };

  const handleClose = () => {
    onClose && onClose();
  };

  // 预设接口允许外部调用
  const api = {};

  api.generateSelectedText = () => {
    return generateSelectedText(product, selectedValueIds);
  };

  api.createCart = async () => {
    const {ret} = await $.post({
      url: $.apiUrl('carts'),
      data: {
        skuId,
        quantity,
      },
    });

    $.ret(ret);
    ret.isSuc() && handleClose();
    onAfterRequest && onAfterRequest(ret);
  };

  api.updateCart = async () => {
    const {ret} = await $.patch({
      url: $.apiUrl('carts/%s', cartId),
      data: {
        skuId,
        quantity,
      },
    });

    $.ret(ret);
    ret.isSuc() && handleClose();
    onAfterRequest && onAfterRequest(ret);
  };

  api.createOrder = () => {
    handleClose();
    Taro.navigateTo({
      url: $.url('orders/new', {skuId, quantity}),
    });
  };

  // 选择规格后，更新 SKU 编号, 库存数量，价格文案等
  useEffect(() => {
    const ids = Object.values(selectedValueIds);

    let stockNum = 0;
    let validSkus = [];
    if (ids.length === 0) {
      stockNum = product.stockNum;
      validSkus = product.skus;
    } else {
      product.skus.forEach(sku => {
        if (contains(sku.specValueIds, ids)) {
          stockNum += sku.stockNum;
          validSkus.push(sku);
        }
      });
    }

    setSkuId(validSkus.length === 1 ? validSkus[0].id : null);
    setSoldOutValueIds(calSoldOutValueIds(product.skus, ids));
    setStockNum(stockNum);
    setQuantity(stockNum < quantity ? stockNum : quantity);
    setPrice(getPrice(validSkus));
    onAfterSelectSpec && onAfterSelectSpec(api);
  }, [JSON.stringify(selectedValueIds)]);

  // 计算和底部操作按钮的距离，手机宽 375 时，距离为 56
  const cls = useUid('__sku-picker-footer-bar-');
  const [footerBarHeight, setFooterBarHeight] = useState(56);
  useEffect(() => {
    setTimeout(() => {
      const query = Taro.createSelectorQuery();
      query.select('.' + cls).boundingClientRect(rect => {
        if (!rect) {
          return;
        }

        setFooterBarHeight(rect.height + 'px');
      }).exec();
    });
  }, []);

  // 检查规格是否已选完
  const check = () => {
    for (const spec of product.spec.specs) {
      if (!selectedValueIds[spec.id]) {
        $.err('请选择' + spec.name);
        return false;
      }
    }
    return true;
  };

  const handleClickButton = (action) => {
    if (!check()) {
      return;
    }
    if (action === 'createCart') {
      api.createCart();
    } else if (action === 'updateCart') {
      api.updateCart();
    } else {
      api.createOrder();
    }
  };

  const handlePreviewImage = () => {
    Taro.previewImage({
      urls: [product.image],
    });
  };

  const unit = product.configs.unit || '件';

  return (
    <AtFloatLayout isOpened={isOpened} onClose={handleClose} className="sku-picker">
      <View m3 toBetween>
        <View flex>
          <Image w16 h16 rounded1 overflowHidden src={product.image} onClick={handlePreviewImage}/>
          <View mx2 textBase brand500 alignSelf="flex-end">
            {price}
          </View>
        </View>
        <View text3XL fontHairline mt="-1rem" gray500 onClick={handleClose}>&times;</View>
      </View>

      <View maxH="60vh" overflowYScroll mb={footerBarHeight}>
        {!product.spec.isDefault && <View m3 column className="border-b">
          {product.spec.specs.map((spec) => {
            return (
              <View key={spec.id} className="sku-picker-spec-item">
                <View className="sku-picker-spec-name">{spec.name}</View>
                <View>
                  {spec.values.map(value => {
                    const active = selectedValueIds[spec.id] === value.id;
                    return (
                      <Text
                        key={value.id}
                        className={clsx('sku-picker-spec-value', {
                          active,
                          // 购物车中，售罄时，不禁用已选中的规格
                          disabled: !active && soldOutValueIds.includes(value.id),
                        })}
                        onClick={selectValueId.bind(this, spec.id, value.id)}
                      >
                        {value.name}
                      </Text>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>}

        <View m3 toCenterY toBetween>
          <Text mr2 textSM css={{whiteSpace: 'nowrap'}}>数量</Text>
          <View toCenterY toBetween>
            <Text gray500 textXS mr2>
              {product.maxOrderQuantity > 0 && `每人限购 ${product.maxOrderQuantity} ${unit}`}
              {' '}
              剩下 {stockNum} {unit}
            </Text>
            {' '}
            <Stepper value={quantity} onChange={setQuantity} min={1} max={stockNum}/>
          </View>
        </View>
      </View>

      <FooterBar className={cls}>
        <ActionButtonGroup ret={product.createCartOrOrder} action={action} onClick={handleClickButton}/>
      </FooterBar>
    </AtFloatLayout>
  );
};

SkuPicker.propTypes = {
  product: PropTypes.object.isRequired,
  isOpened: PropTypes.bool,
  onClose: PropTypes.func,
  action: PropTypes.string,
  quantity: PropTypes.number,
  selectedValueIds: PropTypes.arrayOf(PropTypes.number),
  cartId: PropTypes.number,
  onAfterSelectSpec: PropTypes.func,
  onAfterRequest: PropTypes.func,
};

export default SkuPicker;
