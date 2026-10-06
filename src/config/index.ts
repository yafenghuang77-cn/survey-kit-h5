/** 环境变量在编译时注入，修改后需要重新启动或打包。 */
export const appConfig = {
  env: process.env.TARO_APP_ENV,
  apiBaseUrl: process.env.TARO_ENV === 'weapp'
    ? process.env.TARO_APP_WEAPP_API_BASE_URL
    : process.env.TARO_APP_API_BASE_URL
}
