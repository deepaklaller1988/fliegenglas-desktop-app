"use client";

import useNetworkCheck from "@hooks/useNetworkCheck";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { saveAudios } from "utils/audioPlayerIndexedDB";
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

  const { isOnline } = useNetworkCheck();

  useEffect(() => {
    closePlayer();
  }, [isOnline]);

  const showPlayer = (detail: AudioDetail) => {
    setAudioDetail(detail);
    setPlay(true);
    setCurrentAudio(0);
    setMini(false);
    setIsVisible(true);
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
