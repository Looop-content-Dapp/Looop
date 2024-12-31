import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const HEADER_HEIGHT = 250;
const HEADER_MIN_HEIGHT = 90;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  backgroundColor?: string;
  headerHeight?: number;
  title?: string;
  onBackPress?: () => void;
  renderBackButton?: () => ReactElement;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  backgroundColor = '#000000',
  headerHeight = HEADER_HEIGHT,
  title,
  onBackPress,
  renderBackButton,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  // Header image animation
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [2, 1, 1]
          ),
        },
      ],
      opacity: interpolate(
        scrollOffset.value,
        [0, headerHeight * 0.5],
        [1, 0.3],
        Extrapolate.CLAMP
      ),
    };
  });

  // Overlay darkness animation
  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, headerHeight * 0.8],
      [0.3, 0.85],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const headerTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [headerHeight - HEADER_MIN_HEIGHT - 20, headerHeight - HEADER_MIN_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const headerBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, headerHeight - HEADER_MIN_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style="light" />

      {/* Animated Header Background */}
      <Animated.View style={[styles.headerBackground, headerBackgroundStyle]} />

      {/* Header with Back Button and Title */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          {renderBackButton ? (
            renderBackButton()
          ) : (
            onBackPress && (
              <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            )
          )}
          <Animated.Text style={[styles.headerTitle, headerTitleStyle]}>
            {title}
          </Animated.Text>
        </View>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.header,
            { height: headerHeight },
            headerAnimatedStyle,
          ]}>
          {headerImage}
          <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, overlayAnimatedStyle]} />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
            style={[StyleSheet.absoluteFill, styles.gradient]}
          />
        </Animated.View>
        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: '#000',
    zIndex: 1,
  },
  gradient: {
    zIndex: 2,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    height: HEADER_MIN_HEIGHT,
    justifyContent: 'flex-end',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
