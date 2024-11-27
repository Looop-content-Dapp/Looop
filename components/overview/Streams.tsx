import { View, Text, StyleSheet } from "react-native";
import React from "react";
import AnalyticsCard from "../Analytics/AnalyticsCard";
import ProgressBar from "../Analytics/ProgressBar";
import { Image } from "react-native";

const Streams = () => {
  const streamData = [
    { label: "Searches", percentage: 43.57, totalValue: 4489232990 },
    {
      label: "Looop editorial playlists",
      percentage: 16.43,
      totalValue: 989657908,
    },
    {
      label: "Other listener playlists & libraries",
      percentage: 12.15,
      totalValue: 989657908,
    },
    {
      label: "Listener’s own playlists",
      percentage: 9.23,
      totalValue: 989657908,
    },
    { label: "Tribes", percentage: 7.0, totalValue: 989657908 },
    { label: "Algorithmic playlists", percentage: 6.54, totalValue: 989657908 },
    {
      label: "External shares & links",
      percentage: 5.08,
      totalValue: 989657908,
    },
  ];

  const TopLocation = [
    {
      flag: "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg",
      country: "Nigeria",
      percentage: 84.23,
    },
    {
      flag: "https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg",
      country: "USA",
      percentage: 10.02,
    },
    {
      flag: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg",
      country: "UK",
      percentage: 5.75,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View className="flex-row gap-x-[16px] items-center justify-center">
        <AnalyticsCard
          title="Total Streams"
          value="8.5Bn"
          backgroundImage={require("../../assets/images/totalStreams.png")}
          changePercentage={43.85}
          positive={true}
          cardStyle={{ backgroundColor: "#0A0B0F", height: 240, width: 183 }}
        />
        <AnalyticsCard
          title="New Streams"
          value="324.4M"
          changePercentage={10.2}
          backgroundImage={require("../../assets/images/newStreams.png")}
          positive={true}
          cardStyle={{ backgroundColor: "#0A0B0F", height: 240, width: 183 }}
        />
      </View>

      <View className="flex-row gap-x-[16px] items-center justify-center">
        <AnalyticsCard
          backgroundImage={require("../../assets/images/topLocations.png")}
          customContent={
            <View>
              <View>
                <Text className="text-[16px] font-PlusJakartaSansBold text-[#f4f4f4]">
                  Top Locations
                </Text>
                <Text className="text-[12px] font-PlusJakartaSansMedium text-[#787A80]">
                  Most of your streams came from Nigeria
                </Text>
              </View>

              <View className="mt-[40px] gap-y-[16px]">
                {TopLocation.map((item, index) => {
                  return (
                    <View
                      key={index}
                      className="flex-row items-center gap-x-[12px]"
                    >
                      <Image
                        source={{
                          uri: item?.flag,
                        }}
                        className="w-[24px] h-[24px] rounded-full bg-white"
                      />
                      <Text className="flex-row items-center text-[#D2D3D5] text-[12px] font-PlusJakartaSansBold">
                        {item?.country}:{" "}
                        <Text className="text-[14px] text-[#f4f4f4]">
                          {item?.percentage}
                        </Text>
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          }
          positive={true}
          cardStyle={{ backgroundColor: "#0A0B0F", height: 240, width: 183 }}
        />
        <AnalyticsCard
          positive={true}
          customContent={
            <>
              <View>
                <Text className="text-[16px] font-PlusJakartaSansBold text-[#f4f4f4]">
                  Playlist stats
                </Text>

                <View className="mt-[42px]">
                  <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
                    You appeared on
                  </Text>
                  <Text className="text-[38px] font-PlusJakartaSansBold text-[#f4f4f4]">
                    349
                  </Text>
                  <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
                    Playlists
                  </Text>
                </View>

                <View className="mt-[16px]">
                  <View className="flex-row items-center gap-x-[8px] mb-[8px]">
                    <View className="h-[10px] w-[10px] bg-[#F68B1F] rounded-full" />
                    <Text className="text-[14px] font-PlusJakartaSansMedium text-[#f4f4f4]">
                      223 User Playlists
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-x-[8px]">
                    <View className="h-[10px] w-[10px] bg-[#AB47BC] rounded-full" />
                    <Text className="text-[14px] font-PlusJakartaSansMedium text-[#f4f4f4]">
                      126 User Playlists
                    </Text>
                  </View>
                </View>
              </View>
            </>
          }
          backgroundImage={require("../../assets/images/playlistStats.png")}
          cardStyle={{ height: 240, width: 183 }}
        />
      </View>

      <View style={styles.section}>
        <Text className="text-[24px] font-PlusJakartaSansMedium text-[#F4F4F4]">
          Source of Streams
        </Text>
        {streamData.map((item, index) => (
          <ProgressBar
            key={`age-group-${index}`}
            label={item.label}
            percentage={item.percentage}
            totalValue={`${item.percentage}%`}
            barColor="#b29dd9"
            backgroundColor="#444"
            height={8}
            variant="default"
            totalStreams={item.totalValue}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
  },
});

export default Streams;
