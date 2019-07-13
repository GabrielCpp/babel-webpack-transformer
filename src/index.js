const babel = require('@babel/core');
const { basename } = require('path');
const root = require('app-root-path');

function safeGet(getVal) {
  try {
    return getVal();
  } catch (e) {
    console.error(e);
  }

  return null;
}

function process(src, path) {
  const filename = basename(path);
  const webpackConfig = require(root + '/webpack.config.js')('test', { mode: 'production' });
  const webpackRule = safeGet(() => webpackConfig.module.rules.find(r => r.test.test(filename)));
  const babelOptions = safeGet(() => webpackRule.use.find(l => l.loader === 'babel-loader').options);

  if (webpackRule === null) {
    throw new Error(`No rule for ${filename}`);
  }

  return babel.transformSync(src, {
    filename,
    ...babelOptions
  });
}

exports.process = process;
