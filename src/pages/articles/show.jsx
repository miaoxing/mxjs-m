import {Component} from 'react';
import {View, Text, Button} from '@fower/taro';
import $ from 'miaoxing';
import RichText from '@mxjs/m-rich-text';
import Page from '@mxjs/m-page';

export default class Articles extends Component {
  state = {
    ret: {},
  };

  componentDidMount() {
    $.http({
      url: $.apiUrl('articles/%s', $.req('id')),
    }).then(({ret}) => {
      if (ret.isErr()) {
        $.ret(ret);
        return;
      }
      this.setState({ret});
    });
  }

  render() {
    const {ret, ret: {data}} = this.state;

    return (
      <Page bg="#ffffff" ret={ret}>
        {data && <View pt5 pb4 px4>
          <View mb3 textXL>{data.title}</View>

          <View mb5 textSm gray500>
            {data.author && <Text mr2>
              {data.author}
            </Text>}
            <Text>
              {data.updatedAt.substr(0, 10)}
            </Text>
          </View>

          <RichText leadingRelaxed>{data.detail.content}</RichText>
        </View>}
      </Page>
    );
  }
}
