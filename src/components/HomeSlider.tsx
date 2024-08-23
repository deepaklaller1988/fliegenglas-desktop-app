"use client";

import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import React from "react";
import { Slide } from "react-slideshow-image";
import Link from "next/link";
import { FaPlayCircle } from "react-icons/fa";
import { getData, saveData } from "utils/indexDB";
import { getImagePath } from "@lib/getImagePath";
import { useRouter } from "next/navigation";
import { SkeletonLoader } from "./core/SkeletonLoader";
import { useAudioPlayer } from "context/AudioPlayerContext";

export default function HomeSlider({ type }: any) {
  const { user }: any = useUser();
  const router = useRouter();
  const { showPlayer, handleCurrentAudio, isVisible } = useAudioPlayer();

  const getFavourites = async () => {
    if (!user) {
      return [];
    }
    try {
      const cachedData = await getData("fav-categories");
      if (cachedData) {
        return cachedData;
      }
      const response = await API.get(
        `getFavChannelProducts?&user_id=${
          user.id
        }&time=${new Date().toString()}`
      );
      await saveData("fav-categories", response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const {
    isLoading: isFavourite,
    data: sliderData = [],
    error,
  } = useQuery({
    queryKey: ["sliderData", user],
    queryFn: getFavourites,
  });

  const openPlayerOrDetails = async (product: any) => {
    console.log(product);
    const orders: any[] = await getData("order-data");

    if (orders && orders.length > 0) {
      let index: number = -1;
      orders.forEach((value: any, ind: number) => {
        if (value.line_items && value.line_items[0].type !== "subscription") {
          if (Number(value.line_items[0].id) === Number(product?.id)) {
            index = ind;
          }
        }
      });

      if (index !== -1) {
        const data: any = {
          categoryID: Number(product?.id),
          categoryName: orders[index].line_items[0].name,
          audioUrl: "",
          imageUrl: orders[index].line_items[0].image,
          backgroundImageUrl:
            orders[index].line_items[0].player_background_image,
          artist: orders[index].line_items[0].artist,
          shareurl: orders[index].line_items[0].shareurl,
          list: orders[index].line_items[0].downloads,
          primaryCategory: orders[index].line_items[0].primaryCategory,
        };
        if (!isVisible) {
          // You might need to reset state variables here if you have them in the context
          handleCurrentAudio(0); // Reset current audio index
        }

        showPlayer(data); // Update context with new player details
      } else {
        router.push(`/home/album-detail?id=${product?.id}`);
      }
    }
  };

  if (isFavourite) {
    return (
      <div className="loaderGradient w-full h-[80vh] inline-block rounded-md overflow-hidden mr-3">
        {SkeletonLoader()}
      </div>
    );
  }

  return (
    <div className="w-full squareSet" id="top">
      <Slide>
        {sliderData?.map((item: any, index: any) => (
          <div
            key={index}
            className="each-slide-effect w-full flex justify-center items-center"
          >
            {type === "home" ? (
              <div className="slider-parent">
                <div className="card h-full">
                  <button onClick={() => openPlayerOrDetails(item)}>
                    <img
                      className="w-full"
                      src={getImagePath(item.product_header_graphic)}
                      alt="Album"
                    />
                    <p className="pt-3 pb-3 flex items-center justify-center text-white gap-1">
                      <FaPlayCircle className="w-5 h-5" /> Jetzt hören
                    </p>
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={index}
                className="h-80 text flex items-center justify-center"
              >
                <Link href={`/home/album-detail?id=${item.id}`}>
                  <div>
                    <div className="w-full h-full absolute z-[-1]">
                      <img
                        src={getImagePath(item?.product_header_graphic)}
                        alt="background image"
                        className="blur-xl"
                      />
                    </div>
                  </div>
                  <div className="w-60 z-10 bg-black rounded-xl">
                    <img
                      className="w-full rounded-xl"
                      src={getImagePath(item?.product_header_graphic)}
                      alt="Album"
                    />
                  </div>
                </Link>
              </div>
            )}
          </div>
        ))}
      </Slide>
    </div>
  );
}
