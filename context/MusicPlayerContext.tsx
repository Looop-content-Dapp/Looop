import useMusicPlayer from '@/hooks/useMusicPlayer';
import { createContext, useContext } from 'react';

// Define the context with a default value of null
const MusicPlayerContext = createContext<ReturnType<typeof useMusicPlayer> | null>(null);

// Hook to access the context
export const useMusicPlayerContext = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayerContext must be used within a MusicPlayerProvider');
  }
  return context;
};

// Provider component that wraps the app and provides the music player instance
export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const musicPlayer = useMusicPlayer();
  return (
    <MusicPlayerContext.Provider value={musicPlayer}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
