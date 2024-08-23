"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AudioDetail {
  categoryID: string;
  categoryName: string;
  audioUrl?: any;
  imageUrl: string;
  backgroundImageUrl: string;
  artist: string;
  shareurl: string;
  list?: any;
  primaryCategory?: any;
}

interface AudioPlayerContextType {
  isVisible: boolean;
  audioDetail?: AudioDetail;
  showPlayer: (detail: AudioDetail) => void;
  closePlayer: () => void;
  mini: boolean;
  miniPlayer: () => void;
  currentAudio: number;
  handleCurrentAudio: (index: number) => void;
  showList: boolean;
  handleShowList: () => void;
  play: boolean;
  setPlay: any;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [mini, setMini] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState(0);
  const [audioDetail, setAudioDetail] = useState<AudioDetail>();
  const [play, setPlay] = useState(true);

  const showPlayer = (detail: AudioDetail) => {
    setAudioDetail(detail);
    setIsVisible(true);
    setMini(false);
  };

  const closePlayer = () => {
    setIsVisible(false);
    setMini(false);
    setShowList(false);
    setPlay(false);
  };

  const miniPlayer = () => {
    setMini(!mini);
  };

  const handleCurrentAudio = (index: number) => {
    setCurrentAudio(index);
  };

  const handleShowList = () => {
    setShowList(!showList);
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
        currentAudio,
        handleCurrentAudio,
        showList,
        handleShowList,
        play,
        setPlay,
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
