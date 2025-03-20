import React, { memo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { MotiView } from "moti";
import { Search01Icon, Tick01Icon } from "@hugeicons/react-native";
import { Community } from "@/hooks/useGetCommunities";

const { width } = Dimensions.get("window");

interface CommunitySectionListProps {
  sections: Community[];
  onJoin: (communityId: string) => void;
  selectedCommunities: string[];
  userId: string; // Add userId prop
}

const CARD_WIDTH = width * 0.3;

const CommunityCard = memo(
  ({
    community,
    onJoin,
    isSelected,
  }: {
    community: Community;
    onJoin: (id: string) => void;
    isSelected: boolean;
  }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => onJoin(community._id)}
          style={styles.imageContainer}
        >
          <Image
            source={{ uri: community.coverImage }}
            style={styles.communityImage}
            resizeMode="cover"
          />
          {isSelected && (
            <MotiView
              from={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 300 }}
              style={styles.checkmarkOverlay}
            >
              <Tick01Icon size={24} color="#040405" />
            </MotiView>
          )}
        </TouchableOpacity>
        <Text style={styles.communityName} numberOfLines={1}>
          {community.communityName}
        </Text>
      </View>
    );
  }
);

const CommunitySectionList: React.FC<CommunitySectionListProps> = ({
  sections,
  onJoin,
  selectedCommunities,
  userId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCommunities, setFilteredCommunities] = useState(sections);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCommunities(sections);
    } else {
      const filtered = sections.filter((community) =>
        community.communityName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCommunities(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search01Icon size={20} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a community"
          placeholderTextColor="#A0A0A0"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredCommunities}
        renderItem={({ item }) => (
          <CommunityCard
            community={item}
            onJoin={onJoin}
            isSelected={
              selectedCommunities.includes(item._id) ||
              item.members?.some(member => member.userId._id === userId)
            }
          />
        )}
        keyExtractor={(item) => item._id}
        numColumns={3}
        contentContainerStyle={styles.communityList}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111318",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderColor: "#202227",
    borderWidth: 1,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#f4f4f4",
    fontSize: 16,
  },
  communityList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  imageContainer: {
    position: "relative",
  },
  communityImage: {
    width: 110,
    height: 110,
    borderRadius: 50,
    marginBottom: 8,
  },
  checkmarkOverlay: {
    position: "absolute",
    top: 8,
    right: 0,
    backgroundColor: "#2DD881",
    borderRadius: 40,
    padding: 2,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  communityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },
});

export default memo(CommunitySectionList);
