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
  const playerRef = useRef<ReactPlayer>(null);
  const { isVisible, audioDetail, closePlayer, mini, miniPlayer } =
    useAudioPlayer();
  const { user }: any = useUser();

  const fetchCountData = async () => {
    try {
      let res: any = await API.get(
        `getCounts?&post_id=${audioDetail?.audioID}&user_id=${
          user?.id
        }&time=${new Date().toString()}`
      );
      // let data = await res.json();
      setGetCounts(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
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
        `likeAudioBook?&id=${audioDetail?.audioID}&user_id=${
          user?.id
        }&value=like&time=${new Date().toString()}`,
        {
          id: audioDetail?.audioID,
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
        `dislikeAudioBook?&id=${audioDetail?.audioID}&user_id=${
          user?.id
        }&value=dislike&time=${new Date().toString()}`,
        {
          id: audioDetail?.audioID,
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
          `share?&id=${audioDetail?.audioID}&user_id=${
            user?.id
          }&value=like&time=${new Date().toString()}`,
          {
            id: audioDetail?.audioID,
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

  return (
    <>
      {isVisible ? (
        <>
          <ReactPlayer
            ref={playerRef}
            url={`${audioDetail?.audioUrl?.replace("mp3", "m3u8")}`}
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
                    audioDetail?.backgroundImageUrl.includes("assets")
                      ? `/${audioDetail?.backgroundImageUrl}`
                      : audioDetail?.backgroundImageUrl
                  }
                  alt="Background Image"
                  layout="fill"
                  objectFit="cover"
                  className=""
                />
              </div>
              <div className="flex sm:flex-row flex-col justify-between items-center ml-5 h-full">
                <div className="h-full flex sm:justify-center justify-between items-center sm:w-auto w-full">
                  <img
                    src={
                      audioDetail?.imageUrl.includes("assets")
                        ? `/${audioDetail?.imageUrl}`
                        : audioDetail?.imageUrl
                    }
                    className="h-14 rounded-lg"
                  />
                  <div className="space-x-2 sm:hidden inline h-full">
                    <button
                      className="cursor-pointer p-4 hover:bg-blue-500/40 rounded-full duration-300"
                      onClick={miniPlayer}
                    >
                      <FaAngleUp />
                    </button>
                    <button
                      className="cursor-pointer p-4 bg-red-500 hover:bg-red-600 rounded-bl-2xl duration-300"
                      onClick={closePlayer}
                    >
                      <IoMdClose size={22} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center sm:justify-center justify-between w-full">
                  <button
                    className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-2xl"
                    onClick={seekBackward}
                  >
                    <IoPlaySkipBack size={20} />
                  </button>
                  <button
                    className="cursor-pointer p-4 hover:bg-white/10 rounded-full"
                    onClick={seekBackward}
                  >
                    <TbRewindBackward10 size={20} />
                  </button>
                  {play ? (
                    <button
                      className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[12vw]"
                      onClick={togglePlayPause}
                    >
                      <FaCirclePause size={50} />
                    </button>
                  ) : (
                    <button
                      className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[12vw]"
                      onClick={togglePlayPause}
                    >
                      <FaCirclePlay size={50} />
                    </button>
                  )}
                  <button
                    className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[4vw]"
                    onClick={seekForward}
                  >
                    <TbRewindForward10 />
                  </button>
                  <button
                    className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300"
                    style={{ fontSize: "10vw" }}
                    onClick={seekForward}
                  >
                    <IoPlaySkipForward />
                  </button>
                </div>
                <div className="sm:flex hidden gap-2 h-full items-center">
                  <button
                    className="cursor-pointer p-4 hover:bg-blue-500/40 rounded-full duration-300"
                    onClick={miniPlayer}
                  >
                    <FaAngleUp />
                  </button>
                  <button
                    className="cursor-pointer font-bold p-4 px-6 bg-red-500 hover:bg-red-600 h-full duration-300"
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
                        audioDetail?.backgroundImageUrl.includes("assets")
                          ? `/${audioDetail?.backgroundImageUrl}`
                          : audioDetail?.backgroundImageUrl
                      }
                      alt="Background Image"
                      layout="fill"
                      objectFit="cover"
                      className=""
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-between items-center mb-10 w-full">
                  <button
                    className="p-5 rounded-full hover:bg-white/10 duration-300 sm:text-[3vw] xl:text-[1.5vw] text-[5vw]"
                    onClick={() => minimizePlayer()}
                  >
                    <FaAngleDown />
                  </button>
                  <div className="flex justify-center relative">
                    <button
                      className="p-5 rounded-full hover:bg-white/10 duration-300"
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
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl"
                          onClick={() => handlePlaybackRateChange(0.25)}
                        >
                          0.25
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl"
                          onClick={() => handlePlaybackRateChange(0.5)}
                        >
                          0.50
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl"
                          onClick={() => handlePlaybackRateChange(1)}
                        >
                          1
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl"
                          onClick={() => handlePlaybackRateChange(1.25)}
                        >
                          1.25
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl"
                          onClick={() => handlePlaybackRateChange(1.5)}
                        >
                          1.50
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl"
                          onClick={() => handlePlaybackRateChange(1.75)}
                        >
                          1.75
                        </li>
                        <li
                          className="p-2 px-6 hover:bg-black cursor-pointer duration-300 rounded-xl"
                          onClick={() => handlePlaybackRateChange(2)}
                        >
                          2
                        </li>
                      </ul>
                    </div>
                  </div>
                  <button className="p-5 rounded-full hover:bg-white/10 duration-300 sm:text-[3vw] xl:text-[1.5vw] text-[5vw]">
                    <HiDotsHorizontal />
                  </button>
                </div>
                <div className="flex md:flex-row flex-col h-full">
                  <div className="w-full h-96 relative">
                    {buffering && (
                      <div className="absolute bg-black/50 h-full flex items-center justify-center">
                        <FlieLoaderCustom />
                      </div>
                    )}
                    <Image
                      src={
                        audioDetail?.imageUrl.includes("assets")
                          ? `/${audioDetail?.imageUrl}`
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
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full"
                          onClick={seekBackward}
                        >
                          <TbRewindBackward10 size={40} />
                        </button>

                        <button
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300"
                          onClick={seekForward}
                        >
                          <TbRewindForward10 size={40} />
                        </button>
                      </div>
                      <div className="text-center">
                        {play ? (
                          <button
                            className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300"
                            onClick={togglePlayPause}
                          >
                            <FaCirclePause size={200} />
                          </button>
                        ) : (
                          <button
                            className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300"
                            onClick={togglePlayPause}
                          >
                            <FaCirclePlay size={200} />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-row justify-between">
                        <button
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300"
                          onClick={seekBackward}
                        >
                          <IoPlaySkipBack size={40} />
                        </button>
                        <button
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300"
                          onClick={seekForward}
                        >
                          <IoPlaySkipForward size={40} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center md:hidden block">
                    <div className="mt-10 flex flex-row justify-between mx-5">
                      <button
                        className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-2xl"
                        onClick={seekBackward}
                      >
                        <IoPlaySkipBack size={20} />
                      </button>
                      <button
                        className="cursor-pointer p-4 hover:bg-white/10 rounded-full"
                        onClick={seekBackward}
                      >
                        <TbRewindBackward10 size={20} />
                      </button>
                      {play ? (
                        <button
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[12vw]"
                          onClick={togglePlayPause}
                        >
                          <FaCirclePause size={50} />
                        </button>
                      ) : (
                        <button
                          className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[12vw]"
                          onClick={togglePlayPause}
                        >
                          <FaCirclePlay size={50} />
                        </button>
                      )}
                      <button
                        className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[4vw]"
                        onClick={seekForward}
                      >
                        <TbRewindForward10 />
                      </button>
                      <button
                        className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300"
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
                    <div className="flex flex-row justify-between text-sm mt-2 pt-7">
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
                  {/* )} */}
                  <div className="flex justify-between mt-2">
                    <button
                      className="flex flex-col items-center gap-1 hover:bg-white/10 p-5 rounded-full duration-300"
                      onClick={() =>
                        getCounts?.liked == "1" ? handleDislike() : handleLike()
                      }
                    >
                      <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw]">
                        {getCounts?.likes} gefällt das
                      </p>
                      {getCounts?.liked == "1" ? (
                        <IoMdHeart className="sm:text-[3vw] xl:text-[2vw] text-[5vw]" />
                      ) : (
                        <IoMdHeartEmpty className="sm:text-[3vw] xl:text-[2vw] text-[5vw]" />
                      )}
                      <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw]">
                        Gefällt mir
                      </p>
                    </button>
                    {/* <button
                      className="flex flex-col items-center gap-1 hover:bg-white/10 p-5 rounded-full duration-300 sm:text-[3vw] xl:text-[1vw] text-[5vw]"
                      onClick={() => closePlayer()}
                    >
                      <MdFormatListBulleted className="sm:text-[3vw] xl:text-[2vw] text-[5vw]" />
                      <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw]">
                        List
                      </p>
                    </button> */}
                    <button
                      className="flex flex-col items-center gap-1 hover:bg-white/10 p-5 rounded-full duration-300 sm:text-[3vw] xl:text-[1vw] text-[5vw]"
                      onClick={handleShare}
                    >
                      <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw]">
                        {getCounts?.shares} geteilt
                      </p>
                      <PiShareFatLight className="sm:text-[3vw] xl:text-[2vw] text-[5vw]" />
                      <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw]">
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
