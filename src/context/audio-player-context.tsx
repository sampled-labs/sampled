import { createContext, use, useState, ReactNode, useEffect } from "react";
import { AudioPlayerData, useAudioPlayer } from "../hooks/useAudioPlayer";

interface Track {
  url: string;
  title: string;
  artist: string;
  artwork: string;
}

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlayerVisible: boolean;
  playTrack: (track: Track) => void;
  hidePlayer: () => void;
  audioPlayer: AudioPlayerData;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined,
);

export const useAudioPlayerContext = () => {
  const context = use(AudioPlayerContext);
  if (!context) {
    throw new Error(
      "useAudioPlayerContext must be used within AudioPlayerProvider",
    );
  }
  return context;
};

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider = ({ children }: AudioPlayerProviderProps) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const audioPlayer = useAudioPlayer({ url: currentTrack?.url || "" });

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlayerVisible(true);
  };

  const hidePlayer = () => {
    // Pausing is idempotent; toggling here previously started paused audio.
    audioPlayer.pause();
    setIsPlayerVisible(false);
    setCurrentTrack(null);
  };

  useEffect(() => {
    if (isPlayerVisible && currentTrack) {
      audioPlayer.play();
    }
  }, [isPlayerVisible, currentTrack, audioPlayer.play]);

  return (
    <AudioPlayerContext
      value={{
        currentTrack,
        isPlayerVisible,
        playTrack,
        hidePlayer,
        audioPlayer,
      }}
    >
      {children}
    </AudioPlayerContext>
  );
};
