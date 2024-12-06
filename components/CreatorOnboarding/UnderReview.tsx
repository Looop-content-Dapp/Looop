import { View, Text } from 'react-native';
import React from 'react';
import Submitted from '@/assets/svg/Frame 899';

const UnderReview = () => {
  return (
    <View className="justify-center items-center">
      <View className='mt-[20%]'>
        <Submitted />
      </View>
      <View className='mx-auto gap-y-[12px] mt-[10%]'>
        <Text className='text-[24px] font-PlusJakartaSansMedium text-[#F4F4F4] text-center'>Thanks!
        Submission under review</Text>
        <Text className='text-[16px] font-PlusJakartaSansRegular text-[#D2D3D5] text-center'>We’ve received your application for a Looop creator profile and its now under review. We’ll send you an email within 48hours for next steps. Stay in the Looop!</Text>
      </View>
    </View>
  );
};

export default UnderReview;
