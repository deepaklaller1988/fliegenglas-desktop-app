"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { saveAudios } from "utils/indexeddb";

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

  const handleDownloadAll = async () => {
    const maxConcurrentDownloads = 125;
    console.log("clicked", audioDetail?.list);
    if (!audioDetail?.list || audioDetail.list.length === 0) {
      console.log("No audio files to download");
      return;
    }

    try {
      setDownloading(true);
      const totalAudios = audioDetail.list.length;
      let totalSegments = 0;
      let downloadedSegments = 0;
      setDownloadPercentage(0);

      const downloadSegment = async (segmentUrl: string) => {
        try {
          const segmentResponse = await fetch(segmentUrl);
          if (!segmentResponse.ok) {
            throw new Error(`Failed to download segment ${segmentUrl}`);
          }
          const segment = await segmentResponse.arrayBuffer();

          // Update progress
          downloadedSegments++;
          const progress = Number(
            ((downloadedSegments / totalSegments) * 100).toFixed(2)
          );
          setDownloadPercentage(progress);

          return segment;
        } catch (error) {
          console.error(`Error downloading segment ${segmentUrl}:`, error);
          throw error;
        }
      };

      const downloadSequentially = async (audio: any) => {
        const { m3u8, id, name, title, duration } = audio;
        const imageUrl = audioDetail?.imageUrl;
        const shareurl = audioDetail?.shareurl;
        const primaryCategory = audioDetail?.primaryCategory;

        try {
          const response = await fetch(m3u8);
          if (!response.ok) {
            throw new Error(`Failed to download M3U8 file from ${m3u8}`);
          }
          const m3u8Text = await response.text();

          const segmentUrls = m3u8Text
            .split("\n")
            .filter((line) => line && !line.startsWith("#"))
            .map((line) => new URL(line, m3u8).toString());

          totalSegments += segmentUrls.length;

          const segments = [];
          for (const segmentUrl of segmentUrls) {
            const segment = await downloadSegment(segmentUrl);
            segments.push(segment);
          }

          const totalLength = segments.reduce(
            (acc, segment) => acc + segment.byteLength,
            0
          );
          const concatenatedBuffer = new Uint8Array(totalLength);

          let offset = 0;
          for (const segment of segments) {
            concatenatedBuffer.set(new Uint8Array(segment), offset);
            offset += segment.byteLength;
          }

          return {
            id,
            data: concatenatedBuffer.buffer, // ArrayBuffer
            local_image: imageUrl,
            name,
            title,
            duration,
            shareurl,
            primaryCategory,
          };
        } catch (error) {
          console.error(`Failed to process audio ${m3u8}:`, error);
          return null;
        }
      };

      const downloadInBatches = async () => {
        for (let i = 0; i < totalAudios; i += maxConcurrentDownloads) {
          const batch = audioDetail.list.slice(i, i + maxConcurrentDownloads);
          const results = await Promise.all(
            batch.map((audio: any) => downloadSequentially(audio))
          );
          const validAudios = results.filter((audio) => audio !== null);

          if (validAudios.length > 0) {
            await saveAudios(
              audioDetail?.categoryID,
              audioDetail?.categoryName,
              audioDetail?.primaryCategory,
              audioDetail?.imageUrl,
              audioDetail?.shareurl,
              validAudios as Array<{
                id: string;
                data: ArrayBuffer;
                name: string;
              }>
            );
          }
        }
      };

      await downloadInBatches();

      setDownloading(false);
      console.log(
        "All valid audios have been downloaded and saved successfully"
      );
      setAlreadyDownloaded(true);
    } catch (error) {
      setDownloading(false);
      console.error("Failed to download all audios", error);
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
