import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import usePageInsets from '../../hooks/usePageInsets'
import Brand from '../../components/Brand'
import Button from '../../components/Action'
import './index.less'

type RoomStatus = 'active' | 'upcoming' | 'ended'
type Room = {
  id: string
  title: string
  topic: string
  status: RoomStatus
  startsAt: string
  duration: string
  host: string
  chatUrl?: string
}
const statusLabels: Record<RoomStatus, string> = {
  active: '进行中', upcoming: '待开始', ended: '已结束'
}
// 界面示例。接入接口时由服务端提供状态和带时区的开始时间，避免客户端猜测结束状态。
const sampleRooms: Room[] = [
  { id: '01', title: '聊聊你的日常使用体验', topic: '产品体验', status: 'active', startsAt: '2026-10-06T10:00:00+08:00', duration: '60 分钟', host: '产品研究团队' },
  { id: '02', title: '你心中的理想产品是什么样？', topic: '用户需求', status: 'upcoming', startsAt: '2026-10-06T14:00:00+08:00', duration: '45 分钟', host: '用户研究团队' },
  { id: '03', title: '一起探索新的功能方向', topic: '共创讨论', status: 'upcoming', startsAt: '2026-10-07T10:30:00+08:00', duration: '60 分钟', host: '产品研究团队' },
  { id: '04', title: '一次关于服务的真诚对话', topic: '服务反馈', status: 'ended', startsAt: '2026-10-05T15:00:00+08:00', duration: '45 分钟', host: '客户体验团队' }
]
const filters = ['all', 'active', 'upcoming', 'ended'] as const
const filterLabels = { all: '全部', ...statusLabels }

function startLabel(value: string) {
  // 当前展示约定为北京时间，保留接口中的显式日期，跨日浏览不会产生错误的“今天”标签。
  const [date, time] = value.split('T')
  return `${date.replace(/-/g, '.')}  ${time.slice(0, 5)}`
}

export default function Index() {
  const insets = usePageInsets()
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const rooms = sampleRooms.filter(room => filter === 'all' || room.status === filter)
  const counts = {
    all: sampleRooms.length,
    active: sampleRooms.filter(room => room.status === 'active').length,
    upcoming: sampleRooms.filter(room => room.status === 'upcoming').length,
    ended: sampleRooms.filter(room => room.status === 'ended').length
  }
  const openRoom = (room: Room) => {
    if (room.status !== 'active') {
      void Taro.showModal({
        title: room.status === 'upcoming' ? '聊天室尚未开始' : '聊天室已结束',
        content: room.status === 'upcoming'
          ? `${room.title}\n开始时间：${startLabel(room.startsAt)}（北京时间）\n请在开始后进入聊天。`
          : `${room.title}\n本场讨论已经结束。`,
        showCancel: false, confirmColor: '#435bd8'
      })
      return
    }
    if (room.chatUrl) {
      void Taro.navigateTo({ url: room.chatUrl })
      return
    }
    void Taro.showModal({
      title: '示例聊天室',
      content: '首页入口已就绪，当前展示示例数据。接入聊天室接口和聊天页面后，即可进入本场讨论。',
      showCancel: false, confirmColor: '#435bd8'
    })
  }
  return (
    <View className='survey-home room-home' style={insets.page}>
      <View className='room-header' style={insets.header}>
        <Brand />
        <Text className='room-header-label'>我的空间</Text>
      </View>
      <View className='room-content'>
        <View className='profile-card'>
          <View className='profile-top'>
            <View className='profile-avatar' ariaHidden><View className='profile-avatar-head' /><View className='profile-avatar-body' /></View>
            <View className='profile-copy'>
              <View className='profile-name'>体验用户</View>
              <Text className='profile-description'>示例账号 · 尚未登录</Text>
            </View>
            <Button className='room-button profile-login' onClick={() => void Taro.navigateTo({ url: '/pages/login/index' })}>登录<Text className='profile-login-chevron' ariaHidden /></Button>
          </View>
          <View className='profile-bottom'>
            <View className='profile-stats'>
              <View className='profile-stat'><Text className='profile-stat-value'>{counts.active}</Text><Text>进行中</Text></View>
              <View className='profile-stat'><Text className='profile-stat-value'>{counts.upcoming}</Text><Text>待开始</Text></View>
              <View className='profile-stat'><Text className='profile-stat-value'>{counts.ended}</Text><Text>已结束</Text></View>
            </View>
          </View>
        </View>

        <View className='rooms-heading'>
          <View>
            <View className='rooms-title'>我的聊天室</View>
            <Text className='rooms-description'>选择一场讨论，分享你的想法</Text>
          </View>
          <Text className='rooms-total'>{counts.all} 场讨论</Text>
        </View>
        <View className='room-filters'>
          {filters.map(item => (
            <Button key={item} className={`room-button room-filter ${filter === item ? 'room-filter-selected' : ''}`} ariaLabel={`${filterLabels[item]}，${counts[item]} 场${filter === item ? '，已选择' : ''}`} onClick={() => setFilter(item)}>
              {filterLabels[item]}<Text className='filter-count'>{counts[item]}</Text>
            </Button>
          ))}
        </View>
        <View className='room-list'>
          {rooms.map(room => (
            <View key={room.id} className={`room-card room-${room.status}`}>
              <View className='room-card-top'>
                <View className='room-topic'><View className='room-topic-icon' ariaHidden><View className='room-topic-line' /></View><Text>{room.topic}</Text></View>
                <View className={`room-status status-${room.status}`}><View className='room-status-dot' />{statusLabels[room.status]}</View>
              </View>
              <View className='room-title'>{room.title}</View>
              <View className='room-schedule'>
                <View className='room-time-icon' ariaHidden><View className='room-time-hand' /></View>
                <View className='room-schedule-copy'><Text className='room-time-label'>开始时间 · 北京时间</Text><Text className='room-time'>{startLabel(room.startsAt)}</Text></View>
                <Text className='room-duration'>约 {room.duration}</Text>
              </View>
              <View className='room-card-bottom'>
                <View className='room-host'><View className='room-host-avatar' ariaHidden>{room.host.slice(0, 1)}</View><View><Text className='room-host-name'>{room.host}</Text><Text className='room-host-role'>主持团队</Text></View></View>
                <Button className={`room-button room-action action-${room.status}`} onClick={() => openRoom(room)}>
                  <View className='room-action-face'>{room.status === 'active' ? '进入聊天' : room.status === 'upcoming' ? '查看安排' : '查看状态'}</View>
                </Button>
              </View>
            </View>
          ))}
        </View>
        <View className='room-preview-note'>示例预览 · 用户资料与聊天室数据待接入</View>
      </View>
      <View className='room-footer'>问序 · 让每一次对话都有价值</View>
    </View>
  )
}
