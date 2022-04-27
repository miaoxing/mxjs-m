import path from 'path';
import fs from 'fs';

const config = {
  projectName: 'miaoxing',
  date: '2021-5-25',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-html',
    // TODO 使用包名引入 ts 源码提示 index.ts:1 Cannot use import statement outside a module
    //'taro-plugin-miaoxing',
    fs.realpathSync('../packages/taro-plugin-miaoxing/index.ts'),
  ],
  defineConstants: {
    'process.env.BASE_API_URL': JSON.stringify(process.env.BASE_API_URL)
  },
  copy: {
    patterns: [
    ],
    options: {
    },
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    webpackChain(chain) {
      const modulesPath = path.resolve(__dirname, '../node_modules');
      chain.resolve.alias
        .set('react', modulesPath + '/react')
        .set('@fower/taro', modulesPath  + '/@fower/taro')
        .set('@fower/core', modulesPath + '/@fower/core');
    },
  },
  h5: {
    enableExtract: true,
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    router: {
      mode: 'browser',
    },
    webpackChain(chain) {
      chain.module
        .rule('script')
        .exclude
        // 移除原来的规则，允许编译 node_modules 里的模块，解决 monorepo 模块编译失败
        .clear()
        .add(filename => /@tarojs\/components/.test(filename))
        .end();
    },
  },
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/config': path.resolve(__dirname, '..', 'src/config'),
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
