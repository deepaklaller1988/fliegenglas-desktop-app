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

export default function HomeSlider({ type }: any) {
  const { user }: any = useUser();
  const router = useRouter();

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
console.log(sliderData);

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
                  <button
                    onClick={() => {
                      router.push(`/home/album-detail?id=${item?.id}`);
                      sessionStorage.clear();
                    }}
                  >
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
