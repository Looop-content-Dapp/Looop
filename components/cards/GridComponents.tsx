import { View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
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

interface GridItemProps {
  _id: string;
  artist: Artist;
  featuredArtists: Artist[];
  release: Release;
  track: Track;
}

const GridComponent = ({ item }: { item: GridItemProps }) => {
  const [isLoading, setIsLoading] = useState(false);

  const truncate = (str: string) => {
    return str?.length > 18 ? str.slice(0, 18) + '...' : str;
  };

  useEffect(() => {
    if (!item) {
      setIsLoading(true);
    }
  }, [item]);

  return (
    <View style={{ paddingHorizontal: 4, paddingVertical: 16 }}>
      <Skeleton
        transition={{
          type: 'timing',
          duration: 2000,
        }}
        show={isLoading}
      >
        {item?.release?.artwork?.medium && (
          <Image
            source={{ uri: item.release.artwork.medium }}
            style={{ width: 183, height: 183, borderRadius: 5 }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
        )}
      </Skeleton>

      <Skeleton show={isLoading}>
        {item?.track?.title && (
          <Text
            style={{
              fontSize: 16,
              color: '#F4F4F4',
              fontFamily: 'PlusJakartaSansBold',
              marginTop: 8
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {truncate(item.track.title)}
          </Text>
        )}
      </Skeleton>

      <Skeleton show={isLoading}>
        {item?.artist?.name && (
          <Text style={{
            fontSize: 14,
            color: '#787A80',
            fontFamily: 'PlusJakartaSansRegular'
          }}>
            {item.artist.name}
          </Text>
        )}
      </Skeleton>
    </View>
  );
};

export default GridComponent;
