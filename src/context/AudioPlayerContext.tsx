"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AudioDetail {
  audioUrl: string;
  imageUrl: string;
  backgroundImageUrl: string;
  audioID: string;
  artist: string;
  shareurl: string;
  name: string;
}

interface AudioPlayerContextType {
  isVisible: boolean;
  audioDetail?: AudioDetail;
  showPlayer: (detail: AudioDetail) => void;
  closePlayer: () => void;
  mini: boolean;
  miniPlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [mini, setMini] = useState<boolean>(false);
  const [audioDetail, setAudioDetail] = useState<AudioDetail | undefined>(
    undefined
  );

  const showPlayer = (detail: AudioDetail) => {
    setAudioDetail(detail);
    setIsVisible(true);
  };

  const closePlayer = () => {
    setIsVisible(false);
  };

  const miniPlayer = () => {
    setMini(!mini);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        isVisible,
        audioDetail,
        showPlayer,
        closePlayer,
        mini,
        miniPlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
