import {Image, Text, View} from '@fower/taro';
import * as MPage from '@mxjs/m-page';
import Taro, {getCurrentInstance} from '@tarojs/taro';
import $ from 'miaoxing';

const BasePage = MPage.default;

const handleClick = () => {
  const router = getCurrentInstance().router;
  const {$taroTimestamp, ...params} = router.params;
  Taro.navigateTo({
    url: $.url('welcome', {
      path: router.path,
      params,
    }),
  });
};

// eslint-disable-next-line react/prop-types
MPage.default = ({children, ...props}) => {
  return (
    <BasePage column {...props}>
      <View flex="1 0 auto">
        {children}
      </View>
      <View toCenter flexShrink="0" p4 column gray400 bgGray100 onClick={handleClick}>
        <View mb1 toCenter textLG leadingNone>
          <Image src="https://miaoxingyun.com/images/logo-gray.svg" mr1 w5 h5 />
          喵星
        </View>
        <Text textXS>喵星开源商城提供技术支持</Text>
      </View>
    </BasePage>
  );
};

export default MPage.default;
