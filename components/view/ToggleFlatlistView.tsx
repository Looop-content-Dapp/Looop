import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { GridViewIcon, ListViewIcon } from '@hugeicons/react-native';
import { MotiView } from 'moti'; // Import Moti for animation

const ToggleFlatListView = ({ data, GridComponent, ListComponent, title, loading }) => {
  const [isGridView, setIsGridView] = useState(false);

  const toggleView = () => {
    setIsGridView(!isGridView); // Toggle between grid and list view
  };

  return (
    <View className="mt-[38px]">
      {/* Toggle Button */}
      <View className="flex-row items-center justify-between px-2 w-full">
        <Text className="text-[24px] font-PlusJakartaSansBold text-[#f4f4f4]">
          {title}
        </Text>
        <TouchableOpacity onPress={toggleView}>
          {isGridView ? (
            <ListViewIcon size={24} color="#787A80" variant="stroke" />
          ) : (
            <GridViewIcon size={24} color="#787A80" variant="stroke" />
          )}
        </TouchableOpacity>
      </View>

      {/* Display Loading Skeleton while loading */}
      {loading ? (
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          {/* Skeleton Layout */}
          {[...Array(6)].map((_, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{
                loop: true,
                type: 'timing',
                duration: 1000,
              }}
              style={{
                height: 60,
                backgroundColor: '#e0e0e0',
                borderRadius: 8,
                marginVertical: 10,
              }}
            />
          ))}
        </View>
      ) : data && data.length > 0 ? (
        /* Conditionally Render FlatList */
        <FlatList
          key={isGridView ? 'grid' : 'list'} // Changing the key to force re-render
          data={data}
          renderItem={({ item }) =>
            isGridView ? <GridComponent item={item} /> : <ListComponent item={item} />
          }
          numColumns={isGridView ? 2 : 1} // Use 2 columns for grid and 1 for list
          keyExtractor={(item, index) => index.toString()}
          style={{ paddingLeft: 8 }}
          refreshing
        />
      ) : (
        /* Show Message when data is empty */
        <View className="flex-1 items-center justify-center mt-[50%]">
          <Text className="text-[18px] text-center font-PlusJakartaSansBold text-[#f4f4f4]">
            No {title}
          </Text>
          <Text className="text-[16px] text-center font-PlusJakartaSans text-[#787A80] mt-4">
            Go stream some songs and your recently played will appear here!
          </Text>
        </View>
      )}
    </View>
  );
};

export default ToggleFlatListView;
