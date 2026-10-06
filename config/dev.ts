import type { UserConfigExport } from '@tarojs/cli'

const port = Number(process.env.TARO_APP_DEV_PORT || 10086)
const proxyTarget = process.env.TARO_APP_API_PROXY_TARGET

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('TARO_APP_DEV_PORT 必须是 1 到 65535 之间的整数')
}

if (proxyTarget && !/^https?:\/\//.test(proxyTarget)) {
  throw new Error('TARO_APP_API_PROXY_TARGET 必须是 http:// 或 https:// 地址')
}

export default {
  // Stencil 组件的动态入口不兼容依赖预编译，交由 Webpack 正常加载。
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false }
  },
  logger: {
    quiet: false,
    stats: false
  },
  mini: {
    enableSourceMap: true
  },
  h5: {
    enableSourceMap: true,
    devServer: {
      host: process.env.TARO_APP_DEV_HOST || '0.0.0.0',
      port,
      open: false,
      hot: true,
      proxy: proxyTarget ? [
        {
          context: ['/api'],
          target: proxyTarget,
          changeOrigin: true
        }
      ] : []
    }
  }
} satisfies UserConfigExport<'webpack5'>
