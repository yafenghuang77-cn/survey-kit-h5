import { Text, View } from "@tarojs/components";
import "./index.less";

export default function Brand() {
  return (
    <View className='survey-brand'>
      <View className='survey-mark' ariaHidden>
        <View className='survey-mark-sheet' />
        <View className='survey-mark-tail' />
      </View>
      <View>
        <Text className='survey-brand-name'>问序</Text>
        <Text className='survey-brand-caption'>SURVEY KIT</Text>
      </View>
    </View>
  );
}
