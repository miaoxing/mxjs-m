import {Component} from 'react'
import {setApiUrl} from '@mxjs/taro';
import config from '@/config';
import './app.scss'

class App extends Component {
  componentDidMount() {
    setApiUrl(config.apiUrl);
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
