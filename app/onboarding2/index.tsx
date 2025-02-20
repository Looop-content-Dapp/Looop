import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  type ImageSourcePropType,
  ImageBackground,
} from "react-native";
import React from "react";
import {
  newonboard1,
  newonboard2,
  newonboard3,
  newonboard4,
  newonboard5,
  vector1,
  logowhite,
} from "@/assets/images/images";
import { SafeAreaView } from "react-native-safe-area-context";
import Onboarding from "react-native-onboarding-swiper";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
const Onboard2 = () => {
  return (
    <>
      <StatusBar
        backgroundColor={"#FF6D1B"}
        translucent={true}
        barStyle="light-content"
      />
      <SafeAreaView style={[styles.container, { backgroundColor: "#FF6D1B" }]}>
        <Onboarding
          bottomBarHighlight={false}
          showSkip={false}
          showNext={false}
          showDone={false}
          showPagination={true}
          containerStyles={{
            backgroundColor: "#FF6D1B",
            paddingBottom: hp("10%"),
          }}
          pages={[
            {
              backgroundColor: "#FF6D1B",
              image: (
                <View className="flex-1 justify-center items-center">
                  <Image source={logowhite} resizeMode="cover" />
                  <Image
                    className=" "
                    resizeMode="cover"
                    style={{ height: hp("25%"), width: wp("100%") }}
                    source={vector1}
                  />
                  <Image
                    source={newonboard1}
                    className="absolute -top-0  flex-shrink"
                    style={{
                        width: wp("100%"),
                        height: hp("45%"),
                        }}
                  />
                </View>
              ),
              title: "Onboarding",
              subtitle: "Done with React Native Onboarding Swiper",
              containerStyles: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              },
              imageContainerStyles: {
                height: hp("75%"),
                width: wp("100%"),
              },
            },
            {
              backgroundColor: "#FF6D1B",
              image: <Image source={newonboard2} />,
              title: "Onboarding",
              subtitle: "Done with React Native Onboarding Swiper",
            },
            {
              backgroundColor: "#FF6D1B",
              image: <Image source={newonboard3} />,
              title: "Onboarding",
              subtitle: "Done with React Native Onboarding Swiper",
            },
            {
              backgroundColor: "#FF6D1B",
              image: <Image source={newonboard4} />,
              title: "Onboarding",
              subtitle: "Done with React Native Onboarding Swiper",
            },
            {
              backgroundColor: "#FF6D1B",
              image: <Image source={newonboard5} />,
              title: "Onboarding",
              subtitle: "Done with React Native Onboarding Swiper",
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
});
