"use client";
import API from "@lib/API";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import Link from "next/link";
import React, { useState } from "react";
import { getData, saveData } from "utils/indexDB";
import Image from "next/image";
import { HiArrowLeft } from "react-icons/hi";
import { toasterInfo, toasterSuccess } from "@components/core/Toaster";

export default function ChannelData() {
  const { user }: any = useUser();
  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);

  const getChannelData = async () => {
    if (!user) {
      return [];
    }
    try {
      const cachedData = await getData("channelData");
      if (cachedData) {
        return cachedData;
      }
      const response: any = await API.get(
        `getChannels?&user_id=${user.id}&time=${new Date().toString()}`
      );
      await saveData("channelData", response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const {
    isLoading: isChannelLoading,
    data: channelData = [],
  } = useQuery({
    queryKey: ["channel-data", user],
    queryFn: getChannelData,
  });

  const toggleSelection = (id: number) => {
    setSelectedChannels((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const mutation: any = useMutation({
    mutationFn: async () => {
      const response = await API.post(`addOnFavPage?&channel_id=${selectedChannels}&user_id=${user.id}&time=${new Date().toString()}`, {
        channel_id: selectedChannels,
        user_id: user.id,
        time: new Date().toString()
      });
      return response;
    },
    onSuccess: () => {
      toasterSuccess("Einstellungen gespeichert.", 1000, "id")
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });


  const handleFavCat = () => {
    if (selectedChannels.length == 0) {
      toasterInfo("Wähle mindestens eine Kategorie aus.", 3000, "id")
    }
    else {
      if (selectedChannels) {
        mutation.mutate(selectedChannels);
      }
    }
  }




  return (
    <>
      <div className="loginInner">
        <div className="header">
          <Link href="/album">
            <div className="py-4 pr-4 text-white">
              <HiArrowLeft className="text-lg ml-4" />
            </div>
            <p className="text-lg ml-4 text-white w-full text-center">
              Lieblingskategorien
            </p>
            <p className="text-lg ml-4 text-white mb-4">
              Das interessiert mich am meisten:
            </p>
          </Link>
        </div>
        <div className="w-full">
          <section className="flex flex-wrap pr-4">
            {isChannelLoading ? (
              [...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="card flex md:w-2/4 sm:w-2/4 my-2 pl-4 relative"
                >
                  <div className="relative w-full h-[300px] bg-gray-300 animate-pulse rounded-md"></div>
                </div>
              ))
            ) : channelData.length > 0 ? (
              channelData.map((item: any, index: number) => (
                <div
                  key={index}
                  className="card flex md:w-2/4 sm:w-2/4 my-2 pl-4 relative"
                >
                  <div
                    className={`relative w-full cursor-pointer ${selectedChannels.includes(item.id) ? "channel-selected" : ""
                      }`}
                    onClick={() => toggleSelection(item.id)}
                  >
                    <Image
                      src={item.banner_image}
                      alt="img"
                      width={265}
                      height={300}
                      className="w-full block rounded-md"
                    />

                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">Keine Daten verfügbar</p>
            )}

          </section>

          <div>
              <p className="text-lg text-white mb-4 mt-4 ml-4">
                Wähle die Kategorien oder Kanäle aus, die Du auf der Startseite angezeigt bekommen möchtest.
              </p>

              <div className="flex items-center justify-center w-full">
                <button onClick={handleFavCat}
                  className={`${mutation.isPending ? 'flie-loader py-4 font-bold' : ""} py-4 font-bold  bg-[#ff9900] px-20 hover:bg-[#ff6600] cursor-pinter  rounded-md text-white' `}
                  disabled={mutation.isPending}>
                  Zur Startseite
                </button>
              </div>
            </div>
        </div>

      </div>
    </>
  );
}
