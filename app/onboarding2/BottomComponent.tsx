import { ONBOARDING_TEXTS } from "@/data/data";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Platform} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useAppDispatch } from "@/redux/hooks";
import { updateOnBoarded } from "@/redux/slices/miscelleaneous";


const { width } = Dimensions.get("window");
const CustomBottomContent = ({ pageIndex }: { pageIndex: number }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <View style={styles.subtitleWrapper}>
      <View style={styles.bottomContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.bigText}>
            {ONBOARDING_TEXTS[pageIndex].first.text}
            <Text
              style={[styles.bigText, { color: ONBOARDING_TEXTS[pageIndex].second.color }]}
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
                index === pageIndex ? styles.paginationDotActive : styles.paginationDotInactive
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            dispatch(updateOnBoarded());
            router.push("/(auth)")
          }}
        >
          <Text style={styles.buttonText}>Continue to Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomBottomContent;


const styles = StyleSheet.create({
  subtitleWrapper: {
    width,
    height: hp("45%"),
    right: 0,
    left: 0,
  },
  bottomContainer: {
    width: width,
    backgroundColor: "#000",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("3%"),
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bigText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "left",
    letterSpacing: -0.8,
    lineHeight: wp("10%"),
    fontFamily: "TankerRegular",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp("2%"),
  },
  paginationDot: {
    height: hp("0.8%"),
    marginHorizontal: wp("1%"),
    borderRadius: 4,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: wp("5%"),
  },
  paginationDotInactive: {
    backgroundColor: "rgba(255,255,255,0.3)",
    width: wp("2%"),
  },
  button: {
    backgroundColor: "#FF7A1B",
    paddingVertical: hp("2%"),
    borderRadius: 50,
    marginBottom: Platform.OS === 'ios' ? hp("2%") : hp("1%"),
    width: wp("90%"),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp("2.5%"),
  },
  textContainer: {
    paddingHorizontal: wp("2%"),
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginTop: hp("2%"),
  },
});
