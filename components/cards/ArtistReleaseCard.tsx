import { ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/react-native';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

interface ReleaseCardProps {
  id: string;
  title: string;
  type: string;
  date: string;
  coverImage: string;
  streams: number;
  tracks: { title: string; streams: number }[];
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({ id, title, type, date, coverImage, streams, tracks }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View  className='bg-[#040405] gap-y-[20px]'>

      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center gap-x-[16px]'>
        <Image source={{ uri: "https://i.pinimg.com/736x/d9/bc/d7/d9bcd7b26a81137d2dfda160f3f3f4e1.jpg" }} style={styles.coverImage} />
        <View>
        <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>{title}</Text>
        <Text className='text-[12px] font-PlusJakartaSansBold text-[#787A80]'>{type}</Text>
        </View>
        </View>

        <View className='items-end'>
            <Text className='text-[20px] font-PlusJakartaSansMedium text-[#f4f4f4]'>{streams.toLocaleString()}</Text>
            <Text className='text-[14px] font-PlusJakartaSansBold text-[#787A80]'>Total Streams</Text>
        </View>
      </View>

      <View className='flex-row items-center justify-between'>
      <Text className='text-[14px] font-PlusJakartaSansBold text-[#787A80]'>{date}</Text>
      <Pressable onPress={toggleExpanded} className='flex-row items-center'>
      <Text className='text-[14px] font-PlusJakartaSansBold text-[#A187B5]'>{isExpanded ?  "Show less" : "See breakdown"}</Text>
     {isExpanded ?  <ArrowUp01Icon size={24} color='#787A80' /> : <ArrowDown01Icon size={24} color='#787A80' />}
      </Pressable>
      </View>

      {isExpanded && tracks.length > 0 && (
        <View style={styles.trackList}>
          <View className='flex-row items-center justify-between bg-[#0A0B0F] py-[15px] px-[12px]'>
            <Text className='text-[14px] font-PlusJakartaSansBold text-[#787A80]'># Song</Text>
            <Text className='text-[14px] font-PlusJakartaSansBold text-[#787A80]'>Streams</Text>
          </View>
          {tracks.map((track, index) => (
            <View key={index} style={styles.trackRow} className='px-[12px] items-center border-b border-b-[#12141B] py-[32px]'>
              <Text className='text-[14px] font-PlusJakartaSansBold text-[#787A80]'>{`${index + 1}  ${track.title}`}</Text>
              <Text className='text-[14px] font-PlusJakartaSansBold text-[#787A80]'>{track.streams.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  releaseContainer: {
    backgroundColor: '#1c1c1c',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  releaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  releaseInfo: {
    flex: 1,
    marginLeft: 10,
  },
  releaseTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  releaseType: {
    color: '#888',
    fontSize: 14,
  },
  releaseDate: {
    color: '#888',
    fontSize: 14,
  },
  streamInfo: {
    alignItems: 'flex-end',
  },
  streams: {
    color: '#fff',
    fontSize: 16,
  },
  breakdownText: {
    color: '#b19cd9',
    marginTop: 5,
  },
  trackList: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  trackListHeader: {
    color: '#888',
    marginBottom: 10,
  },
  trackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 10,
  },
  trackTitle: {
    color: '#fff',
  },
  trackStreams: {
    color: '#888',
  },
});

export default ReleaseCard;
