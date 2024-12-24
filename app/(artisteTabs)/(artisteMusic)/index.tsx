import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Animated,
  ScrollView,
} from "react-native";
import Releases from "../../../components/overview/music/Releases";
import Songs from "../../../components/overview/music/Songs";
import Playlists from "../../../components/overview/music/Playlists";

const tabs = ["Releases", "Songs", "Playlists"];

const MyMusic = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { width, height } = useWindowDimensions();
  const [tabPositions, setTabPositions] = useState(
    tabs.map(() => ({ x: 0, width: 0 }))
  );
  const animatedValue = useState(new Animated.Value(0))[0];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
      marginTop: 50,
      paddingHorizontal: 12,
      gap: 25,
      paddingBottom: 35,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 24,
      color: "#fff",
      fontFamily: "PlusJakartaSansMedium",
    },
    tabContainer: {
      flexDirection: "row",
      position: "relative",
      justifyContent: "space-between",
    },
    tabButton: {
      paddingVertical: 5,
      paddingHorizontal: width * 0.04,
      borderRadius: 5,
    },
    tabText: {
      fontSize: 14,
      fontFamily: "PlusJakartaSansBold",
      color: "#787A80",
    },
    activeTabText: {
      color: "#f4f4f4",
    },
    tabIndicator: {
      position: "absolute",
      height: "100%",
      borderRadius: 24,
      backgroundColor: "#12141B",
      bottom: 0,
    },
    content: {
      flex: 1,
    },
  });

  const handleTabPress = useCallback(
    (index) => {
      setSelectedTab(index);
      Animated.spring(animatedValue, {
        toValue: index,
        useNativeDriver: true,
        tension: 300,
        friction: 30,
      }).start();
    },
    [animatedValue]
  );

  const measureTab = useCallback((event, index) => {
    const { x, width } = event.nativeEvent.layout;
    setTabPositions((prev) => {
      const newPositions = [...prev];
      newPositions[index] = { x, width };
      return newPositions;
    });
  }, []);

  const indicatorStyle = {
    transform: [
      {
        translateX: animatedValue.interpolate({
          inputRange: tabs.map((_, i) => i),
          outputRange: tabPositions.map(({ x }) => x),
        }),
      },
    ],
    width: tabPositions[selectedTab]?.width || 0,
  };

  useEffect(() => {
    if (tabPositions[selectedTab]) {
      indicatorStyle.width = tabPositions[selectedTab].width;
    }
  }, [selectedTab, tabPositions]);

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <Releases />;
      case 1:
        return <Songs />;
      case 2:
        return <Playlists />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Music</Text>
      </View>

      <View style={styles.tabContainer}>
        <Animated.View style={[styles.tabIndicator, indicatorStyle]} />
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabPress(index)}
            onLayout={(event) => measureTab(event, index)}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === index && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default MyMusic;
