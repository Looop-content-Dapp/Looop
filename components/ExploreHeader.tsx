import {Image, Text, View} from 'react-native';
import React from 'react';
import { user } from '../utils/ArstsisArr';
import { Search01Icon } from '@hugeicons/react-native';

type Props = {
    title: string
}

const ExploreHeader = ({title}: Props) => {
  return (
    <View  className="flex-row items-center justify-between flex-1">
    <Text className="text-[#fff] text-[20px] font-PlusJakartaSansBold capitalize">{title}</Text>
   <Search01Icon />
  </View>
  );
};

export default ExploreHeader;
