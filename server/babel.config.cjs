module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: '15.9.0'}}],
  ],
  plugins: ['@babel/plugin-syntax-top-level-await']
};
