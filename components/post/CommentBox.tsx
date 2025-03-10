import { View, Text, Image, TextInput, Pressable } from 'react-native'
import { widthPercentageToDP as wp} from 'react-native-responsive-screen'
import React, { useState } from 'react'
import { user } from '../../utils/ArstsisArr'
import { Message02Icon } from '@hugeicons/react-native'

const CommentBox = () => {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    if (comment.trim()) {
      // TODO: Implement comment submission
      setComment('')
    }
  }

  return (
    <View style={{width: wp("100%")}} className='absolute bg-[#0A0B0F] py-[16px] bottom-6 z-[999999px] flex-row px-[16px] border-t border-t-[#12141B]'>
      <Image
        source={{ uri: user?.image }}
        className='w-[40px] h-[40px] rounded-full'
      />
      <View className='flex-1 flex-row items-center ml-[16px] bg-[#12141B] rounded-[10px] px-[16px]'>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder='Add a comment'
          placeholderTextColor="#787A80"
          className='flex-1 text-[14px] text-[#f4f4f4] font-PlusJakartaSansMedium'
          multiline
        />
        <Pressable
          onPress={handleSubmit}
          className={`ml-2 ${!comment.trim() ? 'opacity-50' : ''}`}
          disabled={!comment.trim()}
        >
          <Message02Icon size={24} color="#787A80" />
        </Pressable>
      </View>
    </View>
  )
}

export default CommentBox
