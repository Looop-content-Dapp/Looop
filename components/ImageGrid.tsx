import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export const ImageGrid = ({ thumbnails }) => {

  const renderImageGrid = () => {
    if (thumbnails.length === 4) {
      return (
        <>
          <View style={styles.row}>
            <Image source={{ uri: thumbnails[0] }} style={styles.halfImage} />
            <Image source={{ uri: thumbnails[1] }} style={styles.halfImage} />
          </View>
          <View style={styles.row}>
            <Image source={{ uri: thumbnails[2] }} style={styles.halfImage} />
            <Image source={{ uri: thumbnails[3] }} style={styles.halfImage} />
          </View>
        </>
      );
    } else if (thumbnails.length === 3) {
      return (
        <>
          <View style={styles.row}>
            <Image source={{ uri: thumbnails[0] }} style={styles.largeImage} />
            <View style={styles.column}>
              <Image source={{ uri: thumbnails[1] }} style={styles.smallImage} />
              <Image source={{ uri: thumbnails[2] }} style={styles.smallImage} />
            </View>
          </View>
        </>
      );
    } else if (thumbnails.length === 2) {
      return (
        <>
          <View style={styles.row}>
            <Image source={{ uri: thumbnails[0] }} style={styles.halfImage} />
            <Image source={{ uri: thumbnails[1] }} style={styles.halfImage} />
          </View>
        </>
      );
    } else if (thumbnails.length === 1) {
      return (
        <>
          <Image source={{ uri: thumbnails[0] }} style={styles.fullImage} />
        </>
      );
    }
  };

  return (
    <>
      {renderImageGrid()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
  },
  fullImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  halfImage: {
    width: '49.5%',
    height: 210,
    borderRadius: 8,
  },
  largeImage: {
    width: '65%',
    height: 400,
    borderRadius: 8,
  },
  smallImage: {
    width: '100%',
    height: 195,
    marginBottom: 10,
    borderRadius: 8,
  },
});

export default ImageGrid;
