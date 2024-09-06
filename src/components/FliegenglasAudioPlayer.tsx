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
import AudioPlayerOptions from "./AudioPlayerOptions";
import useNetworkCheck from "@hooks/useNetworkCheck";

const playbackRates = [0.25, 0.5, 1, 1.25, 1.5, 1.75, 2];
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
  const { user }: any = useUser();
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  // const [open, setOpen] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [getCounts, setGetCounts] = useState<GetCounts>();
  const [buffering, setBuffering] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const sleepTimerRef: any = useRef(null);
  const autoSleepTime: any =
    typeof window !== "undefined" && sessionStorage.getItem("autosleeptime");

  const { isOnline } = useNetworkCheck();

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
    play,
    setPlay,
    open,
    setOpen,
  } = useAudioPlayer();

  useEffect(() => {
    return () => {
      clearTimeout(sleepTimerRef.current);
    };
  }, [isPlaying, autoSleepTime]);

  const fetchCountData = async () => {
    try {
      let res: any = await API.get(
        `getCounts?&post_id=${audioDetail?.categoryID}&user_id=${user?.id
        }&time=${new Date().toString()}`
      );
      setGetCounts(res);
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // setPlay(true);
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
    if (mini) {
      setShowPopup(false);
    }
  }, [isVisible, mini]);

  useEffect(() => {
    if (isPlaying && autoSleepTime !== -1) {
      handleAutoSleepMode();
    }
    return () => {
      clearTimeout(sleepTimerRef.current);
    };
  }, [isPlaying, autoSleepTime]);

  useEffect(() => {
    if (audioDetail?.list[currentAudio]?.data) {
      const blobUrl = getAudioFromOfflineItem(
        audioDetail.list[currentAudio].data
      );
      setAudioUrl(blobUrl);

      return () => {
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
      };
    } else {
      setAudioUrl(audioDetail?.list[currentAudio]?.m3u8);
    }
  }, [audioDetail, currentAudio]);

  const handleAutoSleepMode = () => {
    clearTimeout(sleepTimerRef.current);
    if (isPlaying && autoSleepTime > 0) {
      console.log("Setting auto-sleep timer...");
      sleepTimerRef.current = setTimeout(() => {
        console.log("Auto-sleep time reached. Pausing the player...");
        setIsPlaying(false);
        setPlay(false);
        sessionStorage.removeItem("autosleeptime");
      }, parseInt(autoSleepTime, 10));
    } else if (autoSleepTime === -1) {
      console.log("Auto-sleep is disabled. Continuing playback...");
      sessionStorage.removeItem("autosleeptime");
    }
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
    if (currentAudio - 1 !== -1) {
      handleCurrentAudio(currentAudio - 1);
    } else {
      console.log("Previous audio not available");
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    setOpen(!open);
  };

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

  const updateLikeState = (isLiked: any) => {
    setGetCounts((prevCounts: any) => ({
      ...prevCounts,
      liked: isLiked ? "1" : "0",
      likes: isLiked
        ? parseInt(prevCounts.likes) + 1
        : parseInt(prevCounts.likes) - 1,
    }));
  };

  const handleLike = async () => {
    try {
      updateLikeState(true);

      await API.post(
        `likeAudioBook?&id=${audioDetail?.categoryID}&user_id=${user?.id
        }&value=like&time=${new Date().toString()}`,
        {
          id: audioDetail?.categoryID,
          userID: user.id,
          time: new Date().toString(),
        }
      );
      fetchCountData();
    } catch (err) {
      updateLikeState(false);
      console.error(err);
    }
  };

  const handleDislike = async () => {
    try {
      updateLikeState(false);
      await API.post(
        `dislikeAudioBook?&id=${audioDetail?.categoryID}&user_id=${user?.id
        }&value=dislike&time=${new Date().toString()}`,
        {
          id: audioDetail?.categoryID,
          userID: user.id,
          time: new Date().toString(),
        }
      );
      fetchCountData();
    } catch (err) {
      updateLikeState(true);
      console.error(err);
    }
  };



  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: audioDetail?.categoryName,
          text: `By ${audioDetail?.artist}`,
          url: audioDetail?.shareurl,
        });
        await API.post(
          `share?&id=${audioDetail?.categoryID}&user_id=${user?.id
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

  const handleMoreDetails = (audioDetail: any) => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleEnded = () => {
    if (audioDetail?.list.length > currentAudio + 1) {
      handleCurrentAudio(currentAudio + 1);
      if (autoSleepTime == -1) {
        setIsPlaying(false);
        setPlay(false);
        sessionStorage.removeItem("autosleeptime");
      } else {
        setIsPlaying(true);
        setPlay(true);
      }
    } else {
      setIsPlaying(false);
      setPlay(false);
    }
  };

  const seekBackward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playedSeconds - 10);
    }
  };

  const togglePlayPause = () => {
    setPlay(!play);
  };

  const seekForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playedSeconds + 10);
    }
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  const minimizePlayer = () => {
    miniPlayer();
  };

  const getAudioFromOfflineItem = (data: any) => {
    if (!data || data.byteLength === 0) return "";
    const audioBlob = new Blob([data], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  };

  if (!isVisible || !audioDetail) return null;
  return (
    <>
      {isVisible ? (
        <>
          <ReactPlayer
            ref={playerRef}
            url={audioUrl}
            playing={play}
            onBuffer={() => setBuffering(true)}
            onBufferEnd={() => setBuffering(false)}
            onProgress={handleProgress}
            onDuration={handleDuration}
            playbackRate={playbackRate}
            onEnded={handleEnded}
            controls={true}
            width="0"
            height="0"
            // onError={(error) => console.log("Error:", error)}
            onPlay={() => {
              if (play) {
                setIsPlaying(true);
                handleAutoSleepMode();
              }
            }}
            onPause={() => {
              if (!play) {
                setIsPlaying(false);
                clearTimeout(sleepTimerRef.current);
              }
            }}
          />
          {mini ? (
            <div className="sm:h-20 h-40 bottom-0 w-full fixed z-10">
              <div className="absolute inset-0 h-full z-[-1] bg-black">
                <Image
                  src={
                    audioDetail?.imageUrl.includes("assets")
                      ? "/" + audioDetail?.imageUrl
                      : audioDetail?.imageUrl || "/image-placeholder.png"
                  }
                  alt="Background Image"
                  fill={true}
                  className="blur-2xl opacity-65 object-fit"
                  loading="lazy"
                />
              </div>
              <div className="flex sm:flex-row flex-col justify-between items-center sm:ml-5 ml-0 h-full">
                <div className="flex sm:justify-center justify-between items-center sm:w-2/12 w-full sm:mr-4 mr-0">
                  <Image
                    src={
                      audioDetail?.imageUrl.includes("assets")
                        ? "/" + audioDetail?.imageUrl
                        : audioDetail?.imageUrl || "/image-placeholder.png"
                    }
                    alt="mini player image"
                    height={100}
                    width={100}
                    className="h-14 w-14 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-col w-full">
                    <p className="text-sm ml-2 text-white">
                      {audioDetail?.list[currentAudio]?.title}
                    </p>
                    <p className="text-xs ml-2 text-white/60">
                      {audioDetail?.list[currentAudio]?.artist}
                    </p>
                  </div>
                  <div className="space-x-2 sm:hidden inline h-full flex">
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
                <div className="sm:w-2/12 md:w-4/12 xl:w-6/12 w-10/12">
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
                      className="rounded-xl w-full cursor-pointer range-slider2 absolute"
                    />
                    <div
                      className="bg-orange-400 rounded-full h-1 z-0 absolute mt-2.5"
                      style={{ width: `calc(${played * 100}%)` }}
                    />
                  </div>
                  <div className="flex flex-row justify-between pt-5 text-white">
                    <p className="text-sm">
                      {new Date(played * duration * 1000)
                        .toISOString()
                        .substring(11, 19)}
                    </p>
                    <p className="text-sm">
                      {new Date(duration * 1000)
                        .toISOString()
                        .substring(11, 19)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center sm:justify-center justify-between sm:w-2/12 w-full sm:p-0 px-8">
                  <button
                    className={`rounded-full duration-300 text-2xl sm:p-4 p-2 ${currentAudio === 0
                        ? "text-white/50"
                        : "text-white hover:bg-white/10 cursor-pointer"
                      }`}
                    onClick={handlePreviousAudio}
                    disabled={currentAudio === 0 ? true : false}
                  >
                    <IoPlaySkipBack size={20} />
                  </button>
                  <button
                    className="cursor-pointer sm:p-4 p-2 hover:bg-white/10 rounded-full text-white"
                    onClick={seekBackward}
                  >
                    <TbRewindBackward10 size={20} />
                  </button>
                  {play ? (
                    <button
                      className="cursor-pointer sm:p-4 p-2 hover:bg-white/10 rounded-full duration-300 text-[12vw] text-white"
                      onClick={togglePlayPause}
                    >
                      <FaCirclePause size={50} />
                    </button>
                  ) : (
                    <button
                      className="cursor-pointer sm:p-4 p-2 hover:bg-white/10 rounded-full duration-300 text-[12vw] text-white"
                      onClick={togglePlayPause}
                    >
                      <FaCirclePlay size={50} />
                    </button>
                  )}
                  <button
                    className="cursor-pointer sm:p-4 p-2 hover:bg-white/10 rounded-full duration-300 text-[4vw] text-white"
                    onClick={seekForward}
                  >
                    <TbRewindForward10 />
                  </button>
                  <button
                    className={`sm:p-4 p-2 rounded-full duration-300 ${audioDetail?.list.length > currentAudio + 1
                        ? "text-white hover:bg-white/10 cursor-pointer"
                        : "text-white/50"
                      }`}
                    style={{ fontSize: "10vw" }}
                    onClick={handleNextAudio}
                    disabled={
                      audioDetail?.list.length > currentAudio + 1 ? false : true
                    }
                  >
                    <IoPlaySkipForward />
                  </button>
                </div>
                <div className="sm:flex hidden gap-2 items-center justify-center w-1/12">
                  <button
                    className="cursor-pointer p-3 hover:bg-blue-500/40 rounded-full duration-300 text-white"
                    onClick={miniPlayer}
                  >
                    <FaAngleUp />
                  </button>
                  <button
                    className="cursor-pointer font-bold p-2 bg-red-500 hover:bg-red-600 rounded-full duration-300 text-white"
                    onClick={closePlayer}
                  >
                    <IoMdClose size={22} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center h-screen w-screen z-50 fixed top-0 inset-0">
              <div className="w-10/12 xs:w-7/12 sm:w-6/12 md:w-11/12 lg:w-10/12 xl:w-6/12">
                <div>
                  <div className="absolute inset-0 h-full z-[-1] bg-black">
                    <Image
                      src={
                        audioDetail?.imageUrl.includes("assets")
                          ? "/" + audioDetail?.imageUrl
                          : audioDetail?.imageUrl || "/image-placeholder.png"
                      }
                      alt="Background Image"
                      fill={true}
                      className="blur-2xl opacity-65 object-fit"
                      loading="lazy"
                    />
                  </div>
                  {showList && (
                    <div className="absolute inset-0 bg-black z-20 h-full ">
                      <div className="absolute inset-0 h-full z-[-1] bg-black">
                        <Image
                          src={
                            audioDetail?.imageUrl.includes("assets")
                              ? "/" + audioDetail?.imageUrl
                              : audioDetail?.imageUrl ||
                              "/image-placeholder.png"
                          }
                          alt="Background Image"
                          fill={true}
                          className="blur-2xl opacity-65 object-fit"
                          loading="lazy"
                        />
                      </div>
                      <div className="max-h-screen md:w-9/12 w-11/12 h-full m-auto">
                        <div className="lg:mx-20 flex flex-col">
                          <div className="flex flex-row justify-between items-center h-1/12 pt-8 mx-10 mb-5">
                            <Image
                              src={
                                audioDetail?.imageUrl.includes("assets")
                                  ? "/" + audioDetail?.imageUrl
                                  : audioDetail?.imageUrl ||
                                  "/image-placeholder.png"
                              }
                              alt="Audio Thumbnail"
                              height={200}
                              width={200}
                              className="rounded-xl shadow-lg h-40 w-auto"
                              loading="lazy"
                            />
                            <button
                              className="flex flex-row items-center gap-2 text-white hover:bg-white/10 hover:shadow-xl p-2 rounded-lg duration-300"
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
                                      onClick={() => {
                                        handleCurrentAudio(index);
                                        handleShowList();
                                      }}
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

                  {showPopup && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 h-screen w-full flex justify-center items-center">
                      <div className="absolute inset-0 h-full z-[-1] bg-black">
                        <Image
                          src={
                            audioDetail?.imageUrl.includes("assets")
                              ? "/" + audioDetail?.imageUrl
                              : audioDetail?.imageUrl ||
                              "/image-placeholder.png"
                          }
                          alt="Background Image"
                          fill={true}
                          className="blur-2xl opacity-65 object-fit"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-5 h-full md:w-8/12 w-11/12">
                        <div className="flex flex-row justify-between items-center h-1/12 pt-8 mb-5 px-10 w-full">
                          <Image
                            src={
                              audioDetail?.imageUrl.includes("assets")
                                ? "/" + audioDetail?.imageUrl
                                : audioDetail?.imageUrl ||
                                "/image-placeholder.png"
                            }
                            alt="Audio Thumbnail"
                            height={200}
                            width={200}
                            className="rounded-xl shadow-lg h-40 w-auto"
                            loading="lazy"
                          />
                          <button
                            className="flex flex-row text-white items-center gap-2 hover:bg-white/10 hover:shadow-xl p-2 rounded-lg duration-300"
                            onClick={handleClosePopup}
                          >
                            <IoMdClose size={25} />
                            Schließen
                          </button>
                        </div>
                        <AudioPlayerOptions audioDetail={audioDetail} />
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

                  {audioDetail?.paid && (
                    <>
                      <div className="flex justify-center relative">
                        <button
                          className="p-5 rounded-full hover:bg-white/10 duration-300 text-white"
                          onClick={toggleOpen}
                        >
                          x {playbackRate}
                        </button>

                        <div
                          className={`bg-black/80 rounded-2xl py-4 absolute z-10 mt-20 transition-all duration-300 ${open ? "" : "hidden"
                            }`}
                        >
                          <ul className="text-center">
                            {playbackRates.map((rate) => (
                              <li
                                key={rate}
                                className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl text-white"
                                onClick={() => handlePlaybackRateChange(rate)}
                              >
                                {rate}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <button
                        className={`p-5 rounded-full hover:bg-white/10 duration-300 sm:text-[3vw] xl:text-[1.5vw] text-[5vw] text-white ${
                          isOnline ? "visible" : "invisible"
                        }`}
                        onClick={() => handleMoreDetails(audioDetail)}
                      >
                        <HiDotsHorizontal />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex md:flex-row flex-col h-full">
                  <div className="w-full h-96 relative">
                    {buffering && (
                      <div className="absolute bg-black/50 h-full sm:p-20 p-10 flex items-center justify-center text-white rounded-2xl">
                        <FlieLoaderCustom />
                      </div>
                    )}
                    <Image
                      src={
                        audioDetail?.imageUrl.includes("assets")
                          ? "/" + audioDetail?.imageUrl
                          : audioDetail?.imageUrl || "/image-placeholder.png"
                      }
                      alt="Audio Thumbnail"
                      height={500}
                      width={500}
                      className="w-full h-full w-full object-cover rounded-2xl"
                      loading="lazy"
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
                          className={`p-4 rounded-full duration-300 ${currentAudio === 0
                              ? "text-white/50"
                              : "text-white hover:bg-white/10 cursor-pointer"
                            }`}
                          disabled={currentAudio === 0 ? true : false}
                          onClick={handlePreviousAudio}
                        >
                          <IoPlaySkipBack size={40} />
                        </button>
                        <button
                          className={`p-4 rounded-full duration-300 ${audioDetail?.list.length > currentAudio + 1
                              ? "text-white hover:bg-white/10 cursor-pointer"
                              : "text-white/50"
                            }`}
                          disabled={
                            audioDetail?.list.length > currentAudio + 1
                              ? false
                              : true
                          }
                          onClick={handleNextAudio}
                        >
                          <IoPlaySkipForward size={40} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center md:hidden block">
                    <div className="mt-4 flex flex-row justify-between mx-5">
                      <button
                        className={`p-4 rounded-full duration-300 ${currentAudio === 0
                            ? "text-white/50"
                            : "text-white hover:bg-white/10 cursor-pointer"
                          }`}
                        disabled={currentAudio === 0 ? true : false}
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
                        className={`p-4 rounded-full duration-300 text-[4vw] ${audioDetail?.list.length > currentAudio + 1
                            ? "text-white hover:bg-white/10 cursor-pointer"
                            : "text-white/50"
                          }`}
                        disabled={
                          audioDetail?.list.length > currentAudio + 1
                            ? false
                            : true
                        }
                        onClick={seekForward}
                      >
                        <TbRewindForward10 />
                      </button>
                      <button
                        className={`p-4 rounded-full duration-300 ${audioDetail?.list.length > currentAudio + 1
                            ? "text-white hover:bg-white/10 cursor-pointer"
                            : "text-white/50"
                          }`}
                        disabled={
                          audioDetail?.list.length > currentAudio + 1
                            ? false
                            : true
                        }
                        style={{ fontSize: "10vw" }}
                        onClick={seekForward}
                      >
                        <IoPlaySkipForward />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="md:mt-8 mt-2">
                  <div>
                    <p className="text-center sm:text-xl text-sm text-white">
                      {audioDetail?.list[currentAudio]?.title}
                    </p>
                    <p className="text-center sm:text-[15px] text-xs text-white/50 mb-1">
                      {audioDetail?.list[currentAudio]?.artist}
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
                        style={{ width: `calc(${played * 100}%)` }}
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
                      className="flex flex-col items-center gap-1 hover:bg-white/10 xs:p-5 p-2 rounded-full duration-300"
                      onClick={() => (getCounts?.liked == "1" ? handleDislike() : handleLike())}
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
                    {audioDetail?.list.length > 1 && (
                      <button
                        className="flex flex-col items-center gap-1 hover:bg-white/10 xs:p-5 p-2 rounded-full duration-300 sm:text-[3vw] xl:text-[1vw] text-[5vw]"
                        onClick={handleShowList}
                      >
                        <MdFormatListBulleted className="sm:text-[3vw] xl:text-[2vw] text-[5vw] text-white" />
                        <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw] text-white">
                          Kapitel
                        </p>
                      </button>
                    )}
                    <button
                      className="flex flex-col items-center gap-1 hover:bg-white/10 xs:p-5 p-2 rounded-full duration-300 sm:text-[3vw] xl:text-[1vw] text-[5vw]"
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
        children
      )}
    </>
  );
};

export default FliegenglasAudioPlayer;
