import React, { createContext, useContext, useState } from 'react';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  duration: number;
}

interface SongContextType {
  currentlyPlayingSong: Song | null;
  setCurrentlyPlayingSong: (song: Song) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentlyPlayingSong, setCurrentlyPlayingSong] = useState<Song | null>(null);

  return (
    <SongContext.Provider value={{ currentlyPlayingSong, setCurrentlyPlayingSong }}>
      {children}
    </SongContext.Provider>
  );
};

export const useSong = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error('useSong must be used within a SongProvider');
  }
  return context;
};
