"use client";

import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import React, { useEffect, useState } from "react";
import AudioDetailCard from "./AudioDetailCard";
import ProductDes from "./ProductDes";
import FlieLoaderCustom from "./core/FlieLoaderCustom";
import AutoSleepMode from "./AutoSleepMode";
import { getAudioByID } from "utils/audioPlayerIndexedDB";
import { useAudioPlayer } from "context/AudioPlayerContext";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

export default function AudioPlayerOptions({
  audioDetail,
  handleClosePopup,
}: any) {
  const { user }: any = useUser();
  const {
    handleDownloadAll,
    downloadPercentage,
    alreadyDownloaded,
    downloading,
    setAlreadyDownloaded,
    downloadCategoryId,
  } = useAudioPlayer();

  useEffect(() => {
    let checkDownload = async () => {
      let alreadyDownloaded = await getAudioByID(audioDetail.categoryID);
      if (alreadyDownloaded) {
        setAlreadyDownloaded(true);
      } else {
        setAlreadyDownloaded(false);
      }
    };
    checkDownload();
  }, []);

  const fetchData = async () => {
    try {
      const response = API.get(
        // `getProductByID?product_id=${productId}&customerID=${user?.id}`
        `getProductByID?product_id=${audioDetail.categoryID}&customerID=50451`
      );
      return response || {};
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const { isLoading, data = {} } = useQuery<any>({
    queryKey: ["album-detail", audioDetail.categoryID, user?.id],
    queryFn: fetchData,
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 h-screen w-full flex justify-center items-center">
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

      <div className="p-5 h-full w-[90vw]">
        <div className="flex flex-row justify-between items-center h-1/12 pt-8 mb-5 px-10 w-full">
          <Image
            src={
              audioDetail?.imageUrl.includes("assets")
                ? "/" + audioDetail?.imageUrl
                : audioDetail?.imageUrl || "/image-placeholder.png"
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
        <div className="w-full h-full z-50 pb-52">
          {isLoading ? (
            <div className="w-full h-full">
              <div className="w-40 h-40 m-auto mt-10">
                <FlieLoaderCustom />
              </div>
            </div>
          ) : (
            <div className="w-full p-10 pt-0 relative z-10 h-full overflow-y-scroll">
              <div className="w-full bg-white/80 rounded-md p-3 mt-3 flex flex-col gap-2">
                <h1 className="text-center w-full text-black">
                  Hörbuch offline hören
                </h1>
                <p className="text-center text-black text-[16px] font-extrathin">
                  Lade das Hörbuch lokal und höre es unter «Meine Hörbücher»
                  ohne Internetverbindung.
                </p>
                <button
                  className={`text-white p-3 rounded-md text-sm text-center duration-300 ${
                    downloading
                      ? downloadCategoryId === data?.id
                        ? "bg-[#182f4a]"
                        : "bg-[#182f4a]"
                      : alreadyDownloaded
                      ? "bg-[#182f4a]"
                      : "bg-[#6c7279] hover:bg-[#555a61]"
                  }`}
                  onClick={handleDownloadAll}
                  disabled={downloading || alreadyDownloaded ? true : false}
                >
                  {downloading
                    ? downloadCategoryId === data?.id
                      ? `Hörbuch zu ${downloadPercentage}% geladen...`
                      : alreadyDownloaded
                      ? "Bereits Heruntergeladen"
                      : "Bitte warten Sie, bis der andere Download abgeschlossen ist"
                    : alreadyDownloaded
                    ? "Bereits Heruntergeladen"
                    : "Hörbuch downloaden"}
                </button>
              </div>
              <AutoSleepMode />
              <AudioDetailCard
                linkHref={`/home/artist-details?authorId=${data?.author_id}&role=author`}
                imageSrc={"/" + data.authoravatar}
                title={"Autor*ln"}
                name={data.author}
              />
              <AudioDetailCard
                linkHref={`/home/artist-details?artistId=${data?.artist_id}&role=artist`}
                // imageSrc={data?.artistavatar}
                imageSrc={
                  data?.artistavatar.includes("assets")
                    ? "/" + data?.artistavatar
                    : data?.artistavatar || "/image-placeholder.png"
                }
                title={"Sprecher*ln"}
                name={data.artist}
              />
              <div className="w-full bg-white/80 rounded-md px-3 py-4 mt-3 flex flex-col gap-1">
                <div className="w-full flex items-center gap-1">
                  <b className="text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]">
                    Dauer:
                  </b>
                  <p className="text-[#232a2c] text-[16px]">
                    {data?.audiobookDuration}
                  </p>
                </div>
                <div className="w-full flex gap-1">
                  <b className="text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]">
                    Copyright:
                  </b>
                  <p className="text-[#232a2c] text-[16px]">
                    {data?.copyright}
                  </p>
                </div>
              </div>
              <div className="w-full bg-white/80 rounded-md p-3 py-4 mt-3 flex flex-col">
                <h2 className="text-center text-[#232a2c]">
                  {data?.type === "subscription"
                    ? "Über dieses Hörbuch-Abo"
                    : "Inhalt des Hörbuches"}
                </h2>
                <ProductDes data={data} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
