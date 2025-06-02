import { View, Text } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg'

const Waves = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 8V16" stroke="#FF8A49" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <Path d="M9 10V14" stroke="#FF8A49" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <Path d="M6 11V13" stroke="#FF8A49" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <Path d="M15 10V14" stroke="#FF8A49" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <Path d="M18 11V13" stroke="#FF8A49" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </Svg>
  )
}

export default Waves
