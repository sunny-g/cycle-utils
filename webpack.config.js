module.exports = {
  entry: './src/index.js',

  output: {
    path: './dist',
    filename: 'cycle-recompose.js',
  },

  resolve: {
    extensions: [ '.js', '.ts' ],
  },

  module: {

    rules: [{
      test: /\.ts/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              [ 'es2015', { modules: false } ],
              'stage-0',
            ],
          },
        },
        {
          loader: 'ts-loader',
        },
      ],
    }, {
      test: /\.js/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              [ 'es2015', { modules: false } ],
              'stage-0',
            ],
          },
        },
      ],
    }],
  },
};
