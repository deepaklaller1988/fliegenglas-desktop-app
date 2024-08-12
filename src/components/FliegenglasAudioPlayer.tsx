"use client";

import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import Image from "next/image";
import { FaCirclePlay, FaCirclePause, FaAngleDown } from "react-icons/fa6";
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { TbRewindBackward10, TbRewindForward10 } from "react-icons/tb";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoMdHeartEmpty } from "react-icons/io";
import { MdFormatListBulleted } from "react-icons/md";
import { PiShareFatLight } from "react-icons/pi";
import FlieLoader from "./FlieLoader";

interface FliegenglasAudioPlayerProps {
  audioDetail: any;
  audioType: string;
  handleShowPlayer(): any;
}

const FliegenglasAudioPlayer: React.FC<FliegenglasAudioPlayerProps> = ({
  audioDetail,
  audioType,
  handleShowPlayer,
}) => {
  const [play, setPlay] = useState(true);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [open, setOpen] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const [buffering, setBuffering] = useState<boolean>(false);

  useEffect(() => {
    if (play && playerRef.current) {
      playerRef.current.seekTo(played);
    }
  }, [play]);

  console.log(buffering);

  // useEffect(() => {
  //   if (audioType === "online") {
  //     // handlePlayOnline();
  //   } else {
  //     handlePlayDownloaded();
  //   }
  // }, []);

  const togglePlayPause = () => {
    setPlay(!play);
  };

  const handleProgress = (progress: {
    played: number;
    playedSeconds: number;
  }) => {
    setPlayed(progress.played);
    setPlayedSeconds(progress.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (value: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value, "fraction");
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

  // const handlePlayOnline = async () => {
  //   console.log(audioDetail, audioType, "=======");
  //   const response = await fetch(
  //     `/api/stream-audio?id=${audioDetail?.preview_url}`
  //   );
  //   if (response.ok) {
  //     const audioUrl = URL.createObjectURL(await response.blob());
  //     setAudio(audioUrl);
  //   } else {
  //     console.error("Failed to stream audio");
  //   }
  // };

  // const handlePlayDownloaded = () => {
  //   const audioBlob = new Blob([audioDetail.audio?.data], {
  //     type: "audio/mpeg",
  //   });
  //   const audioUrl = URL.createObjectURL(audioBlob);
  //   setAudio(audioUrl);
  // };

  const handleBuffer = () => {
    setBuffering(true);
  };

  const handleReady = () => {
    setBuffering(false);
  };

  return (
    <div className="w-full flex items-center justify-center h-screen w-screen">
      <div className="w-7/12 sm:w-6/12 md:w-11/12 lg:w-10/12 xl:w-6/12">
        <div>
          <div className="absolute inset-0 h-full z-[-10]">
            <Image
              src="/assets/images/search/search-icon-7387.png"
              alt="Background Image"
              layout="fill"
              objectFit="cover"
              className="blur-md opacity-30"
            />
          </div>

          <div className="w-full">
            <ReactPlayer
              ref={playerRef}
              // url={audioDetail?.preview_url}
              url={
                "https://upload.wikimedia.org/wikipedia/commons/4/49/Wikipedia.ogg"
              }
              playing={play}
              onBuffer={handleBuffer}
              onReady={handleReady}
              onProgress={handleProgress}
              onDuration={handleDuration}
              playbackRate={playbackRate}
              width="0"
              height="0"
            />
          </div>
        </div>

        <div className="flex flex-row justify-between items-center mb-10 w-full">
          <button
            className="p-5 rounded-full hover:bg-white/10 duration-300 sm:text-[3vw] xl:text-[1.5vw] text-[5vw]"
            onClick={handleShowPlayer}
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
          <div className="w-full">
            <Image
              src="/assets/images/search/search-icon-7387.png"
              alt="Audio Thumbnail"
              height={500}
              width={500}
              className="w-full h-full w-full object-cover"
            />
          </div>
          <div className="w-full flex items-center justify-center md:block hidden">
            {buffering ? (
              <div className="w-full h-40 p-20 flex items-center justify-center mt-10 h-full">
                <FlieLoader />
              </div>
            ) : (
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
            )}
          </div>
          <div className="w-full flex items-center justify-center md:hidden block">
            {buffering ? (
              <div className="w-full h-40 w-40 flex items-center justify-center h-full">
                <FlieLoader />
              </div>
            ) : (
              <div className="mt-10 flex flex-row justify-between mx-5">
                <button
                  className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[4vw]"
                  onClick={seekBackward}
                >
                  <IoPlaySkipBack />
                </button>
                <button
                  className="cursor-pointer p-4 hover:bg-white/10 rounded-full text-[4vw]"
                  onClick={seekBackward}
                >
                  <TbRewindBackward10 />
                </button>
                {play ? (
                  <button
                    className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[12vw]"
                    onClick={togglePlayPause}
                  >
                    <FaCirclePause />
                  </button>
                ) : (
                  <button
                    className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[12vw]"
                    onClick={togglePlayPause}
                  >
                    <FaCirclePlay />
                  </button>
                )}
                <button
                  className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[4vw]"
                  onClick={seekForward}
                >
                  <TbRewindForward10 />
                </button>
                <button
                  className="cursor-pointer p-4 hover:bg-white/10 rounded-full duration-300 text-[4vw]"
                  onClick={seekForward}
                >
                  <IoPlaySkipForward />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="md:mt-8 mt-0">
          <div className="progress-container">
            <progress
              value={played}
              max={1}
              className="play-progress"
              onClick={(e) =>
                handleSeek(e.nativeEvent.offsetX / e.currentTarget.clientWidth)
              }
            />
          </div>
          <input
            type="range"
            value={played}
            // min={0}
            max={1}
            className="rounded-xl w-full mt-4"
            onClick={(e) =>
              handleSeek(e.nativeEvent.offsetX / e.currentTarget.clientWidth)
            }
          />
          <div className="flex flex-row justify-between text-sm mt-2">
            <p>
              {new Date(played * duration * 1000)
                .toISOString()
                .substring(11, 19)}
            </p>
            <p>{new Date(duration * 1000).toISOString().substring(11, 19)}</p>
          </div>
          <div className="flex justify-between mt-2">
            <button className="flex flex-col items-center gap-1 hover:bg-white/10 p-5 rounded-full duration-300">
              <IoMdHeartEmpty className="sm:text-[3vw] xl:text-[2vw] text-[5vw]" />
              <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw]">Like</p>
            </button>
            <button
              className="flex flex-col items-center gap-1 hover:bg-white/10 p-5 rounded-full duration-300 sm:text-[3vw] xl:text-[1vw] text-[5vw]"
              onClick={handleShowPlayer}
            >
              <MdFormatListBulleted className="sm:text-[3vw] xl:text-[2vw] text-[5vw]" />
              <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw]">List</p>
            </button>
            <button className="flex flex-col items-center gap-1 hover:bg-white/10 p-5 rounded-full duration-300 sm:text-[3vw] xl:text-[1vw] text-[5vw]">
              <PiShareFatLight className="sm:text-[3vw] xl:text-[2vw] text-[5vw]" />
              <p className="sm:text-[1.5vw] xl:text-[1vw] text-[3vw]">Share</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FliegenglasAudioPlayer;
