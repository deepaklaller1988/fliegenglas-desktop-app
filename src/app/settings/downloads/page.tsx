"use client";

import FlieLoader from "@components/core/FlieLoader";
import HeaderLink from "@components/HiArrowleft";
import { useAudioPlayer } from "context/AudioPlayerContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAll, deleteAudioByID } from "utils/audioPlayerIndexedDB";

export default function Downloads() {
  const router = useRouter();
  const { showPlayer, handleCurrentAudio, isVisible } = useAudioPlayer();

  const [offlineAudios, setOfflineAudios] = useState<any>();
  const [offlineAudiosSize, setOfflineAudiosSize] = useState<number[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);

  useEffect(() => {
    getOfflineAudios();
  }, []);

  const getOfflineAudios = async () => {
    let total = 0;
    let data: any = await getAll();
    setOfflineAudios(data);
    const sizesInMB = data.map((item: any) => {
      const totalBytes = item.audios.reduce((total: any, audioItem: any) => {
        return total + audioItem.data.byteLength;
      }, 0);
      total = total + Number((totalBytes / (1024 * 1024)).toFixed(1));
      return (totalBytes / (1024 * 1024)).toFixed(1);
    });

    setTotalSize(Number(total.toFixed(1)));
    setOfflineAudiosSize(sizesInMB);
  };

  const openPlayerOrDetails = async (product: any) => {
    const data: any = {
      categoryID: Number(product?.categoryID),
      categoryName: product?.categoryName,
      imageUrl: product?.imageUrl,
      shareurl: product?.shareurl,
      list: product?.audios,
      primaryCategory: product?.primaryCategory,
      paid: true,
    };
    if (!isVisible) {
      handleCurrentAudio(0);
    }
    showPlayer(data);
  };

  const handleDeleteOfflineAudio = async (e: any, item: any) => {
    e.stopPropagation();
    let deleteCheck = await deleteAudioByID(item?.categoryID);
    if (deleteCheck) {
      getOfflineAudios();
    }
  };

  return (
    <>
      <div id="login-page" className="px-4 w-full">
        <div className="loginInner">
          <HeaderLink
            onClick={() => router.push("/home")}
            className={"py-4 pr-4 text-white"}
          />
          <div className="w-full">
            <div className="form-view">
              <div className="w-full">
                <h2 className="text-bold text-lg text-white block text-center mb-4">
                  Meine Downloads
                </h2>
                {offlineAudios === undefined ? (
                  <FlieLoader />
                ) : offlineAudios.length > 0 ? (
                  <div>
                    <p className="text-white">
                      Derzeit belegen Deine Fliegenglas Downloads {totalSize} MB
                      an Speicherplatz. Folgende Hörbücher hast Du in Deiner
                      Mediathek gespeichert:
                    </p>
                    <ul>
                      {offlineAudios.map((item: any, index: number) => (
                        <li key={index} className="spaceBorder">
                          <section
                            className="w-full flex gap-4 text-white cursor-pointer rounded-md hover:bg-white/10 duration-300 py-6 px-2"
                            onClick={() => openPlayerOrDetails(item)}
                          >
                            <span className="h-32 w-32 overflow-hidden">
                              <Image
                                src={item?.imageUrl}
                                alt={"Image"}
                                width={200}
                                height={200}
                                className="object-cover rounded-lg w-full h-full"
                              />
                            </span>
                            <div className="flex flex-col gap-1 w-full h-full justify-between">
                              <p className="text-[#b5b7bb] text-sm">
                                {item?.primaryCategory}
                              </p>
                              <p>{item?.categoryName}</p>
                              <div className="w-full flex justify-between items-end mt-6">
                                <p className="text-sm">
                                  {offlineAudiosSize[index]} MB
                                </p>
                                <button
                                  className="bg-white/80 py-2 px-3 text-black rounded-lg right-0 mr-40"
                                  onClick={(e) =>
                                    handleDeleteOfflineAudio(e, item)
                                  }
                                >
                                  Aus Mediathek entfernen
                                </button>
                              </div>
                            </div>
                          </section>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <>
                    <p className="text-white mt-2">
                      Derzeit hast Du keine Hörbücher lokal in der Fliegenglas
                      App gespeichert.
                    </p>
                    <p className="text-white mt-6">
                      Um Hörbücher lokal herunterzuladen, besuche bitte den
                      Audioplayer und klicke auf das Menü oben rechts über dem
                      Hörbuch Cover.
                    </p>
                    <img
                      src="/assets/images/download-explanation.jpg"
                      alt="downloads"
                      className="w-[250px] block max-w-full m-auto my-6"
                    />
                    <p className="text-white">
                      Wir empfehlen Downloads für den Fall, dass Du ohne
                      Internetverbindung Hörbücher hören möchtest. Bitte beachte
                      dabei, dass Downloads Speicherplatz auf Deinem Gerät
                      benötigen.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
