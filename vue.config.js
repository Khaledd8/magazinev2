const { defineConfig } = require('@vue/cli-service')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = defineConfig({
  chainWebpack: (config) => {
    config.module
      .rule('pdf')
      .test(/\.pdf$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: '[name].[hash:8].[ext]',
        outputPath: 'pdfs/', // Specify output path for PDFs
        publicPath: 'pdfs/', // Specify public path for PDFs
      });
  },
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.mjs'),
            to: path.join(__dirname, 'dist/js/pdf.worker.mjs'),
          },
        ],
      }),
    ],
  },
})
