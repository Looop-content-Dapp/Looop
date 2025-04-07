import React from 'react';
import {
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

interface ImageViewerProps {
  images: string[];
  visible: boolean;
  initialIndex: number;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  visible,
  initialIndex,
  onClose,
}) => {
  const { width, height } = Dimensions.get('window');
  const scale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = withSpring(1);
    },
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const renderImage = ({ item }: { item: string }) => (
    <View style={[styles.imageContainer, { width }]}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.Image
          source={{ uri: item }}
          style={[
            styles.image,
            { width, height: height * 0.8 },
            animatedImageStyle,
          ]}
          resizeMode="contain"
        />
      </PinchGestureHandler>
    </View>
  );

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Animated.FlatList
          data={images}
          renderItem={renderImage}
          horizontal
          pagingEnabled
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
});

export default ImageViewer;
