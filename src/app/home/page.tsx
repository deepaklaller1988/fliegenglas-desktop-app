/* eslint-disable @next/next/no-img-element */
"use client";
import "./album.css";
import "react-slideshow-image/dist/styles.css";
import Link from "next/link";
import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import AlbumSection from "@components/AlbumCard";
import HomeSlider from "@components/HomeSlider";

export default function Album() {
  const { user }: any = useUser()

  const fetchData = async () => {
    if (!user) {
      return [];
    }
    try {
      const response = await API.get(`getCategories?&user_id=${user.id}&time=${new Date().toString()}`);
      return response || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const {
    isLoading,
    data = [],
  } = useQuery({
    queryKey: ["data", user],
    queryFn: fetchData,

  });

  return (
    <>
      {/* Top slideshow section */}

      <div className="rightSideSet">
        <HomeSlider />

        {/* Main content section */}
        <div className="w-full">
          <AlbumSection
            data={data}
            isLoading={isLoading}
          />

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
            Mit <img src="./assets/images/heart.svg" alt="favorite" /> gemacht in
            Zürich
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
