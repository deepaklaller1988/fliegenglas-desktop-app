"use client";
import "./album.css";
import "react-slideshow-image/dist/styles.css";
import Link from "next/link";
import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import AlbumSection from "@components/AlbumCard";
import HomeSlider from "@components/HomeSlider";
import { saveData, getData } from "../../utils/indexDB";
import PrivacyPolicyLink from "@components/PrivacyPolicyLink";
import useOnlineStatus from "@hooks/UseOnlineStatus";

export default function Album() {
  const { user }: any = useUser();

  const fetchData = async () => {
    if (!user) {
      return [];
    }
    try {
      const cachedData = await getData("home-categories");
      if (cachedData) {
        return cachedData;
      }

      const response: any = await API.get(
        `/catData.json?&time=${new Date().toString()}`
      );

      await saveData("home-categories", response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  useOnlineStatus()

  const { isLoading, data = [] } = useQuery({
    queryKey: ["data", user],
    queryFn: fetchData,
  });

  return (
    <>
      {/* Top slideshow section */}
      <div className="rightSideSet">
        <HomeSlider type="home" />

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
        <PrivacyPolicyLink />
      </div>
    </>
  );
}
