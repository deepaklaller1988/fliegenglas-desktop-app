"use client";

import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import Image from "next/image";
import {
  FaCirclePlay,
  FaCirclePause,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa6";
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { TbRewindBackward10, TbRewindForward10 } from "react-icons/tb";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoMdClose, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { MdFormatListBulleted } from "react-icons/md";
import { PiShareFatLight } from "react-icons/pi";
import FlieLoaderCustom from "./core/FlieLoaderCustom";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import { useUser } from "context/UserContext";
import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { getAudioByName, saveAudio } from "utils/indexeddb";

interface FliegenglasAudioPlayerProps {
  audioType?: string;
  handleShowPlayer?(): any;
  children?: any;
}

interface GetCounts {
  commented: number;
  likes: string;
  liked: string;
  comments: number;
  shares: number;
  shared: string;
}

const FliegenglasAudioPlayer: React.FC<FliegenglasAudioPlayerProps> = ({
  children,
}) => {
  const [play, setPlay] = useState(true);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [open, setOpen] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [getCounts, setGetCounts] = useState<GetCounts>();
  const [buffering, setBuffering] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(true);
  const playerRef = useRef<ReactPlayer>(null);
  // const [imageUrl, setImageUrl] = useState("");
  const {
    isVisible,
    audioDetail,
    closePlayer,
    mini,
    miniPlayer,
    currentAudio,
    handleCurrentAudio,
    showList,
    handleShowList,
  } = useAudioPlayer();
  const { user }: any = useUser();

  // useEffect(() => {
  //   const storedImage = sessionStorage.getItem("image");
  //   setImageUrl(storedImage || "");
  // }, []);

  const fetchCountData = async () => {
    try {
      let res: any = await API.get(
        `getCounts?&post_id=${audioDetail?.categoryID}&user_id=${
          user?.id
        }&time=${new Date().toString()}`
      );
      setGetCounts(res);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(audioDetail, "audioDetail");

  useEffect(() => {
    if (isVisible) {
      if (mini) {
        document.body.style.overflow = "auto";
      } else {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.style.overflow = "auto";
    }
    if (user) {
      fetchCountData();
    }
  }, [isVisible, mini]);

  if (!isVisible || !audioDetail) return null;

  const togglePlayPause = () => {
    setPlay(!play);
  };

  const handleProgress = (progress: {
    played: number;
    playedSeconds: number;
  }) => {
    if (!seeking) {
      setPlayed(progress.played);
      setPlayedSeconds(progress.playedSeconds);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleNextAudio = () => {
    if (audioDetail?.list.length > currentAudio + 1) {
      handleCurrentAudio(currentAudio + 1);
    } else {
      console.log("Next audio not available");
    }
  };

  const handlePreviousAudio = () => {
    if (currentAudio - 1 !== 0) {
      handleCurrentAudio(currentAudio - 1);
    } else {
      console.log("Previous audio not available");
    }
  };

  const seekBackward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playedSeconds - 10);
    }
  };

  const seekForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playedSeconds + 10);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    setOpen(!open);
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  const minimizePlayer = () => {
    miniPlayer();
  };

  // const handlePlayDownloaded = () => {
  //   const audioBlob = new Blob([audioDetail.audio?.data], {
  //     type: "audio/mpeg",
  //   });
  //   const audioUrl = URL.createObjectURL(audioBlob);
  //   setAudio(audioUrl);
  // };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat(e.currentTarget.value), "fraction");
    }
  };

  const handleLike = async () => {
    try {
      await API.post(
        `likeAudioBook?&id=${audioDetail?.categoryID}&user_id=${
          user?.id
        }&value=like&time=${new Date().toString()}`,
        {
          id: audioDetail?.categoryID,
          userID: user.id,
          time: new Date().toString(),
        }
      );
      fetchCountData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    try {
      await API.post(
        `dislikeAudioBook?&id=${audioDetail?.categoryID}&user_id=${
          user?.id
        }&value=dislike&time=${new Date().toString()}`,
        {
          id: audioDetail?.categoryID,
          userID: user.id,
          time: new Date().toString(),
        }
      );
      fetchCountData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: audioDetail?.name,
          text: `By ${audioDetail?.artist}`,
          url: audioDetail?.shareurl,
        });
        await API.post(
          `share?&id=${audioDetail?.categoryID}&user_id=${
            user?.id
          }&value=like&time=${new Date().toString()}`,
          {
            id: audioDetail?.categoryID,
            userID: user.id,
            time: new Date().toString(),
          }
        );
        fetchCountData();
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      console.log("Web Share API not supported.");
    }
  };

  // const fetchOfflineAudios = async () => {
  //   try {
  //     const allAudios = await getAllAudios();
  //     // setList(allAudios);
  //   } catch (error) {
  //     console.error("Failed to fetch downloaded audios", error);
  //   }
  // };

  const handleDownloadAll = async () => {
    if (!audioDetail?.list || audioDetail.list.length === 0) {
      console.log("No audio files to download");
      return;
    }

    try {
      setDownloading(true);

      console.log(audioDetail.list, audioDetail, "audioDetail.list");

      const downloadPromises = audioDetail.list.map(async (audio: any) => {
        const { m3u8, id, name } = audio;
        let imageUrl = audioDetail?.imageUrl;
        let shareurl = audioDetail?.shareurl;
        let categoryID = audioDetail?.categoryID;

        try {
          const response = await fetch(m3u8);
          if (!response.ok) {
            throw new Error(`Failed to download audio from ${m3u8}`);
          }
          const arrayBuffer = await response.arrayBuffer();
          await saveAudio(
            id,
            categoryID,
            arrayBuffer,
            imageUrl,
            name,
            shareurl
          );
        } catch (error) {
          console.error(`Failed to process audio ${m3u8}:`, error);
        }
      });

      // Wait for all download promises to complete
      await Promise.all(downloadPromises);

      setDownloading(false); // Indicate that the download process has completed
      console.log("All audios have been downloaded successfully");
    } catch (error) {
      setDownloading(false); // Make sure to stop the downloading state even if there's an error
      console.error("Failed to download all audios", error);
    }
  };

  // const handleDownload = async (url: string) => {
  //   try {
  //     const audio = url;

  //     if (!audio) {
  //       throw new Error("Audio details not found");
  //     }

  //     const xhr = new XMLHttpRequest();
  //     xhr.open("GET", audio, true);
  //     xhr.responseType = "arraybuffer";

  //     xhr.onprogress = (event) => {
  //       if (event.lengthComputable) {
  //         const percentComplete = (event.loaded / event.total) * 100;
  //         console.log(`Download Progress: ${percentComplete.toFixed(2)}%`);
  //       }
  //     };

  //     xhr.onload = async () => {
  //       if (xhr.status === 200) {
  //         const arrayBuffer = xhr.response;
  //         if (arrayBuffer.byteLength === 0) {
  //           throw new Error("Downloaded audio buffer is empty");
  //         }

  //         await saveAudio(
  //           audio.id,
  //           arrayBuffer,
  //           audio.local_image,
  //           audio.name,
  //           audio.shareurl
  //         );
  //         console.log("Audio saved successfully");
  //       } else {
  //         throw new Error("Failed to download audio");
  //       }
  //     };

  //     xhr.onerror = () => {
  //       console.error("Failed to download audio");
  //     };

  //     xhr.send();
  //   } catch (error) {
  //     console.error("Failed to handle audio download", error);
  //   }
  // };

  return (
    <>
      {isVisible ? (
        <>
          <ReactPlayer
            ref={playerRef}
            url={`${audioDetail?.list[currentAudio].m3u8}`}
            playing={play}
            onBuffer={() => setBuffering(true)}
            onBufferEnd={() => setBuffering(false)}
            onProgress={handleProgress}
            onDuration={handleDuration}
            playbackRate={playbackRate}
            controls={true}
            width="0"
            height="0"
          />
          {mini ? (
            <div className="sm:h-20 h-40 bottom-0 w-full fixed z-10">
              <div className="absolute inset-0 h-full z-[-1] bg-black">
                <Image
                  src={
                    audioDetail?.imageUrl.includes("assests")
                      ? "/" + audioDetail?.imageUrl
                      : audioDetail?.imageUrl
                  }
                  alt="Background Image"
                  layout="fill"
                  objectFit="cover"
                  className="blur-2xl opacity-65"
                />
              </div>
              <div className="flex sm:flex-row flex-col justify-between items-center ml-5 h-full">
                <div className="h-full flex sm:justify-center justify-between items-center sm:w-auto w-full">
                  <img
                    src={
                      audioDetail?.imageUrl.includes("assests")
                        ? "/" + audioDetail?.imageUrl
                        : audioDetail?.imageUrl
                    }
                    alt="abc"
                    className="h-14 rounded-lg"
                  />
                  <div className="space-x-2 sm:hidden inline h-full">
                    <button
                      className="cursor-pointer p-4 hover:bg-blue-500/40 rounded-full duration-300 text-white"
                      onClick={miniPlayer}
                    >
                      <FaAngleUp />
                    </button>
                    <button
                      className="cursor-pointer p-4 bg-red-500 hover:bg-red-600 rounded-bl-2xl duration-300 text-white"
                      onClick={closePlayer}
                    >
                      <IoMdClose size={22} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center sm:justify-center justify-between w-full">
                  <button
                    className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-2xl text-white"
                    onClick={handlePreviousAudio}
                  >
                    <IoPlaySkipBack size={20} />
                  </button>
                  <button
                    className="cursor-pointer p-4 hover:bg-white/10 rounded-full text-white"
                    onClick={seekBackward}
                  >
                    <TbRewindBackward10 size={20} />
                  </button>
                  {play ? (
                    <button
                      className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[12vw] text-white"
                      onClick={togglePlayPause}
                    >
                      <FaCirclePause size={50} />
                    </button>
                  ) : (
                    <button
                      className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[12vw] text-white"
                      onClick={togglePlayPause}
                    >
                      <FaCirclePlay size={50} />
                    </button>
                  )}
                  <button
                    className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[4vw] text-white"
                    onClick={seekForward}
                  >
                    <TbRewindForward10 />
                  </button>
                  <button
                    className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-white"
                    style={{ fontSize: "10vw" }}
                    onClick={handleNextAudio}
                  >
                    <IoPlaySkipForward />
                  </button>
                </div>
                <div className="sm:flex hidden gap-2 h-full items-center">
                  <button
                    className="cursor-pointer p-4 hover:bg-blue-500/40 rounded-full duration-300 text-white"
                    onClick={miniPlayer}
                  >
                    <FaAngleUp />
                  </button>
                  <button
                    className="cursor-pointer font-bold p-4 px-6 bg-red-500 hover:bg-red-600 h-full duration-300 text-white"
                    onClick={closePlayer}
                  >
                    <IoMdClose size={25} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center h-screen w-screen z-50 fixed top-0 inset-0">
              <div className="w-7/12 sm:w-6/12 md:w-11/12 lg:w-10/12 xl:w-6/12">
                <div>
                  <div className="absolute inset-0 h-full z-[-1] bg-black">
                    <Image
                      src={
                        audioDetail?.imageUrl.includes("assests")
                          ? "/" + audioDetail?.imageUrl
                          : audioDetail?.imageUrl
                      }
                      alt="Background Image"
                      layout="fill"
                      objectFit="cover"
                      className="blur-2xl opacity-65"
                    />
                  </div>
                  {showList && (
                    <div className="absolute inset-0 bg-black z-20 h-full">
                      <div className="absolute inset-0 h-full z-[-1] bg-black">
                        <Image
                          src={
                            audioDetail?.imageUrl.includes("assests")
                              ? "/" + audioDetail?.imageUrl
                              : audioDetail?.imageUrl
                          }
                          alt="Background Image"
                          layout="fill"
                          objectFit="cover"
                          className="blur-2xl opacity-65"
                        />
                      </div>
                      <div className="max-h-screen w-full h-full">
                        <div className="lg:mx-20 flex flex-col">
                          <div className="flex flex-row justify-between items-center h-1/12 pt-8 mx-10 mb-5">
                            <Image
                              src={
                                audioDetail?.imageUrl.includes("assests")
                                  ? "/" + audioDetail?.imageUrl
                                  : audioDetail?.imageUrl
                              }
                              alt="Audio Thumbnail"
                              height={200}
                              width={200}
                              className="rounded-xl shadow-lg h-40 w-auto"
                            />
                            <button
                              className="flex flex-row items-center gap-2 hover:bg-white/10 hover:shadow-xl p-2 rounded-lg duration-300"
                              onClick={handleShowList}
                            >
                              <IoMdClose size={25} />
                              Schließen
                            </button>
                          </div>
                          <ul className="mt-4 flex flex-col gap-3 overflow-y-scroll h-[70vh]">
                            {audioDetail?.list?.length > 0 ? (
                              audioDetail?.list?.map(
                                (item: any, index: number) => (
                                  <li
                                    key={item?.id}
                                    className="rounded-lg py-0 px-4 bg-white/80 text-black hover:bg-white hover:shadow-xl duration-300 cursor-pointer flex flex-row items-center mx-10"
                                  >
                                    <div
                                      className="w-full py-3"
                                      onClick={() => handleCurrentAudio(index)}
                                    >
                                      <h1 className="font-semibold text-lg">
                                        {item?.title}
                                      </h1>
                                      <p className="text-[16px] text-gray-600">
                                        {item?.name}
                                      </p>
                                      <div className="flex justify-between items-center h-7">
                                        <p className="text-gray-500 mt-1">
                                          {item?.duration}
                                        </p>
                                        {index === currentAudio && (
                                          <img
                                            src="/assets/fly.gif"
                                            alt="flie seelctor"
                                            className="h-7"
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                )
                              )
                            ) : (
                              <p className="text-center">No audio found</p>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-row justify-between items-center mb-10 w-full">
                  <button
                    className="p-5 rounded-full hover:bg-white/10 duration-300 sm:text-[3vw] xl:text-[1.5vw] text-[5vw] text-white"
                    onClick={() => minimizePlayer()}
                  >
                    <FaAngleDown />
                  </button>
                  <div className="flex justify-center relative">
                    <button
                      className="p-5 rounded-full hover:bg-white/10 duration-300 text-white"
                      onClick={toggleOpen}
                    >
                      x {playbackRate}
                    </button>

                    <div
                      className={`bg-black/80 rounded-2xl py-4 absolute z-10 mt-20 transition-all duration-300 ${
                        open ? "" : "hidden"
                      }`}
                    >
                      <ul className="text-center">
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl text-white"
                          onClick={() => handlePlaybackRateChange(0.25)}
                        >
                          0.25
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl text-white"
                          onClick={() => handlePlaybackRateChange(0.5)}
                        >
                          0.50
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl text-white"
                          onClick={() => handlePlaybackRateChange(1)}
                        >
                          1
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl text-white"
                          onClick={() => handlePlaybackRateChange(1.25)}
                        >
                          1.25
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl text-white"
                          onClick={() => handlePlaybackRateChange(1.5)}
                        >
                          1.50
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl text-white"
                          onClick={() => handlePlaybackRateChange(1.75)}
                        >
                          1.75
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl text-white"
                          onClick={() => handlePlaybackRateChange(2)}
                        >
                          2
                        </li>
                      </ul>
                    </div>
                  </div>
                  <button
                    className="p-5 rounded-full hover:bg-white/10 duration-300 sm:text-[3vw] xl:text-[1.5vw] text-[5vw] text-white"
                    onClick={handleDownloadAll}
                  >
                    <HiDotsHorizontal />
                  </button>
                </div>
                <div className="flex md:flex-row flex-col h-full">
                  <div className="w-full h-96 relative">
                    {buffering && (
                      <div className="absolute bg-black/50 h-full flex items-center justify-center text-white">
                        <FlieLoaderCustom />
                      </div>
                    )}
                    <Image
                      src={
                        audioDetail?.imageUrl.includes("assests")
                          ? "/" + audioDetail?.imageUrl
                          : audioDetail?.imageUrl
                      }
                      alt="Audio Thumbnail"
                      height={500}
                      width={500}
                      className="w-full h-full w-full object-cover rounded-2xl"
                    />
                  </div>
                  <div className="w-full flex items-center justify-center md:block hidden">
                    <div className="flex flex-col mx-5 w-full">
                      <div className="flex flex-row justify-between">
                        <button
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full text-white"
                          onClick={seekBackward}
                        >
                          <TbRewindBackward10 size={40} />
                        </button>

                        <button
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-white"
                          onClick={seekForward}
                        >
                          <TbRewindForward10 size={40} />
                        </button>
                      </div>
                      <div className="text-center">
                        {play ? (
                          <button
                            className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-white"
                            onClick={togglePlayPause}
                          >
                            <FaCirclePause size={200} />
                          </button>
                        ) : (
                          <button
                            className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-white"
                            onClick={togglePlayPause}
                          >
                            <FaCirclePlay size={200} />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-row justify-between">
                        <button
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-white"
                          onClick={handlePreviousAudio}
                        >
                          <IoPlaySkipBack size={40} />
                        </button>
                        <button
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-white"
                          onClick={handleNextAudio}
                        >
                          <IoPlaySkipForward size={40} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center md:hidden block">
                    <div className="mt-10 flex flex-row justify-between mx-5">
                      <button
                        className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-2xl text-white"
                        onClick={seekBackward}
                      >
                        <IoPlaySkipBack size={20} />
                      </button>
                      <button
                        className="cursor-pointer p-4 hover:bg-white/10 rounded-full text-white"
                        onClick={seekBackward}
                      >
                        <TbRewindBackward10 size={20} />
                      </button>
                      {play ? (
                        <button
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[12vw] text-white"
                          onClick={togglePlayPause}
                        >
                          <FaCirclePause size={50} />
                        </button>
                      ) : (
                        <button
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[12vw] text-white"
                          onClick={togglePlayPause}
                        >
                          <FaCirclePlay size={50} />
                        </button>
                      )}
                      <button
                        className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[4vw] text-white"
                        onClick={seekForward}
                      >
                        <TbRewindForward10 />
                      </button>
                      <button
                        className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-white"
                        style={{ fontSize: "10vw" }}
                        onClick={seekForward}
                      >
                        <IoPlaySkipForward />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="md:mt-8 mt-0">
                  <div>
                    <p className="text-center mb-2 sm:text-xl text-sm">
                      {audioDetail?.name}
                    </p>
                    <div className="relative">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step="any"
                        value={played}
                        onMouseDown={handleSeekMouseDown}
                        onChange={handleSeekChange}
                        onMouseUp={handleSeekMouseUp}
                        className="rounded-xl w-full mt-4 cursor-pointer range-slider absolute"
                      />
                      <div
                        className="bg-orange-400 rounded-full h-2 z-0 absolute mt-2.5"
                        style={{ width: `calc(${played * 100}% + 0.15%)` }}
                      />
                    </div>
                    <div className="flex flex-row justify-between text-sm mt-2 pt-7 text-white">
                      <p>
                        {new Date(played * duration * 1000)
                          .toISOString()
                          .substring(11, 19)}
                      </p>
                      <p>
                        {new Date(duration * 1000)
                          .toISOString()
                          .substring(11, 19)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 items-center">
                    <button
                      className="flex flex-col items-center gap-1 hover:bg-white/10 p-5 rounded-full duration-300"
                      onClick={() =>
                        getCounts?.liked == "1" ? handleDislike() : handleLike()
                      }
                    >
                      <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw] text-white">
                        {getCounts?.likes} gefällt das
                      </p>
                      {getCounts?.liked == "1" ? (
                        <IoMdHeart className="sm:text-[3vw] xl:text-[2vw] text-[5vw] text-red-500" />
                      ) : (
                        <IoMdHeartEmpty className="sm:text-[3vw] xl:text-[2vw] text-[5vw] text-white" />
                      )}
                      <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw] text-white">
                        Gefällt mir
                      </p>
                    </button>
                    <button
                      className="flex flex-col items-center gap-1 hover:bg-white/10 p-5 rounded-full duration-300 sm:text-[3vw] xl:text-[1vw] text-[5vw]"
                      onClick={handleShowList}
                    >
                      <MdFormatListBulleted className="sm:text-[3vw] xl:text-[2vw] text-[5vw]" />
                      <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw]">
                        List
                      </p>
                    </button>
                    <button
                      className="flex flex-col items-center gap-1 hover:bg-white/10 p-5 rounded-full duration-300 sm:text-[3vw] xl:text-[1vw] text-[5vw]"
                      onClick={handleShare}
                    >
                      <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw] text-white">
                        {getCounts?.shares} geteilt
                      </p>
                      <PiShareFatLight className="sm:text-[3vw] xl:text-[2vw] text-[5vw] text-white" />
                      <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw] text-white">
                        Teilen
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        { children }
      )}
    </>
  );
};

export default FliegenglasAudioPlayer;
