import React, {Component} from 'react';
import './app.scss';
import bootstrap from './bootstrap';
import $ from 'miaoxing';
import {ThemeProvider} from '@mxjs/theme';

bootstrap();

class App extends Component {
  state = {
    theme: {},
  }

  componentDidMount() {
    $.get($.apiUrl('js-config')).then(({ret}) => {
      if (ret.isErr()) {
        $.alert(ret.message);
        return;
      }
      this.setState({theme: ret.data.theme});
    });
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  // this.props.children 是将要会渲染的页面
  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
        {this.props.children}
      </ThemeProvider>
    )
  }
}

export default App
