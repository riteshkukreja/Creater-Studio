const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'bundle': './src/app.ts',
    'boundingbox': './src/scripts/BoundingBox.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    // alias: {
    //   // bind version of jquery-ui
    //   "jquery-ui": "jquery-ui/jquery-ui.js",      
    //   // bind to modules;
    //   modules: path.join(__dirname, "node_modules")
    // }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  // plugins: [
  //   new webpack.ProvidePlugin({
  //     "$":"jquery",
  //     "jQuery":"jquery",
  //     "window.jQuery":"jquery"
  //   }),
  // ]
};