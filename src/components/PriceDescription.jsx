import {useState} from 'react';
import {View, Text} from '@fower/taro';
import Icon from '@mxjs/m-icon';
import Divider from '@mxjs/m-divider';

const PriceDescription = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => {
    setShow(!show);
  };

  return (
    <View bgWhite p3>
      <Divider textSM mx4 toCenterY onClick={handleClick}>
        商品价格说明
        <Icon type={'arrow-' + (show ? 'up' : 'down')} ml1/>
      </Divider>
      {show && <View gray500 textSM leadingRelaxed>
        <View mb2>
          <Text gray900>划线价格：</Text>
          指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过的销售价等，并非原价，仅供参考。
        </View>
        <View>
          <Text gray900>未划线价格：</Text>
          指商品的销售标价，具体成交价格根据商品参加活动，或会员使用优惠券、积分等发生变化，最终以订单结算页价格为准。
        </View>
      </View>}
    </View>
  );
};

export default PriceDescription;
