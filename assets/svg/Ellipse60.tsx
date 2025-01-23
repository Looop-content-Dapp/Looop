import { View, Text } from 'react-native'
import React from 'react'
import Svg, { Ellipse } from 'react-native-svg'
import { TimeQuarterPassIcon } from '@hugeicons/react-native'

const Ellipse60 = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width="117" height="116" viewBox="0 0 117 116" fill="none">
    <Ellipse cx="58.5" cy="58" rx="58.5" ry="58" fill="#363A49"/>
   <View className='items-center justify-center mt-[39px]'>
   <TimeQuarterPassIcon size={62} color='#70768C' variant='solid' />
   </View>
    </Svg>

  )
}

export default Ellipse60
