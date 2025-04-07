import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
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

  const renderImageGrid = () => {
    if (thumbnails.length === 4) {
      return (
        <>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleImagePress(0)}>
              <Image
                source={{ uri: thumbnails[0] }}
                style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImagePress(1)}>
              <Image
                source={{ uri: thumbnails[1] }}
                style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleImagePress(2)}>
              <Image
                source={{ uri: thumbnails[2] }}
                style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImagePress(3)}>
              <Image
                source={{ uri: thumbnails[3] }}
                style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
              />
            </TouchableOpacity>
          </View>
        </>
      );
    } else if (thumbnails.length === 3) {
      return (
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleImagePress(0)}>
            <Image
              source={{ uri: thumbnails[0] }}
              style={[styles.largeImage, { width: (imageWidth * 2) / 3 - 2 }]}
            />
          </TouchableOpacity>
          <View style={styles.column}>
            <TouchableOpacity onPress={() => handleImagePress(1)}>
              <Image
                source={{ uri: thumbnails[1] }}
                style={[styles.smallImage, { width: imageWidth / 3 - 2 }]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImagePress(2)}>
              <Image
                source={{ uri: thumbnails[2] }}
                style={[styles.smallImage, { width: imageWidth / 3 - 2 }]}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (thumbnails.length === 2) {
      return (
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleImagePress(0)}>
            <Image
              source={{ uri: thumbnails[0] }}
              style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImagePress(1)}>
            <Image
              source={{ uri: thumbnails[1] }}
              style={[styles.halfImage, { width: imageWidth / 2 - 2 }]}
            />
          </TouchableOpacity>
        </View>
      );
    } else if (thumbnails.length === 1) {
      return (
        <TouchableOpacity onPress={() => handleImagePress(0)}>
          <Image
            source={{ uri: thumbnails[0] }}
            style={[styles.fullImage, { width: imageWidth }]}
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
    borderRadius: 15,
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
