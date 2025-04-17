import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { GridViewIcon, ListViewIcon } from '@hugeicons/react-native';
import { MotiView } from 'moti';

interface ToggleFlatListViewProps {
  data: any[];
  GridComponent: React.ComponentType<any>;
  ListComponent: React.ComponentType<any>;
  title: string;
  loading: boolean;
  error?: any;
  renderItem?: (item: any) => any;
}

const ToggleFlatListView = ({
  data,
  GridComponent,
  ListComponent,
  title,
  loading,
  error,
  renderItem = (item) => item
}: ToggleFlatListViewProps) => {
  const [isGridView, setIsGridView] = useState(false);

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  if (error) {
    return (
      <View className="flex-1 items-center justify-center mt-[50%]">
        <Text className="text-[18px] text-center font-PlusJakartaSansBold text-[#f4f4f4]">
          Error loading {title}
        </Text>
        <Text className="text-[16px] text-center font-PlusJakartaSans text-[#787A80] mt-4">
          Please try again later
        </Text>
      </View>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          {[...Array(6)].map((_, index) => (
            <MotiView
              key={`skeleton-${index}`}
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
      );
    }

    if (!data || data.length === 0) {
      return (
        <View className="flex-1 items-center justify-center mt-[50%]">
          <Text className="text-[18px] text-center font-PlusJakartaSansBold text-[#f4f4f4]">
            No {title}
          </Text>
          <Text className="text-[16px] text-center font-PlusJakartaSans text-[#787A80] mt-4">
            Nothing to show here yet!
          </Text>
        </View>
      );
    }

    // Remove duplicates based on _id
    const uniqueData = data.filter((item, index, self) =>
      index === self.findIndex((t) => t._id === item._id)
    );

    return (
      <FlatList
        key={isGridView ? 'grid' : 'list'}
        data={uniqueData}
        renderItem={({ item }) => {
          const adaptedItem = renderItem(item);
          return isGridView ? (
            <GridComponent item={adaptedItem} />
          ) : (
            <ListComponent item={adaptedItem} />
          );
        }}
        numColumns={isGridView ? 2 : 1}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        style={{ paddingLeft: 8 }}
        refreshing={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    );
  };

  return (
    <View className="mt-[38px]">
      <View className="flex-row items-center justify-between px-2 w-full">
        <Text className="text-[24px] font-PlusJakartaSansBold text-[#f4f4f4]">
          {title}
        </Text>
        <TouchableOpacity onPress={toggleView} className='border-[1.25px] border-[#202227] p-[8px] rounded-[6.25px]'>
          {isGridView ? (
           <GridViewIcon size={24} color="#787A80" variant="stroke" />
          ) : (
            <ListViewIcon size={24} color="#787A80" variant="solid" />
          )}
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
};

export default ToggleFlatListView;
