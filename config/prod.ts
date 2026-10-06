import type { UserConfigExport } from '@tarojs/cli'

export default {
  mini: {
    enableSourceMap: false
  },
  h5: {
    enableSourceMap: false,
    enableExtract: true,
    output: {
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].js'
    },
    compile: {
      include: [
        // 保留模板的依赖转译范围。
        filename => /node_modules\/(?!(@babel|core-js|style-loader|css-loader|react|react-dom))/.test(filename)
      ]
    }
  }
} satisfies UserConfigExport<'webpack5'>
