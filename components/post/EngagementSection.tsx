import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FavouriteIcon, Comment02Icon, Share05Icon, LaughingIcon, SurpriseIcon, AngryIcon, Sad01Icon, } from '@hugeicons/react-native';
import { Link } from 'expo-router';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import Reanimated, { withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface EngagementSectionProps {
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  actions: {
    like: boolean;
  };
  index: number;
}

const stickers = [
  { icon: <FavouriteIcon size={24} color="red" variant='solid' />, key: 'heart' },
  { icon: <LaughingIcon size={24} color="yellow" variant='solid' />, key: 'laugh' },
  { icon: <SurpriseIcon size={24} color="orange" variant='solid' />, key: 'surprise' },
  { icon: <AngryIcon size={24} color="red" variant='solid' />, key: 'angry' },
  { icon: <Sad01Icon size={24} color="blue" variant='solid'/>, key: 'sad' },
];

const EngagementSection: React.FC<EngagementSectionProps> = ({ engagement, actions, index }) => {
  const [liked, setLiked] = useState(actions?.like);
  const [showStickers, setShowStickers] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLike = () => {
    scale.value = withSpring(1.5, {}, () => {
      scale.value = withSpring(1);
    });
    setLiked(!liked);
  };

  const handleLongPress = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setShowStickers(true);
    }
  };

  const handleStickerSelect = (stickerKey) => {
    setSelectedSticker(stickerKey);
    setShowStickers(false);
  };

  const renderStickerIcon = () => {
    switch (selectedSticker) {
      case 'heart':
        return <FavouriteIcon variant='solid' size={20} color="red" />;
      case 'laugh':
        return <LaughingIcon variant='solid' size={20} color="yellow" />;
        case 'surprise':
            return <SurpriseIcon variant='solid' size={20} color="orange" />;
        case 'angry':
            return <AngryIcon variant='solid' size={20} color="red" />;
        case 'sad':
            return <Sad01Icon variant='solid' size={20} color="blue" />;
      default:
        return <FavouriteIcon variant={liked ? "solid" : "stroke"} size={20} color={liked ? "red" : "#787A80"} />;
    }
  };

  return (
    <View className="m-2 flex-row items-center justify-between">
        <View className='flex-row items-center gap-x-8'>
        <View className="flex-row items-center gap-x-2">
        {/* <LongPressGestureHandler  minDurationMs={500}> */}
          <Reanimated.View style={animatedStyle}>
            <TouchableOpacity onPress={handleLike}>
            <FavouriteIcon variant={liked ? "solid" : "stroke"} size={20} color={liked ? "red" : "#787A80"} />
            </TouchableOpacity>
          </Reanimated.View>
        {/* </LongPressGestureHandler> */}
        <Text className="text-[#787A80]">{engagement?.likes}</Text>
      </View>

      <View className="flex-row items-center gap-x-2">
      <Link href={{ pathname: `/(communityTabs)/(feed)/${index}` }}>
          <Comment02Icon variant="stroke" size={20} color="#787A80" />
        </Link>
        <Text className="text-[#787A80]">{engagement?.comments}</Text>
      </View>
        </View>


      {showStickers && (
        <View className="absolute top-[-50px] left-0 flex-row bg-Grey/06 p-2 gap-x-4 rounded-lg">
          {stickers?.map((sticker) => (
            <TouchableOpacity key={sticker.key} onPress={() => handleStickerSelect(sticker?.key)}>
              {sticker?.icon}
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Share05Icon variant="stroke" size={20} color="#787A80" />
    </View>
  );
};

export default EngagementSection;
