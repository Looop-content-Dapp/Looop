import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ReleaseCard from '../../cards/ArtistReleaseCard';

const Releases = () => {
    const artistReleases = [
        {
          id: '1',
          title: 'HEIS',
          type: 'Album',
          date: '11 July, 2024',
          coverImage: 'https://link-to-image.com/heis.jpg',
          streams: 103748389,
          tracks: [
            { title: 'MARCH AM', streams: 13893382 },
            { title: 'AZAMAN', streams: 13893382 },
            { title: 'HEHEHE', streams: 13893382 },
            { title: 'YAYO', streams: 13893382 },
            { title: 'BENIN BOYS', streams: 13893382 },
            { title: 'HEIS', streams: 13893382 },
          ],
        },
        {
          id: '2',
          title: 'BENIN BOYS',
          type: 'Single',
          date: '06 June, 2024',
          coverImage: 'https://link-to-image.com/beninboys.jpg',
          streams: 23737109,
          tracks: [
            { title: 'BENIN BOYS', streams: 13893382 },
          ],
        },
      ];
  return (
    <View style={{flex: 1}}>
       <FlatList
        data={artistReleases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReleaseCard {...item} />
        )}
        contentContainerStyle={{rowGap: 32}}
      />
    </View>
  )
}

export default Releases
