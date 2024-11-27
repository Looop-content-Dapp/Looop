import { View, Text, Image, TextInput } from 'react-native'
import { widthPercentageToDP as wp} from 'react-native-responsive-screen'
import React from 'react'
import { user } from '../../utils/ArstsisArr'

const CommentBox = () => {
  return (
    <View style={{width: wp("100%")}} className='absolute bg-[#0A0B0F] py-[11px] bottom-0 z-40 flex-row px-[16px] '>
     <Image source={{
        uri: user?.image
     }} className='w-[40px] h-[40px] rounded-full' />
     <TextInput placeholder='Add a comment' placeholderTextColor="#787A80" className='w-[85%] text-[14px] text-[#787A80] font-PlusJakartaSansMedium bg-[#12141B] rounded-[10px] ml-[16px] px-[16px]' />
    </View>
  )
}

export default CommentBox
