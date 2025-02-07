import React, { createContext, useContext, useState } from 'react';

interface Track {
  trackName: string;
  songType: string;
  audioFile: {
    uri: string;
    name: string;
    type: string;
    size: number;
  } | null;
  explicitLyrics: string;
  writers: string[];
  producers: string[];
  isrc: string;
  featuredArtists: string[];
}

interface AlbumData {
  albumName: string;
  numberOfSongs: string;
  primaryGenre: string;
  secondaryGenre: string;
  coverImage: {
    uri: string;
    name: string;
    type: string;
    size: number;
  } | null;
  tracks: Track[];
}

interface AlbumUploadContextType {
  albumData: AlbumData;
  updateAlbumData: (data: Partial<AlbumData>) => void;
  updateTrackData: (index: number, data: Partial<Track>) => void;
}

const AlbumUploadContext = createContext<AlbumUploadContextType | null>(null);

export const AlbumUploadProvider = ({ children }: { children: React.ReactNode }) => {
  const [albumData, setAlbumData] = useState<AlbumData>({
    albumName: '',
    numberOfSongs: '',
    primaryGenre: '',
    secondaryGenre: '',
    coverImage: null,
    tracks: []
  });

  const updateAlbumData = (data: Partial<AlbumData>) => {
    setAlbumData(prev => ({ ...prev, ...data }));
  };

  const updateTrackData = (index: number, data: Partial<Track>) => {
    setAlbumData(prev => ({
      ...prev,
      tracks: prev.tracks.map((track, i) =>
        i === index ? { ...track, ...data } : track
      )
    }));
  };

  return (
    <AlbumUploadContext.Provider value={{ albumData, updateAlbumData, updateTrackData }}>
      {children}
    </AlbumUploadContext.Provider>
  );
};

export const useAlbumUpload = () => {
  const context = useContext(AlbumUploadContext);
  if (!context) {
    throw new Error('useAlbumUpload must be used within AlbumUploadProvider');
  }
  return context;
};