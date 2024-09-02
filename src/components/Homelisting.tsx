"use client";
import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import FlieLoader from "./core/FlieLoader";
import Image from "next/image";
import { useUser } from "context/UserContext";
import { getData, saveData } from "utils/indexDB";
import HeaderLink from "./HiArrowleft";
import { useAudioPlayer } from "context/AudioPlayerContext";

export default function Homelisting({ list }: any) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const { user }: any = useUser();
  const router = useRouter();
  const { showPlayer, handleCurrentAudio, isVisible } = useAudioPlayer();

  const fetchRecentlPlayed = async () => {
    if (!user) {
      return [];
    }
    try {
      const cachedData = await getData("recently-played");
      if (cachedData) {
        return cachedData;
      }

      const response: any = await API.get(
        `recentlyPlayedList/?&user_id=${50451}&time=${new Date().toString()}`
        // `recentlyPlayedList/?&user_id=${user?.id}&time=${new Date().toString()}`
      );

      await saveData("recently-played", response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { isLoading: fetchRecently, data: recentlyData = [] } = useQuery({
    queryKey: ["recently-played", user],
    queryFn: fetchRecentlPlayed,
  });

  const fetchData = async () => {
    if (!id) {
      return [];
    }
    try {
      const response = await API.get(
        `getProductsByCatID/?&catId=${id}&time=${new Date().toString()}`
      );
      return response || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const { isLoading, data = [] } = useQuery<any>({
    queryKey: ["data", id],
    queryFn: fetchData,
  });

  if (isLoading || fetchRecently) {
    return <FlieLoader />;
  }

  const displayData =
    list == "recently-viewed" && recentlyData.length > 0 ? recentlyData : data;

  const openPlayerOrDetails = async (product: any) => {
    const orders: any[] = await getData("order-data");
    if (orders && orders?.length > 0) {
      const productId = Number(product?.id ?? product?.product_id);

      const index = orders.findIndex(
        ({ line_items }) =>
          line_items &&
          line_items[0]?.type !== "subscription" &&
          Number(line_items[0].id) === productId
      );

      if (index !== -1) {
        const lineItem = orders[index]?.line_items?.[0];

        if (lineItem) {
          const data: any = {
            categoryID: productId,
            categoryName: lineItem.name,
            imageUrl: lineItem.image,
            backgroundImageUrl: lineItem.player_background_image,
            artist: lineItem.artist,
            shareurl: lineItem.shareurl,
            list: lineItem.downloads,
            primaryCategory: lineItem.primaryCategory,
            paid: true,
          };

          if (!isVisible) {
            handleCurrentAudio(0);
          }

          showPlayer(data);
          return;
        }
      }
      const cachedData = await getData("channelData");
      let cc = await cachedData.filter((item: any) => {
        if (item?.name === product?.name.split("Hörbuch-Abo ")[1]) {
          return true;
        }
      });
      if (cc.length > 0) {
        router.push(`/home/album-detail/channel-purchase?id=${productId}`);
      } else {
        router.push(`/home/album-detail?id=${productId}`);
      }
    } else {
      const productId = product?.id ?? product?.product_id;
      if (productId) {
        router.push(`/home/album-detail?id=${productId}`);
      }
    }
  };

  return (
    <>
      {displayData && displayData.length > 0 && (
        <HeaderLink
          className="py-4 pr-4 ml-2 text-white flex items-center"
          onClick={() => router.back()}
          title={displayData[0]?.catname}
        />
      )}

      {displayData &&
        displayData.length > 0 &&
        displayData.map((item: any) => {
          const productId =
            list == "recently-viewed" ? item?.product_id : item?.id;
          return (
            <div key={item?.id}>
              <div className="w-full spaceBorder px-4">
                <section className="">
                  <div
                    className="w-full flex gap-4 text-white cursor-pointer rounded-md hover:bg-white/10 duration-300 py-6 px-2"
                    onClick={() => openPlayerOrDetails(item)}
                  >
                    <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px] overflow-hidden">
                      <Image
                        src={item?.image}
                        alt={"Image"}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </span>
                    <div className="flex flex-col justify-between">
                      <p className="text-[#b5b7bb] text-sm">{item?.author}</p>
                      <p>{item?.name}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          );
        })}
    </>
  );
}
