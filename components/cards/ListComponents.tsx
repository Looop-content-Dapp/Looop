import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ellipse from '../Ellipse';
import { Skeleton } from 'moti/skeleton';

interface Artist {
  _id: string;
  name: string;
  image: string;
}

interface Artwork {
  high: string;
  low: string;
  medium: string;
  thumbnail: string;
}

interface Release {
  _id: string;
  artwork: Artwork;
  releaseDate: string;
  title: string;
  type: string;
}

interface Track {
  duration: number;
  isExplicit: boolean;
  title: string;
  trackNumber: number;
}

interface ListItemProps {
  _id: string;
  artist: Artist;
  featuredArtists: Artist[];
  release: Release;
  track: Track;
  onPress?: () => void;  // Add onPress prop
}

interface PlaylistItemProps {
  _id: string;
  title: string;
  coverImage: string;
  description: string;
  totalTracks: number;
}

const ListComponent = ({ item }: { item: ListItemProps }) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (item) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [item]);

  return (
    <TouchableOpacity onPress={item.onPress} className='gap-y-[16px] py-[16px]'>
      <View className='flex-row items-center gap-x-[12px]'>
        <Skeleton
          transition={{
            type: 'timing',
            duration: 2000,
          }}
          show={isLoading}
          radius={5}
          colorMode="dark"
          width={72}
          height={72}
        >
          <Image
            source={{ uri: item.release.artwork.medium }}
            className='w-[72px] h-[72px] rounded-[5px]'
          />
        </Skeleton>

        <View className='flex-1'>
          <Skeleton
            transition={{
              type: 'timing',
              duration: 2000,
            }}
            show={isLoading}
            colorMode="dark"
            width="100%"
            height={20}
          >
            <Text
              className='text-[16px] text-[#F4F4F4] font-PlusJakartaSansBold'
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.track?.title}
            </Text>
          </Skeleton>

          <Skeleton
            transition={{
              type: 'timing',
              duration: 2000,
            }}
            show={isLoading}
            colorMode="dark"
            width="80%"
            height={18}
          >
            <View className='flex-row items-center gap-x-[6px]'>
              <Text numberOfLines={1}
              ellipsizeMode="tail"
              className='text-[14px] text-Grey/04 font-PlusJakartaSansRegular'>
                {item?.artist?.name}
              </Text>
              <Ellipse />
              <Text numberOfLines={1}
              ellipsizeMode="tail"
              className='text-[14px] text-Grey/04 font-PlusJakartaSansRegular'>
                {item?.release?.title}
              </Text>
            </View>
          </Skeleton>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListComponent;
