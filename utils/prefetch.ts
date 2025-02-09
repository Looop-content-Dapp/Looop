import api from '@/config/apiConfig';

export const prefetchArtistData = async (artistId: string) => {
  try {
    const [artistResponse, communityResponse] = await Promise.all([
      api.get(`/api/artist/${artistId}`),
      api.get(`/api/community/${artistId}`)
    ]);

    return {
      artist: artistResponse.data.data.artist,
      community: communityResponse.data.data
    };
  } catch (error) {
    console.error('Error prefetching artist data:', error);
    throw error;
  }
};

export const prefetchCommunityData = async (communityId: string) => {
  try {
    const response = await api.get(`/api/community/${communityId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error prefetching community data:', error);
    throw error;
  }
};