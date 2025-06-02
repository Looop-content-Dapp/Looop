import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useQuery } from '../../hooks/useQuery'
import Hottest from '../cards/Hottest'
import AlbumsAndEps from '../cards/AlbumsAndEps'
import Singles from '../cards/Singles'

type Props ={
    artistId: string
}

const ArtistReleases = ({artistId}: Props) => {
    const {getSinglesForArtist, getTopSongsForArtist, getAlbumsAndEP}= useQuery()
    const [artistSingles, setArtistSingles] = useState([]);
    const [topSongs, setTopSongs] = useState([]);
    const [artistAlbums, setArtistAlbums] = useState([]); // Fixed typo in setter name
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const topSongsData = await getTopSongsForArtist(artistId);
                setTopSongs(topSongsData?.data || []);
                const albumData = await getAlbumsAndEP(artistId);
                setArtistAlbums(albumData?.data || []); // Added null check
                const singlesData = await getSinglesForArtist(artistId);
                setArtistSingles(singlesData?.data || []); // Added null check
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, [artistId]);
  return (
    <View className='flex-1'>
         <Hottest songs={topSongs} isLoading={isLoading} />
         <AlbumsAndEps songs={artistAlbums} isLoading={isLoading} />
         <Singles songs={artistSingles} isLoading={isLoading} />
    </View>
  )
}

export default ArtistReleases
