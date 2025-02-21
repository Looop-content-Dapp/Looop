import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  type ImageSourcePropType,
  type ImageStyle,
  type ViewStyle,
} from "react-native";
import React, { useState } from "react";
import {
  newonboard1,
  newonboard2,
  newonboard3,
  newonboard4,
  newonboard5,
  logowhite,
} from "@/assets/images/images";
import { SafeAreaView } from "react-native-safe-area-context";
import Onboarding from "react-native-onboarding-swiper";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CustomBottomComponent from "./BottomComponent";

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
  marginTop: -hp("30%"),
};

const sideImageStyle = {
  width: wp("50%"),
  height: hp("50%"),
  resizeMode: "contain",
};
const logoStyle: ImageStyle = {
  width: wp("20%"),
  height: wp("40%"),
  resizeMode: "contain",
  position: "absolute",
  top: hp("1%"),
  alignSelf: "center",
  zIndex: 1,
};
const imageStyle: ImageStyle = {
  width: wp("100%"),
  height: hp("50%"),
  resizeMode: "contain",
  marginTop: -hp("30%"),
};

const Onboard2 = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const changePageHandler = (index: number) => {
    setPageIndex(index);
  };

  return (
    <>
      <StatusBar
        backgroundColor={pagesBackgroundColor[pageIndex]}
        translucent={true}
        barStyle="light-content"
      />
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: pagesBackgroundColor[pageIndex] },
        ]}
      >
        <Image source={logowhite} style={logoStyle} />
        <Onboarding
          bottomBarHighlight={false}
          showSkip={false}
          showNext={false}
          showDone={false}
          showPagination={false}
          pageIndexCallback={changePageHandler}
          containerStyles={{
            paddingHorizontal: wp("5%"),
          }}
          pages={[
            {
              title: null,
              backgroundColor: pagesBackgroundColor[0],
              image: (
                <Image
                  source={newonboard1 as ImageSourcePropType}
                  style={imageStyle}
                />
              ),
            },
            {
              title: null,
              backgroundColor: pagesBackgroundColor[1],
              image: (
                <Image
                  source={newonboard2 as ImageSourcePropType}
                  style={imageStyle}
                />
              ),
            },
            {
              title: null,
              backgroundColor: pagesBackgroundColor[2],
              image: (
                <Image
                  source={newonboard3 as ImageSourcePropType}
                  style={imageStyle}
                />
              ),
            },
            {
              title: null,
              backgroundColor: pagesBackgroundColor[3],
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
        <CustomBottomComponent pageIndex={pageIndex} />
      </SafeAreaView>
    </>
  );
};

export default Onboard2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
