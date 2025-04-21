import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageViewer from './ImageViewer';

interface ImageGridProps {
  thumbnails: string[];
}

export const ImageGrid: React.FC<ImageGridProps> = ({ thumbnails }) => {
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { width } = Dimensions.get('window');
  const imageWidth = width - 28;

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setIsViewerVisible(true);
  };

  // Add this at the top of the component
  React.useEffect(() => {
    // Preload images
    FastImage.preload(
      thumbnails.map(uri => ({
        uri,
        priority: FastImage.priority.normal,
      }))
    );
  }, [thumbnails]);

  const renderImageGrid = () => {
    if (thumbnails.length === 4) {
      return (
        <>
          <View style={styles.row} className='gap-x-4 py-2'>
            <TouchableOpacity
                              onPress={() => handleImagePress(0)}
                              className="rounded-tl-xl overflow-hidden"
                            >
                              <FastImage
                                source={{
                                  uri: thumbnails[0],
                                  priority: FastImage.priority.normal,
                                  cache: FastImage.cacheControl.immutable
                                }}
                                style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
                                className="rounded-tl-xl"
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImagePress(0)}  className="rounded-tr-xl overflow-hidden">
              <FastImage
                source={{
                  uri: thumbnails[1],
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable
                }}
                style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.row} className='gap-x-4'>
            <TouchableOpacity onPress={() => handleImagePress(2)} className="rounded-bl-xl overflow-hidden">
              <FastImage
                source={{
                    uri: thumbnails[2],
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable
                 }}
                style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImagePress(3)} className="rounded-br-xl overflow-hidden">
              <FastImage
                source={{
                    uri: thumbnails[3],
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable
                 }}
                style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          </View>
        </>
      );
    } else if (thumbnails.length === 3) {
      return (
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleImagePress(0)}>
            <FastImage
              source={{
                uri: thumbnails[0],
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable
               }}
              style={[styles.largeImage, { width: (imageWidth * 2) / 3 - 2 }]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <View style={styles.column}>
            <TouchableOpacity onPress={() => handleImagePress(1)}>
              <FastImage
                source={{
                    uri: thumbnails[1],
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable
                 }}
                style={[styles.smallImage, { width: imageWidth / 3 - 2 }]}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImagePress(2)}>
              <FastImage
                source={{
                    uri: thumbnails[2],
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable
                 }}
                style={[styles.smallImage, { width: imageWidth / 3 - 2 }]}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (thumbnails.length === 2) {
      return (
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleImagePress(0)}>
            <FastImage
              source={{
                uri: thumbnails[0],
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable
               }}
              style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImagePress(1)}>
            <FastImage
              source={{
                uri: thumbnails[1],
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable
               }}
              style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
        </View>
      );
    } else if (thumbnails.length === 1) {
      return (
        <TouchableOpacity onPress={() => handleImagePress(0)}>
          <FastImage
            source={{
                uri: thumbnails[0],
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable
             }}
            style={[styles.fullImage, { width: imageWidth }]}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderImageGrid()}
      <ImageViewer
        images={thumbnails}
        visible={isViewerVisible}
        initialIndex={selectedImageIndex}
        onClose={() => setIsViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Center the grid horizontally
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4, // Consistent gap between rows
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 4, // Gap between large image and small images
  },
  fullImage: {
    height: 300,
    borderRadius: 8,
  },
  halfImage: {
    height: 210,
    overflow: 'hidden',
  },
  largeImage: {
    height: 400,
    borderRadius: 8,
  },
  smallImage: {
    height: 195,
    borderRadius: 8,
    marginBottom: 4, // Gap between small images
  },
});

export default ImageGrid;
