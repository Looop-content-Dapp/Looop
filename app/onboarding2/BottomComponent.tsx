import { ONBOARDING_TEXTS } from "@/data/data";
import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const CustomBottomComponent = ({ pageIndex }: { pageIndex: number }) => {
  return (
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
  );
};

export default CustomBottomComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "contain",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
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
