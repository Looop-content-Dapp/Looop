import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useQuery } from '../../hooks/useQuery'
import { Artist } from '../../utils/types'
import Hottest from '../cards/Hottest'
import AlbumsAndEps from '../cards/AlbumsAndEps'
import Singles from '../cards/Singles'

type Props ={
    artistId: string
}

const ArtistReleases = ({artistId}: Props) => {
    const {getSinglesForArtist, getTopSongsForArtist, getAlbumsAndEP}= useQuery()
    const [artistSingles, setArtistSingles] = useState ();
    const [topSongs, setTopSongs] = useState([]);
    const [artistAlbums, setArtistAlbumsa]= useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const [topSongsData, ablum, single] = await Promise.all([
              getTopSongsForArtist(artistId ? artistId :"66f25f518ceaa671b0d73a58"),
              getAlbumsAndEP(artistId ? artistId :"66f25f518ceaa671b0d73a58"),
              getSinglesForArtist(artistId ? artistId :"66f25f518ceaa671b0d73a58")
            ]);

            setArtistSingles(single.data);
            setTopSongs(topSongsData?.data);
            setArtistAlbumsa(ablum.data)
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setIsLoading(false);
          }
        };

        fetchData();
      }, []);
  return (
    <>
         <Hottest songs={topSongs} isLoading={isLoading} />
         <AlbumsAndEps songs={artistAlbums} isLoading={isLoading} />
         <Singles songs={artistSingles} isLoading={isLoading} />
    </>
  )
}

export default ArtistReleases
