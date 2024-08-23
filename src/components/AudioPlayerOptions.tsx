"use client";

import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import React, { useEffect, useState } from "react";
import AudioDetailCard from "./AudioDetailCard";
import ProductDes from "./ProductDes";
import FlieLoaderCustom from "./core/FlieLoaderCustom";
import AutoSleepMode from "./AutoSleepMode";
import { saveAudios, getAudioByID } from "utils/indexeddb";

export default function AudioPlayerOptions({ audioDetail }: any) {
  const { user }: any = useUser();
  const [downloading, setDownloading] = useState<boolean>(false);
  const [alreadyDownloaded, setAlreadyDownloaded] = useState<boolean>(false);
  const [downloadPercentage, setDownloadPercentage] = useState<number>(0);

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

  const handleDownloadAll = async () => {
    if (!audioDetail?.list || audioDetail.list.length === 0) {
      console.log("No audio files to download");
      return;
    }

    try {
      setDownloading(true);
      const totalAudios = audioDetail.list.length;
      let downloadedCount = 0;
      setDownloadPercentage(0);

      const downloadPromises = audioDetail.list.map(async (audio: any) => {
        const { m3u8, id, name } = audio;
        const imageUrl = audioDetail?.imageUrl;
        const shareurl = audioDetail?.shareurl;
        const primaryCategory = audioDetail?.primaryCategory;

        try {
          const response = await fetch(m3u8);
          if (!response.ok) {
            throw new Error(`Failed to download audio from ${m3u8}`);
          }
          const arrayBuffer = await response.arrayBuffer();
          downloadedCount++;
          const downloadPercentage = Number(
            ((downloadedCount / totalAudios) * 100).toFixed(2)
          );
          setDownloadPercentage(downloadPercentage);

          return {
            id,
            data: arrayBuffer,
            local_image: imageUrl,
            name,
            shareurl,
            primaryCategory,
          };
        } catch (error) {
          console.error(`Failed to process audio ${m3u8}:`, error);
          return null;
        }
      });

      const results = await Promise.all(downloadPromises);

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
              Lade das Hörbuch lokal und höre es unter «Meine Hörbücher» ohne
              Internetverbindung.
            </p>
            <button
              className={`w-full bg-${
                downloading || alreadyDownloaded
                  ? "[#182f4a]"
                  : "[#6c7279] hover:bg-[#555a61]"
              } text-white p-3 rounded-md text-sm text-center duration-300`}
              onClick={handleDownloadAll}
              disabled={downloading || alreadyDownloaded ? true : false}
            >
              {alreadyDownloaded
                ? "Bereits Heruntergeladen"
                : downloading
                ? `Hörbuch zu ${downloadPercentage}% geladen...`
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
            imageSrc={"/" + data?.local_image}
            title={"Sprecher*ln"}
            name={data.artist}
          />
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
  );
}
