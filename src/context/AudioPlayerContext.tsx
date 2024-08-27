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

  const showPlayer = (detail: AudioDetail) => {
    setAudioDetail(detail);
    setIsVisible(true);
    setMini(false);
    setPlay(true);
  };

  console.log(audioDetail, "audio===");

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
    setPlay(true);
  };

  const handleShowList = () => {
    setShowList(!showList);
  };

  // const handleDownloadAll = async () => {
  //   if (!audioDetail?.list || audioDetail.list.length === 0) {
  //     console.log("No audio files to download");
  //     return;
  //   }
  //   setDownloading(true);

  //   const payload = {
  //     audios: audioDetail?.list.map((audio: any) => ({
  //       title: audio.title,
  //       file: audio.file,
  //       duration: audio.duration,
  //       id: audio.id,
  //     })),
  //   };

  //   const token = await generateToken(payload);
  //   const response = await fetch("/api/download-audio", {
  //     method: "POST",
  //     body: JSON.stringify(token),
  //   });

  //   console.log(response, "two");
  //   // const data = await response.arrayBuffer();
  //   const data = await response.json();

  //   console.log(data, "three");
  //   setAlreadyDownloaded(true);
  //   setDownloading(false);

  //   // await saveAudios({categoryID: audioDetail?.categoryID, categoryName: audioDetail?.categoryName, primaryCategory: audioDetail?.primaryCategory, imageUrl: audioDetail?.imageUrl, shareurl: audioDetail?.shareurl, audios: data});

  //   // try {
  //   //   setDownloading(true);

  //   //   setDownloadPercentage(0);

  //   //   setDownloading(false);
  //   //   console.log(
  //   //     "All valid audios have been downloaded and saved successfully"
  //   //   );
  //   //   setAlreadyDownloaded(true);
  //   // } catch (error) {
  //   //   setDownloading(false);
  //   //   console.error("Failed to download all audios", error);
  //   // }
  // };

  const handleDownloadAll = async () => {
    if (!audioDetail || audioDetail.list?.length === 0) {
      console.log("No audio files to download");
      return;
    }

    try {
      let progress = 0;

      // const buffers: any = await Promise.all(
      //   audioDetail.list?.map(async (audio: AudioAttributes) => {
      //     const response = await fetch(audio.file);
      //     if (!response.ok) {
      //       throw new Error(
      //         `Failed to fetch ${audio.file}: ${response.statusText}`
      //       );
      //     }
      //     const arrayBuffer = await response.arrayBuffer();
      //     console.log(
      //       arrayBuffer.byteLength,
      //       "==========================================="
      //     );
      //     if (arrayBuffer.byteLength === 0) {
      //       console.warn(`Received empty ArrayBuffer for ${audio.file}`);
      //     }
      //     progress += 1;
      //     console.log(
      //       `Progress: ${progress}/${audioDetail.list.length} -${response}- =${arrayBuffer}= files downloaded`
      //     );
      //     console.log(response, "RESPONSE");
      //     console.log(arrayBuffer, "arrayBuffer");
      //     return {
      //       id: audio.id,
      //       title: audio.title,
      //       duration: audio.duration,
      //       buffer: arrayBuffer,
      //     };
      //   })
      // );

      const buffers: any = await Promise.all(
        audioDetail.list?.map(async (audio: AudioAttributes, index: number) => {
          const response = await fetch(audio.file);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch ${audio.file}: ${response.statusText}`
            );
          }
          const arrayBuffer = await response.arrayBuffer();
          console.log(
            arrayBuffer.byteLength,
            "==========================================="
          );
          if (arrayBuffer.byteLength === 0) {
            console.warn(`Received empty ArrayBuffer for ${audio.file}`);
          }
          progress += 1;
          console.log(
            `Progress: ${progress}/${audioDetail.list.length} -${response}- =${arrayBuffer}= files downloaded`
          );
          console.log(response, "RESPONSE");
          console.log(arrayBuffer, "arrayBuffer");
          return {
            id: audio.id,
            title: audio.title,
            duration: audio.duration,
            buffer: arrayBuffer,
          };
        })
      );

      await saveAudios(
        audioDetail.categoryID,
        audioDetail.categoryName,
        audioDetail.primaryCategory,
        audioDetail.imageUrl,
        audioDetail.shareurl,
        buffers
      );

      console.log("All files have been downloaded and saved to IndexedDB");
    } catch (error) {
      console.error("Failed to download and save files", error);
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
