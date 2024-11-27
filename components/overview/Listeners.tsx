import { View, Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import {} from "@hugeicons/react-native";
import React from "react";
import AnalyticsCard from "../Analytics/AnalyticsCard";
import ProgressBar from "../Analytics/ProgressBar";
import MiniAudioWaveform from "../animated/MiniAudioWaveform";

const Listeners = () => {
  const streamData = [
    { label: "13-17", percentage: 43.57, totalValue: 4489232990 },
    { label: "18-24", percentage: 16.43, totalValue: 989657908 },
    { label: "25-45", percentage: 12.15, totalValue: 989657908 },
    { label: "45 & up", percentage: 9.23, totalValue: 989657908 },
  ];
  return (
    <View style={{ flex: 1, minHeight: "100%" }}>
      <View
        style={{ width: wp("100%") }}
        className="bg-[#0A0B0F] py-[20px] pl-[24px] rounded-[10px] pr-[26px] flex-row items-center gap-x-[14px]"
      >
        <MiniAudioWaveform />
        <View>
          <Text className="text-[20px] font-PlusJakartaSansBold text-[#A187B5]">
            123,902
          </Text>
          <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
            people are listening to your music right now
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-x-[16px] my-[16px]">
        <AnalyticsCard
          title="Unique Audience"
          value="1.09M"
          backgroundImage={require("../../assets/images/totalStreams.png")}
          changePercentage={23.85}
          positive={true}
          cardStyle={{ backgroundColor: "#0A0B0F", height: 183, width: 183 }}
        />
        <AnalyticsCard
          title="New Audience"
          value="8.5Bn"
          backgroundImage={require("../../assets/images/totalStreams.png")}
          changePercentage={43.85}
          positive={false}
          cardStyle={{ backgroundColor: "#0A0B0F", height: 183, width: 183 }}
        />
      </View>

      <AnalyticsCard
        customContent={
          <View>
            <Text className="text-[20px] font-PlusJakartaSansMedium text-[#787A80]">
              Age distribution
            </Text>
            <View className="mt-[40px]">
              <Text className="text-[32px] font-PlusJakartaSansMedium text-[#F4F4F4]">
                22
              </Text>
              <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
                Avg. age of listeners
              </Text>
            </View>
            <View className="mt-[22px]">
              {streamData.map((item, index) => (
                <ProgressBar
                  key={`age-group-${index}`}
                  label={item.label}
                  percentage={item.percentage}
                  totalValue={`${item.percentage}%`}
                  barColor="#b29dd9"
                  backgroundColor="#444"
                  height={8}
                  variant="compact"
                  totalStreams={item.totalValue}
                />
              ))}
            </View>
          </View>
        }
        backgroundImage={require("../../assets/images/agedistribution.png")}
        cardStyle={{ height: 300, width: wp("100%") }}
      />

      <AnalyticsCard
        customContent={
          <View>
            <Text className="text-[20px] font-PlusJakartaSansMedium text-[#787A80]">
              Gender distribution
            </Text>
            <View className="mt-[22px]">
              {streamData.map((item, index) => (
                <ProgressBar
                  key={`age-group-${index}`}
                  label={item.label}
                  percentage={item.percentage}
                  totalValue={`${item.percentage}%`}
                  barColor="#FF8A49"
                  backgroundColor="#444"
                  height={8}
                  variant="compact"
                  totalStreams={item.totalValue}
                />
              ))}
            </View>
          </View>
        }
        // backgroundImage={require('../../../assets/images/agedistribution.png')}
        cardStyle={{
          width: wp("100%"),
          paddingHorizontal: 24,
          paddingVertical: 20,
          height: 215,
        }}
      />

      <AnalyticsCard
        customContent={
          <View>
            <Text className="text-[20px] font-PlusJakartaSansMedium text-[#787A80]">
              Age distribution
            </Text>
            <View className="mt-[40px]">
              <Text className="text-[32px] font-PlusJakartaSansMedium text-[#F4F4F4]">
                22
              </Text>
              <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
                Avg. age of listeners
              </Text>
            </View>
            <View className="mt-[22px]">
              {streamData.map((item, index) => (
                <ProgressBar
                  key={`age-group-${index}`}
                  label={item.label}
                  percentage={item.percentage}
                  totalValue={`${item.percentage}%`}
                  barColor="#b29dd9"
                  backgroundColor="#444"
                  height={8}
                  variant="compact"
                  totalStreams={item.totalValue}
                />
              ))}
            </View>
          </View>
        }
        backgroundImage={require("../../assets/images/agedistribution.png")}
        cardStyle={{ height: 323, width: wp("100%") }}
      />
    </View>
  );
};

export default Listeners;
