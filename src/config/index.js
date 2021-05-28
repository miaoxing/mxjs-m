const config = {
  apiUrl: '',
};

module.exports = function () {
  const merge = Object.assign;
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
}();
