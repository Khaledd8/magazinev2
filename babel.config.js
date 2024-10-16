module.exports = {
  presets: [
    '@babel/preset-env', // For ES6+ syntax
    '@babel/preset-typescript', 
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    '@babel/plugin-transform-private-methods',
    '@babel/plugin-transform-class-static-block', // Add this line
  ],
}
