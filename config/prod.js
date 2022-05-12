module.exports = {
  env: {
    NODE_ENV: '"production"',
  },
  defineConstants: {},
  mini: {},
  h5: {
    output: {
      filename: 'm/js/[name]-[chunkhash:6].js',
      chunkFilename: 'm/js/[name]-[chunkhash:6].js',
    },
    imageUrlLoaderOption: {
      name: 'm/images/[path][name]-[hash:6].[ext]',
    },
    miniCssExtractPluginOption: {
      filename: 'm/css/[name]-[contenthash:6].css',
      chunkFilename: 'm/css/[id]-[contenthash:6].css',
    },
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  },
};
