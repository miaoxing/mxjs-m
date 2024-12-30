import { Component } from 'react';
import { View, Text, Swiper, SwiperItem, Image, Block } from '@fower/taro';
import './show.scss';
import Taro from '@tarojs/taro';
import Icon from '@mxjs/m-icon';
import $ from 'miaoxing';
import { AtBadge } from 'taro-ui';
import RichText from '@mxjs/m-rich-text';
import Page from '@mxjs/m-page';
import Card from '@mxjs/m-card';
import Button from '@mxjs/m-button';
import FooterBar from '@mxjs/m-footer-bar';
import Divider from '@mxjs/m-divider';
import PriceDescription from '@/components/PriceDescription';
import ShippingFee from '@/components/ShippingFee';
import SkuPicker from '@/components/SkuPicker';
import ActionButtonGroup from '@/components/ActionButtonGroup';
import { List, ListItem, ListDetail } from '@mxjs/m-list';
import Ret from '@mxjs/m-ret';

export default class Products extends Component {
  state = {
    isOpened: false,
    selectedText: '',
    action: '',

    ret: {},
    cartCount: null,
  };

  componentDidMount() {
    $.http({
      url: $.apiUrl('products/%s?include=detail', $.req('id')),
      ignoreError: true,
    }).then(({ ret }) => {
      if (ret.isErr()) {
        $.ret(ret);
        return;
      }

      this.setState({
        ret,
        selectedText: ret.data.spec.specs.map(spec => spec.name).join(' / '),
      });
    }).catch(e => {
      if (e.res.statusCode === 404) {
        e.res.data.message = '商品已失效';
      }
      this.setState({
        ret: e.res.data,
      });
    });

    $.http({
      url: $.apiUrl('carts/count'),
    }).then(({ ret }) => {
      if (ret.isErr()) {
        return;
      }
      this.setState({ cartCount: ret.data.count });
    });
  }

  onShareAppMessage() {
    return {
      title: this.state.ret.data.name,
      imageUrl: this.state.ret.data.image,
    };
  }

  handleOpen = (action) => {
    this.setState({
      isOpened: true,
      action,
    });
  };

  handleClose = () => {
    this.setState({ isOpened: false });
  };

  handlePreviewImages = (url) => {
    Taro.previewImage({
      urls: this.state.ret.data.images.map(image => image.url),
      current: url,
    });
  };

  handleAfterSelectSpec = (api) => {
    this.setState({ selectedText: api.generateSelectedText() });
  };

  handleAfterRequest = (ret) => {
    if (ret.exists === false) {
      this.setState({ cartCount: this.state.cartCount + 1 });
    }
  };

  render() {
    const { data = {} } = this.state.ret;
    const createCartOrOrder = data.createCartOrOrder;

    return (
      <Page>
        <Ret ret={this.state.ret}>
          {data.id && <Block>
            <Swiper
              h="100vw"
              bgWhite
              circular
              indicatorDots
              autoplay
              indicatorColor="rgba(0, 0, 0, .1)"
              indicatorActiveColor="rgba(0, 0, 0, .3)"
            >
              {data.images.map((image) => (
                <SwiperItem key={image.url}>
                  <Image w="100%" h="100%" src={image.url} mode="aspectFit"
                         onClick={this.handlePreviewImages.bind(this, image.url)}/>
                </SwiperItem>
              ))}
            </Swiper>

            <Card body>
              <View>
                <Text textXL brand500>
                  <Text textXS>￥</Text>{data.minPrice}
                </Text>
                {!!data.minMarketPrice && <Text gray500 textXS ml2>
                  价格:￥<Text lineThrough>{data.minMarketPrice}</Text>
                </Text>}
              </View>
              <View toBetween toCenterY>
                <View mr1>
                  <View textLG>
                    {data.name}
                  </View>
                  <View textXS gray500>
                    {data.intro}
                  </View>
                </View>
                <Button openType="share" p0 m0 toCenter column flexShrink="0" gray500 bgTransparent leadingNone>
                  <Icon type="share" mb1/>
                  <Text textXS>分享</Text>
                </Button>
              </View>
            </Card>

            <Card px1 py2>
              <List size="sm" borderless textSm>
                {!data.spec.isDefault && <ListItem
                  description="left"
                  title="选择"
                  arrow={<Icon type="arrow-right"/>}
                >
                  <ListDetail onClick={this.handleOpen.bind(this, '')}>
                    {this.state.selectedText}
                  </ListDetail>
                </ListItem>}
                <ListItem className="mx-list-item-3"
                          description="left"
                          title="发货"
                >
                  <ListDetail toBetween>
                    <ShippingFee productId={data.id}/>
                    <Text gray400>销量 {data.soldNum}</Text>
                  </ListDetail>
                </ListItem>
              </List>
            </Card>

            <Divider textSM mx4>商品详情</Divider>
            <View bgWhite>
              <RichText>{data.detail.content}</RichText>
            </View>

            <PriceDescription/>

            <FooterBar>
              <FooterBar.Icon href={$.url()}>
                <Icon type="home" textBase/>
                店铺
              </FooterBar.Icon>
              <FooterBar.Icon href={$.url('carts?x=y')}>
                <AtBadge value={this.state.cartCount || null} className="cart-num">
                  <Icon type="cart" textBase/>
                </AtBadge>
                购物车
              </FooterBar.Icon>
              <ActionButtonGroup ret={createCartOrOrder} onClick={this.handleOpen}/>
            </FooterBar>

            <SkuPicker
              product={data}
              isOpened={this.state.isOpened}
              action={this.state.action}
              onClose={this.handleClose}
              onAfterSelectSpec={this.handleAfterSelectSpec}
              onAfterRequest={this.handleAfterRequest}
            />
          </Block>}
        </Ret>
      </Page>
    );
  }
}
