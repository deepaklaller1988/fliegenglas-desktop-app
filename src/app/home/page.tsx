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

  const fetchCategoryData = async () => {
    if (!user) {
      return [];
    }
    try {
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

  const fetchRecentlPlayed = async () => {
    if (!user) {
      return [];
    }
    try {
      const response: any = await API.get(
        `recentlyPlayedList/?&user_id=50451&time=${new Date().toString()}`
      );
      await saveData("recently-played", response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useOnlineStatus();

  const { isLoading, data = [] } = useQuery<any>({
    queryKey: ["categories-data", user],
    queryFn: fetchCategoryData,
    initialData: async () => {
      return await getData("home-categories") || [];
    },
  });

  const { isLoading: isRecentlyPlayed, data: recentlyPlayed = [], refetch: refetchRecentlyPlayed } = useQuery({
    queryKey: ["recently-played", user],
    queryFn: fetchRecentlPlayed,
    initialData: async () => {
      return await getData("recently-played") || [];
    },
  });

  const handleRefresh = async () => {
    await fetchCategoryData()
    await fetchRecentlPlayed()
  };

  return (
    <>
      {/* Top slideshow section */}
      <div className="rightSideSet">
        <HomeSlider type="home" />

        {/* Main content section */}
        <div className="w-full">
          <AlbumSection
            data={data}
            recentlyPlayed={recentlyPlayed}
            isRecentlyPlayed={isRecentlyPlayed}
            isLoading={isLoading}
          />
        </div>

        {/* Refresh button section */}
        <div className="w-full p-5 text-center pb-8" onClick={handleRefresh}>
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
