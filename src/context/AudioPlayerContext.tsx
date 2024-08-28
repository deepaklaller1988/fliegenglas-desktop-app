"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { saveAudios } from "utils/indexeddb";
import { generateToken } from "utils/token";

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
  paid: boolean;
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
  handleDownloadAll: () => void;
  downloadPercentage: number;
  alreadyDownloaded: boolean;
  downloading: boolean;
  setAlreadyDownloaded: any;
  open: boolean;
  setOpen: any;
  downloadCategoryId: number;
}

interface AudioAttributes {
  file: string;
  title: string;
  duration: string;
  id: string;
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
  const [downloading, setDownloading] = useState<boolean>(false);
  const [alreadyDownloaded, setAlreadyDownloaded] = useState<boolean>(false);
  const [downloadPercentage, setDownloadPercentage] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [downloadCategoryId, setdownloadCategoryId] = useState<any>();

  const showPlayer = (detail: AudioDetail) => {
    setAudioDetail(detail);
    setIsVisible(true);
    setMini(false);
    setPlay(true);
  };

  const closePlayer = () => {
    setPlay(false);
    setMini(false);
    setShowList(false);
    setIsVisible(false);
  };

  const miniPlayer = () => {
    setMini(!mini);
    setOpen(false);
  };

  const handleCurrentAudio = (index: number) => {
    setCurrentAudio(index);
    setPlay(true);
  };

  const handleShowList = () => {
    setShowList(!showList);
  };

  const handleDownloadAll1 = async () => {
    if (!audioDetail?.list || audioDetail.list.length === 0) {
      console.log("No audio files to download");
      return;
    }
    setDownloading(true);

    const payload = {
      title: audioDetail?.list[0].title,
      file: audioDetail?.list[0].file,
      duration: audioDetail?.list[0].duration,
      id: audioDetail?.list[0].id,
    };

    // const payload = {
    //   audios: audioDetail?.list.map((audio: any) => ({
    //     title: audio.title,
    //     file: audio.file,
    //     duration: audio.duration,
    //     id: audio.id,
    //   })),
    // };

    const token = await generateToken(payload);
    const response = await fetch("/api/download-audio", {
      method: "POST",
      body: JSON.stringify(token),
    });

    // const data = await response.arrayBuffer();
    const data = await response.arrayBuffer();

    setAlreadyDownloaded(true);
    setDownloading(false);

    // await saveAudios({categoryID: audioDetail?.categoryID, categoryName: audioDetail?.categoryName, primaryCategory: audioDetail?.primaryCategory, imageUrl: audioDetail?.imageUrl, shareurl: audioDetail?.shareurl, audios: data});

    // try {
    //   setDownloading(true);

    //   setDownloadPercentage(0);

    //   setDownloading(false);
    //   console.log(
    //     "All valid audios have been downloaded and saved successfully"
    //   );
    //   setAlreadyDownloaded(true);
    // } catch (error) {
    //   setDownloading(false);
    //   console.error("Failed to download all audios", error);
    // }
  };

  const handleDownloadAll = async () => {
    if (!audioDetail?.list || audioDetail.list.length === 0) {
      console.log("No audio files to download");
      return;
    }
    setDownloading(true);
    setDownloadPercentage(0);
    setdownloadCategoryId(Number(audioDetail?.categoryID));

    try {
      for (let i = 0; i < audioDetail.list.length; i++) {
        const audio = audioDetail.list[i];
        const payload = {
          file: audio.file,
        };

        const token = await generateToken(payload);

        const response = await fetch("/api/download-audio", {
          method: "POST",
          body: JSON.stringify(token),
        });

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();

          await saveAudios(
            audioDetail.categoryID,
            audioDetail.categoryName,
            audioDetail.primaryCategory,
            audioDetail.imageUrl,
            audioDetail.shareurl,
            [
              {
                id: audio.id,
                data: arrayBuffer,
                title: audio.title,
                duration: audio.duration,
                name: audio.name,
              },
            ]
          );

          console.log(
            `Downloaded and saved audio ${i + 1}/${audioDetail.list.length}`
          );
          setDownloadPercentage(
            parseFloat((((i + 1) / audioDetail.list.length) * 100).toFixed(1))
          );
        } else {
          console.error(
            `Failed to download audio ${i + 1}: ${response.statusText}`
          );
        }
      }

      console.log("All files have been downloaded and saved to IndexedDB");
      setAlreadyDownloaded(true);
    } catch (error) {
      console.error("Failed to download and save files", error);
    } finally {
      setDownloading(false);
    }
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
        handleDownloadAll,
        downloadPercentage,
        alreadyDownloaded,
        downloading,
        setAlreadyDownloaded,
        open,
        setOpen,
        downloadCategoryId,
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
