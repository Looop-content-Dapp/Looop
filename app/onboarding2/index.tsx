import {
  View,
  StatusBar,
  StyleSheet,
  Image,
  type ImageSourcePropType,
  type ImageStyle,
  type ViewStyle,
  Dimensions,
  ScrollView,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import React, { useState, useRef } from "react";
import {
  newonboard1,
  newonboard2,
  newonboard3,
  newonboard4,
  newonboard5,
  logowhite,
  onboardbg1,
  onboardbg2,
  onboardbg3,
  onboardbg4,
} from "@/assets/images/images";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import CustomBottomContent from "./BottomComponent";

const { width, height } = Dimensions.get("window");

const pagesBackgroundColor = [
  "#FF6D1B",
  "#8D4FB4",
  "#2DD881",
  "#1DF4F4",
  "#FF6D1B",
];

const doubleImageContainer = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: wp("100%"),
  marginTop: hp("10%"),
};

const sideImageStyle = {
  width: wp("50%"),
  height: hp("40%"),
  resizeMode: "contain",
};

const logoStyle: ImageStyle = {
  width: wp("20%"),
  height: wp("40%"),
  resizeMode: "contain",
  position: "absolute",
  top: hp("1%"),
  alignSelf: "center",
  zIndex: 10,
};

const imageStyle: ImageStyle = {
  width: wp("100%"),
  height: hp("50%"),
  resizeMode: "contain",
  marginTop: hp("5%"),
};

const Onboard2 = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newPageIndex = Math.round(offsetX / width);
    if (newPageIndex !== pageIndex) {
      setPageIndex(newPageIndex);
    }
  };

  const getBackgroundImage = (pageIndex: number): ImageSourcePropType => {
    switch (pageIndex) {
      case 0:
        return onboardbg1 as ImageSourcePropType;
      case 1:
        return onboardbg2 as ImageSourcePropType;
      case 2:
        return onboardbg3 as ImageSourcePropType;
      default:
        return onboardbg4 as ImageSourcePropType;
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={pagesBackgroundColor[pageIndex]}
        translucent={true}
        barStyle="light-content"
      />

      <View style={styles.mainContainer}>
        <View style={styles.backgroundContainer}>
          <Image
            source={getBackgroundImage(pageIndex)}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <View
            style={[
              styles.darkOverlay,
              { backgroundColor: pagesBackgroundColor[pageIndex] },
            ]}
          />
        </View>

        <SafeAreaView
          style={[styles.safeAreaContainer, { backgroundColor: "transparent" }]}
        >
          <Image source={logowhite} style={logoStyle} />

          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            decelerationRate={0.85}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false, listener: handleScroll }
            )}
          >
            <View style={styles.pageContainer}>
              <Image source={newonboard1 as ImageSourcePropType} style={imageStyle} resizeMode="cover"  />
              <CustomBottomContent pageIndex={0} />
            </View>

            <View style={styles.pageContainer}>
              <Image source={newonboard2 as ImageSourcePropType} style={imageStyle} resizeMode="cover" />
              <CustomBottomContent pageIndex={1} />
            </View>

            <View style={styles.pageContainer}>
              <Image source={newonboard3 as ImageSourcePropType} style={imageStyle} resizeMode="cover" />
              <CustomBottomContent pageIndex={2} />
            </View>

            <View style={styles.pageContainer} >
              <View style={doubleImageContainer as ViewStyle}>
                <Image
                  source={newonboard4 as ImageSourcePropType}
                  style={sideImageStyle as ImageStyle}
                />
                <Image
                  source={newonboard5 as ImageSourcePropType}
                  style={sideImageStyle as ImageStyle}
                />
              </View>
              <CustomBottomContent pageIndex={3} />
            </View>
          </ScrollView>
        </SafeAreaView>

        <View style={styles.bottomBlackcontainer} />
      </View>
    </>
  );
};

export default Onboard2;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
    zIndex: 5,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    zIndex: 1,
  },
  backgroundImage: {
    width: wp("100%"),
    height: hp("100%"),
    // resizeMode: "cover",
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: wp("100%"),
    height: hp("100%"),
    opacity: 0.9,
    zIndex: 2,
  },
  bottomBlackcontainer: {
    width,
    backgroundColor: "#000",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: hp('45%'),
    zIndex: 3,
  },
  scrollView: {
    flex: 1,
  },
  pageContainer: {
    width,
    height: hp("100%"),
    flex: 1,
    alignItems: "center",
  },
});
