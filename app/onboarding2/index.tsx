import {
  View,
  StatusBar,
  StyleSheet,
  Image,
  type ImageSourcePropType,
  type ImageStyle,
  type ViewStyle,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
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
import Onboarding from "react-native-onboarding-swiper";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import CustomBottomContent from "./BottomComponent";
import { z } from "zod";

const { width, height } = Dimensions.get("window");
export interface ISize {
  width: number;
  height: number;
}



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
  marginTop: -hp("10%"),
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
  marginTop: -hp("15%"),
};

const Onboard2 = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const changePageHandler = (index: number) => {
    setPageIndex(index);
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
            resizeMode="contain"
          />
          <View style={[
            styles.darkOverlay, 
            { backgroundColor: pagesBackgroundColor[pageIndex] }
          ]} />
        </View>
        
        <SafeAreaView style={[
          styles.safeAreaContainer,
          { backgroundColor: 'transparent' }
        ]}>
          <Image source={logowhite} style={logoStyle} />
          
          <Onboarding
            bottomBarHighlight={false}
            showSkip={false}
            showNext={false}
            showDone={false}
            showPagination={false}
            pageIndexCallback={changePageHandler}
            containerStyles={{
              paddingHorizontal: 0,
              flex: 1,
              width,
              paddingLeft: 0,
              paddingRight: 0,
            }}
            imageContainerStyles={{
              paddingBottom: 0,
              marginBottom: 0,
              flex: Platform.OS === 'ios' ? 0.5 : undefined,
            }}
            titleStyles={{
              height: 0,
              margin: 0,
              padding: 0,
            }}
            subTitleStyles={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: 50,
              height: hp('45%'),
              marginBottom: 0,
              paddingBottom: 0,
              width,
              margin: 0,
              padding: 0,
            }}
            pages={[
              {
                title: '',
                subtitle: <CustomBottomContent pageIndex={0} />,
                backgroundColor: 'transparent',
                image: (
                  <Image
                    source={newonboard1 as ImageSourcePropType}
                    style={imageStyle}
                  />
                ),
              },
              {
                title: '',
                subtitle: <CustomBottomContent pageIndex={1} />,
                backgroundColor: 'transparent',
                image: (
                  <Image
                    source={newonboard2 as ImageSourcePropType}
                    style={imageStyle}
                  />
                ),
              },
              {
                title: '',
                subtitle: <CustomBottomContent pageIndex={2} />,
                backgroundColor: 'transparent',
                image: (
                  <Image
                    source={newonboard3 as ImageSourcePropType}
                    style={imageStyle}
                  />
                ),
              },
              {
                title: '',
                subtitle: <CustomBottomContent pageIndex={3} />,
                backgroundColor: 'transparent',
                image: (
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
                ),
              },
            ]}
          />
        </SafeAreaView>
        
        <BottomBlackComponent />
      </View>
    </>
  );
};

const BottomBlackComponent = () => {
  return <View style={styles.bottomBlackcontainer} />;
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
    
    
    resizeMode: "contain",
    
    
  
    
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%', 
    opacity: 0.8,
    zIndex: 2,
  },
  bottomBlackcontainer: {
    width,
    backgroundColor: "#000",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: hp('10%'),
    zIndex: 10,
  },
});