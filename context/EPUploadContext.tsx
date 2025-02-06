import React, { createContext, useContext, useState } from 'react';

interface Track {
  trackName: string;
  songType: string;
  creatorUrl: string;
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
}

interface EPData {
  epName: string;
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

interface EPUploadContextType {
  epData: EPData;
  updateEPData: (data: Partial<EPData>) => void;
  updateTrackData: (index: number, data: Partial<Track>) => void;
}

const EPUploadContext = createContext<EPUploadContextType | null>(null);

export const EPUploadProvider = ({ children }: { children: React.ReactNode }) => {
  const [epData, setEPData] = useState<EPData>({
    epName: '',
    numberOfSongs: '',
    primaryGenre: '',
    secondaryGenre: '',
    coverImage: null,
    tracks: []
  });

  const updateEPData = (data: Partial<EPData>) => {
    setEPData(prev => ({ ...prev, ...data }));
  };

  const updateTrackData = (index: number, data: Partial<Track>) => {
    setEPData(prev => ({
      ...prev,
      tracks: prev.tracks.map((track, i) =>
        i === index ? { ...track, ...data } : track
      )
    }));
  };

  return (
    <EPUploadContext.Provider value={{ epData, updateEPData, updateTrackData }}>
      {children}
    </EPUploadContext.Provider>
  );
};

export const useEPUpload = () => {
  const context = useContext(EPUploadContext);
  if (!context) {
    throw new Error('useEPUpload must be used within EPUploadProvider');
  }
  return context;
};