import { useEffect, useState, type CSSProperties } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'

function readInsets(): { header: CSSProperties; page: CSSProperties } {
  if (process.env.TARO_ENV !== 'weapp') return { header: {}, page: {} }
  const info = Taro.getWindowInfo()
  const statusBar = info.statusBarHeight || info.safeArea?.top || 24
  const menu = Taro.getMenuButtonBoundingClientRect()
  const validMenu = menu.height > 0 && menu.top >= statusBar && menu.left > 0
  const navigationHeight = validMenu ? Math.max(44, (menu.top - statusBar) * 2 + menu.height) : 48
  const verticalGap = (navigationHeight - 44) / 2
  const bottomInset = info.safeArea ? Math.max(0, info.screenHeight - info.safeArea.bottom) : 0
  return {
    header: {
      paddingTop: `${statusBar + verticalGap}px`,
      paddingBottom: `${verticalGap}px`,
      paddingRight: `${validMenu ? Math.max(104, info.windowWidth - menu.left + 12) : 104}px`,
      boxSizing: 'border-box'
    },
    page: { '--page-bottom-inset': `${bottomInset}px` } as CSSProperties
  }
}

/** 微信自定义导航必须主动避让状态栏和胶囊；H5 由页面 CSS 处理安全区。 */
export default function usePageInsets() {
  const [insets, setInsets] = useState(readInsets)
  useDidShow(() => setInsets(readInsets()))
  useEffect(() => {
    if (process.env.TARO_ENV !== 'weapp') return
    const update = () => setInsets(readInsets())
    Taro.onWindowResize(update)
    return () => Taro.offWindowResize(update)
  }, [])
  return insets
}
