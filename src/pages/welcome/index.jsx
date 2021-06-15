import {Component} from 'react';
import {View, Button, Image} from '@fower/taro';
import Taro from '@tarojs/taro';
import './index.scss';

export default class Index extends Component {
  navigateToIndex = () => {
    this.navigate('/pages/index/index');
  };

  navigateToDownload = () => {
    this.navigate('/pages/download/index');
  };

  navigate = (path) => {
    Taro.navigateToMiniProgram({
      appId: 'wxeaddb758dbfda2e7',
      path: path,
      extraData: {
        from: 'welcome',
      },
      // NOTE: 仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
      // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateToMiniProgram.html
      envVersion: 'develop',
    });
  };

  render() {
    return (
      <View toCenter h="100vh" flexDirection="column">
        <Image src="https://miaoxingyun.com/images/logo.svg?from=welcome" mb4 w32 h32/>
        <View mb8 textLG>欢迎使用喵星开源商城</View>
        <View>
          <Button class="mx-btn-index" inlineBlock bg="#FF4500" color="white" onClick={this.navigateToIndex}>
            访问官网
          </Button>
          <Button inlineBlock ml4 onClick={this.navigateToDownload}>下载源码</Button>
        </View>
      </View>
    );
  }
}
