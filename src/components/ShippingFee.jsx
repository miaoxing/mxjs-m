import $ from 'miaoxing';
import {useEffect, useState} from 'react';
import {Text} from '@fower/taro';
import PropTypes from 'prop-types';

const ShippingFee = ({productId}) => {
  const [shippingTpl, setShippingTpl] = useState();

  useEffect(() => {
    $.http({
      url: $.apiUrl('products/%s/shipping-tpl?filterRulesByCity=1', productId),
    }).then(({ret}) => {
      if (ret.isErr()) {
        return;
      }
      setShippingTpl(ret);
    });
  }, [productId]);

  if (!shippingTpl) {
    return <Text/>;
  }

  let fee = '';
  if (shippingTpl.data.isFreeShipping) {
    fee = '包邮';
  } else {
    const rule = shippingTpl.data.rules[0];
    fee = rule.service.name + '：￥' + rule.startFee;
  }

  return (
    <Text>
      {shippingTpl.city && `到${shippingTpl.city}`}
      {' '}
      {fee}
    </Text>
  );
};

ShippingFee.propTypes = {
  productId: PropTypes.number.isRequired,
};

export default ShippingFee;
