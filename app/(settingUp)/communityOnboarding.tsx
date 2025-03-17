import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import { useGetCommunities, Community } from "@/hooks/useGetCommunities";
import { AppButton } from "@/components/app-components/button";
import { AppBackButton } from "@/components/app-components/back-btn";
import { useLayoutEffect } from "react";
import CommunitySectionList from "@/components/settingUp/CommunitySectionList";
import { showToast } from "@/config/ShowMessage";
import { useAppSelector } from "@/redux/hooks";

const CommunityOnboarding = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { data: communities, isLoading } = useGetCommunities();
  const { userdata } = useAppSelector((state) => state.auth);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AppBackButton
          name="Discover communities on Looop"
          onBackPress={() => router.back()}
        />
      ),
    });
  }, [navigation]);

  const handleJoinCommunity = (communityId: string) => {
    const selectedCommunity = communities?.find(community => community._id === communityId);

    if (!selectedCommunity) {
      showToast("Community not found", "error");
      return;
    }

    if (!userdata?.wallets?.xion.address) {
      showToast("Xion wallet not found", "error");
      return;
    }

    router.push({
      pathname: "/payment",
      params: {
        name: selectedCommunity.communityName,
        image: selectedCommunity.tribePass.collectibleImage,
        communityId: selectedCommunity._id,
        collectionAddress: selectedCommunity.tribePass.contractAddress,
        type: "xion",
        userAddress: userdata.wallets.xion.address,
        currentRoute: "/(settingUp)/communityOnboarding",
      },
    });
  };

  const handleFinish = () => {
    if (selectedCommunities.length < 1) {
      showToast("Please select at least 1 community", "error");
      return;
    }
    router.push("/(musicTabs)");
  };

  useEffect(() => {
    if (params.joinedCommunityId && params.joinSuccess === 'true') {
      setSelectedCommunities(prev =>
        prev.includes(params.joinedCommunityId as string)
          ? prev
          : [...prev, params.joinedCommunityId as string]
      );
    } else if (params.joinedCommunityId && params.joinSuccess === 'false') {
      setSelectedCommunities(prev =>
        prev.filter(id => id !== params.joinedCommunityId)
      );
    }
  }, [params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isLoading
            ? "Finding communities for you..."
            : "Choose at least 1 community to start exploring"}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6D1B" />
        </View>
      ) : (
        <CommunitySectionList
          sections={communities || []}
          onJoin={handleJoinCommunity}
          selectedCommunities={selectedCommunities}
        />
      )}

      <AppButton.Secondary
        onPress={handleFinish}
        text="Finish"
        color="#FF6D1B"
        loading={isLoading}
        disabled={selectedCommunities.length === 0}
        className="absolute bottom-6 left-6 right-6 z-10 py-[16px] rounded-[56px]"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040405",
  },
  header: {
    padding: 24,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    color: "#f4f4f4",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CommunityOnboarding;
