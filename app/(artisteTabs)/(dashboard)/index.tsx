import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Modal,
  Animated,
} from "react-native";
import { ArrowDown01Icon } from "@hugeicons/react-native";
import Streams from "../../../components/overview/Streams";
import Listeners from "../../../components/overview/Listeners";
import Tribes from "../../../components/overview/Tribes";
import FilterButton from "@/components/app-components/FilterButton";

const tabs = ["Streams", "Listeners", "Tribes"];

const Overview = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('30 Days');
  const filterOptions: string[] = ['30 Days', '3 Months', '6 Months', 'All Time'];
  const { width } = useWindowDimensions();
  const filterButtonRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });
  const [tabPositions, setTabPositions] = useState(
    tabs.map(() => ({ x: 0, width: 0 }))
  );
  const animatedValue = useState(new Animated.Value(0))[0];

  const handleFilterPress = () => {
    filterButtonRef.current.measure((fx, fy, width, height, px, py) => {
      setModalPosition({
        top: py + height + 5,
        right: 20,
      });
      setIsModalVisible(true);
    });
  };

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

  const measureTab = useCallback(
    (
      event: { nativeEvent: { layout: { x: any; width: any } } },
      index: string | number
    ) => {
      const { x, width } = event.nativeEvent.layout;
      setTabPositions((prev) => {
        const newPositions = [...prev];
        newPositions[index] = { x, width };
        return newPositions;
      });
    },
    []
  );

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
      marginTop: 50,
      paddingHorizontal: 12,
      gap: 25,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    titleContainer: {
      gap: 2,
    },
    title: {
      fontSize: 24,
      color: "#fff",
      fontFamily: "PlusJakartaSansMedium",
    },
    subtitle: {
      fontSize: 14,
      color: "#787A80",
      fontFamily: "PlusJakartaSansMedium",
    },
    customButton: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "rgba(120, 122, 128, 0.7)",
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      gap: 4,
    },
    dateButtonText: {
      fontSize: 12,
      color: "#D2D3D5",
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
      flexGrow: 1,
      paddingBottom: 35,
    },
    customModal: {
      position: "absolute",
      backgroundColor: "#0A0B0F",
      borderRadius: 10,
      padding: 15,
      width: width * 0.5,
      shadowColor: "#040405",
      shadowOffset: {
        width: 5,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    filterOption: {
      paddingVertical: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: "#787A80",
    },
    filterOptionText: {
      color: "#f4f4f4",
      fontSize: width * 0.035,
      fontFamily: "PlusJakartaSansMedium",
    },
    selectedFilterOption: {
      backgroundColor: "#12141B",
    },
  });

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <Streams />;
      case 1:
        return <Listeners />;
      case 2:
        return <Tribes />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Overview</Text>
          <Text style={styles.subtitle}>Overall stats</Text>
        </View>
        <FilterButton
      options={filterOptions}
      selectedOption={selectedFilter}
      onOptionSelect={setSelectedFilter}
      buttonStyle={styles.customButton}
      modalStyle={styles.customModal}
    />
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

export default Overview;
