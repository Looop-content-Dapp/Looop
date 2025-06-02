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

        <TouchableOpacity style={styles.button}
          onPress={() => {
            dispatch(updateOnBoarded());
            router.push("/(auth)")}}
        >
          <Text style={styles.buttonText}>Continue to Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomBottomContent;


  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    subtitleWrapper: {
      width,
      height: hp("5%"),
      right: 0,
      left: 0,
    },
    bottomContainer: {
      width: width,
      backgroundColor: "#000",
      paddingHorizontal: wp("2%"),
      paddingVertical: hp("2%"),
      height: hp("40%"),
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
      marginBottom: Platform.OS === 'ios' ? hp("4%") : hp("2%"),
      width: wp("80%"),
      alignItems: "center",
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          zIndex: 10,
        }
      }),
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
    },
    textContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      marginTop: hp("2%"),
    },
  });