/* eslint-disable @next/next/no-img-element */
"use client";
import "./album.css";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { FaPlayCircle } from "react-icons/fa";
import Link from "next/link";
import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import AlbumSection from "@components/AlbumCard";
import FlieLoader from "@components/core/FlieLoader";

export default function Album() {
  const { user }: any = useUser();

  const fetchData = async () => {
    if (!user) {
      return [];
    }
    try {
      const response = await API.get(
        `getCategories?&user_id=${user.id}&time=${new Date().toString()}`
      );
      return response || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const { isLoading, data = [] } = useQuery({
    queryKey: ["data", user],
    queryFn: fetchData,
  });

  const getFavourites = async () => {
    if (!user) {
      return [];
    }
    try {
      const response = await API.get(
        `getFavChannelProducts?&user_id=${
          user.id
        }&time=${new Date().toString()}`
      );
      return response || [];
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

  if (isFavourite) {
    return <FlieLoader />;
  }

  return (
    <>
      {/* Top slideshow section */}
      <div className="rightSideSet">
        <div className="w-full squareSet" id="top">
          <Slide>
            {sliderData?.map((item: any, index: any) => (
              <div
                key={index}
                className="each-slide-effect w-full flex justify-center items-center"
              >
                <div className="slider-parent">
                  <div className="card h-full">
                    <Link href={`/home/album-detail?id=${item.id}`}>
                      <img
                        className="w-full"
                        src={item.product_header_graphic}
                        alt="Album"
                      />
                      <p className="pt-3 pb-3 flex items-center justify-center text-white gap-1 bg-[#040e1b]">
                        <FaPlayCircle className="w-5 h-5" /> Jetzt hören
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slide>
        </div>

        {/* Main content section */}

        <div className="w-full">
          <AlbumSection data={data} isLoading={isLoading} />
        </div>

        {/* Refresh button section */}
        <div className="w-full p-5 text-center pb-8">
          <Link
            href="#top"
            className="refreshBtn bg-white/80 rounded-md text-[#232a2c] p-2 px-3 text-[18px] inline-block m-auto"
          >
            Hörbücher aktualisieren
          </Link>
        </div>

        {/* Footer section */}
        <div className="w-full mb-10">
          <p className="flex items-center justify-center text-[14px] gap-1 text-white">
            Mit <img src="./assets/images/heart.svg" alt="favorite" /> gemacht
            in Zürich
          </p>
        </div>

        {/* Privacy policy link */}
        <div className="w-full text-center mb-2">
          <Link
            href="/information/privacy"
            className="bg-white/0 rounded-md text-white p-2 px-3 text-[14px] inline-block m-auto underline"
          >
            Datenschutzerklärung
          </Link>
        </div>
      </div>
    </>
  );
}
