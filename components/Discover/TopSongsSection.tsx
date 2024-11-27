import { View, Text, ImageBackground, Animated, Easing } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight01Icon } from '@hugeicons/react-native';
import LatestSongs from '../LatestSongs';
import useUserInfo from '../../hooks/useUserInfo';
import { useQuery } from '../../hooks/useQuery';

const AnimatedText = ({ text, containerWidth }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    scrollX.setValue(0);

    if (textWidth > containerWidth) {
      setShouldAnimate(true);
      startAnimation();
    } else {
      setShouldAnimate(false);
    }
  }, [textWidth, containerWidth]);

  const startAnimation = () => {
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(scrollX, {
        toValue: -(textWidth - containerWidth),
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      Animated.delay(1000),
      Animated.timing(scrollX, {
        toValue: 0,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ]).start((finished) => {
      if (finished) {
        startAnimation();
      }
    });
  };

  return (
    <View style={{ width: containerWidth, overflow: 'hidden' }}>
      <Animated.Text
        ref={textRef}
        onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        style={[
          {
            transform: [{ translateX: shouldAnimate ? scrollX : 0 }],
            color: '#fff',
            fontSize: 20,
            fontFamily: 'PlusJakartaSansBold'
          }
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const TopSongsSection = ({ backgroundImage, title, type = 'location' }) => {
  const { getLocationBasedTracks, getWorldwideTopSongs } = useQuery();
  const { location } = useUserInfo();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const transformSongData = (songData) => {
    if (!songData) return [];

    return songData.map(song => ({
      id: song?._id,
      title: song?.track?.title,
      artist: song?.artist?.name,
      image: song?.release?.artwork?.high || 'https://placeholder-image-url.jpg',
      stats: {
        totalStreams: song.analytics.totalStreams || 0,
        regionalStreams: song.analytics.regionalStreams || 0,
        shares: song.analytics.shares || 0,
        playlistAdditions: song.analytics.playlistAdditions || 0
      }
    }));
  };

  const calculateSongScore = (song) => {
    // Normalize each metric to a 0-1 scale and assign weights
    const weights = {
      streams: 0.4,    // 40% weight for streams
      shares: 0.3,     // 30% weight for shares
      playlists: 0.3   // 30% weight for playlist additions
    };

    // Get maximum values for normalization
    const maxStreams = Math.max(...songs.map(s => s.stats.totalStreams));
    const maxShares = Math.max(...songs.map(s => s.stats.shares));
    const maxPlaylists = Math.max(...songs.map(s => s.stats.playlistAdditions));

    // Calculate normalized scores
    const streamScore = maxStreams ? (song.stats.totalStreams / maxStreams) : 0;
    const shareScore = maxShares ? (song.stats.shares / maxShares) : 0;
    const playlistScore = maxPlaylists ? (song.stats.playlistAdditions / maxPlaylists) : 0;

    // Calculate weighted score
    return (
      (streamScore * weights.streams) +
      (shareScore * weights.shares) +
      (playlistScore * weights.playlists)
    );
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError(null);

        let locationSongs = [];
        let worldwideSongs = [];

        // Fetch location-based tracks if we have a location
        if (type === 'location' && location?.country) {
          const locationResponse = await getLocationBasedTracks(
            location.country,
            30,  // limit
            '7d'  // timeframe
          );
          locationSongs = locationResponse?.data || [];
        }

        // Always fetch worldwide songs
        const worldwideResponse = await getWorldwideTopSongs('24h', 30);
        worldwideSongs = worldwideResponse?.data || [];

        // Combine and transform the songs
        const combinedSongs = [...transformSongData(locationSongs), ...transformSongData(worldwideSongs)];

        // Remove duplicates based on song ID
        const uniqueSongs = Array.from(
          new Map(combinedSongs.map(song => [song.id, song])).values()
        );

        // Calculate scores and sort
        const songsWithScores = uniqueSongs.map(song => ({
          ...song,
          score: calculateSongScore(song)
        }));

        const sortedSongs = songsWithScores.sort((a, b) => b.score - a.score);

        setSongs(sortedSongs);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [type, location]);

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ width: wp("90%") }}
      className='h-[653px] mt-[31px] mx-auto pl-[32px] pt-[32px] gap-y-[24px] rounded-[24px] overflow-hidden'
    >
      <View className='flex-row items-center w-full justify-between pr-[29px]'>
        <View style={{ width: wp("60%") }}>
          <AnimatedText text={title} containerWidth={wp("60%")} />
        </View>
        <View className='flex-row items-center'>
          <Text className='text-[14px] font-PlusJakartaSansBold text-[#FFF8F4]'>See all</Text>
          <ArrowRight01Icon size={24} color='#FFF8F4' />
        </View>
      </View>
      <LatestSongs songs={songs} loading={loading} error={error} />
    </ImageBackground>
  );
};

export default TopSongsSection;
