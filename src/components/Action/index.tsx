import { PropsWithChildren } from 'react'
import { Button } from '@tarojs/components'

type ActionProps = PropsWithChildren<{
  className?: string
  ariaLabel?: string
  'aria-label'?: string
  onClick: () => void
}>

// H5 使用原生按钮，支持键盘焦点与 Enter / Space；小程序保留 Taro 按钮。
export default function Action(props: ActionProps) {
  const { children, className, onClick } = props
  const ariaLabel = props.ariaLabel || props['aria-label']
  if (process.env.TARO_ENV === 'h5') {
    return <button type='button' className={className} aria-label={ariaLabel} onClick={onClick}>{children}</button>
  }
  return <Button className={className} ariaLabel={ariaLabel} onClick={onClick}>{children}</Button>
}
