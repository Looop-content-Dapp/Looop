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
import { ONBOARDING_TEXTS } from "@/data/data";

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

const CustomBottomContent = ({ pageIndex }: { pageIndex: number }) => {
  return (
    <View style={styles.subtitleWrapper}>
      <View style={styles.bottomContainer}>
        <View style={styles.textContainer}>
          <Text className="text-white" style={styles.bigText}>
            {ONBOARDING_TEXTS[pageIndex].first.text}
            <Text
              className="font-TankerRegular"
              style={{ color: ONBOARDING_TEXTS[pageIndex].second.color }}
            >
              {ONBOARDING_TEXTS[pageIndex].second.text}
            </Text>
            {pageIndex === 3 && (
              <Text
                style={[
                  styles.bigText,
                  { color: ONBOARDING_TEXTS[pageIndex]?.third?.color },
                ]}
              >
                {ONBOARDING_TEXTS[pageIndex]?.third?.text}
              </Text>
            )}
          </Text>
        </View>

        <View style={styles.paginationContainer}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                pageIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button}>
          <Text className="text-white">Continue to Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
            flex: 1,
          }}
          imageContainerStyles={{
            paddingBottom: 0,
            marginBottom: 0,
          }}
          pages={[
            {
              title: null,
              subtitle: <CustomBottomContent pageIndex={0} />,
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
              subtitle: <CustomBottomContent pageIndex={1} />,
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
              subtitle: <CustomBottomContent pageIndex={2} />,
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
              subtitle: <CustomBottomContent pageIndex={3} />,
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
      </SafeAreaView>
    </>
  );
};

export default Onboard2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitleWrapper: {
    width: wp("100%"),
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomContainer: {
    width: "100%",
    backgroundColor: "#000",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("1%"),
    height: hp("45%"),
    alignItems: "center",
    justifyContent: "space-between",
  },
  bigText: {
    color: "#fff",
    fontSize: wp("7%"),
    fontWeight: "bold",
    textAlign: "left",
    marginTop: hp("2%"),
    letterSpacing: 0.1,
    textTransform: "uppercase",
    fontFamily: "TankerRegular",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#666",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: wp("5%"),
    height: hp("1%"),
  },
  button: {
    backgroundColor: "#FF7A1B",
    paddingVertical: hp("2%"),
    borderRadius: wp("10%"),
    marginBottom: hp("2%"),
    width: wp("80%"),
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("2%"),
  },
});
