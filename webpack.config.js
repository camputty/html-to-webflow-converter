const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs2'
    }
  },
  target: 'node',
  mode: 'production',
  optimization: {
    minimize: false
  },
  externals: {
    '@webflow/designer-extension-typings': '@webflow/designer-extension-typings'
  }
};