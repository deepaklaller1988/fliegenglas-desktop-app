"use client";
import "./album.css";
import "react-slideshow-image/dist/styles.css";
import API from "@lib/API";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import AlbumSection from "@components/AlbumCard";
import HomeSlider from "@components/HomeSlider";
import { saveData, getData, putData } from "../../utils/indexDB";
import PrivacyPolicyLink from "@components/PrivacyPolicyLink";
import RefreshButton from "@components/buttons/RefreshButton";
import {  useState } from "react";

export default function Album() {
  const { user }: any = useUser();
  const [refresh, setRefresh] = useState(false);
  const queryClient: any = useQueryClient();

  const fetchAllCategories = async () => {
    if (!user) {
      return [];
    }
    try {
      const cachedData = await getData("categories");
      if (cachedData && !refresh) {
        return cachedData;
      }
      const response: any = await API.get(
        // `getCategories?&user_id=${user.id}&time=${new Date().toString()}`
        `getCategories?&time=${new Date().toString()}`
      );
      await saveData("categories", response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchCategoryData = async () => {
    if (!user) {
      return [];
    }
    try {
      const response: any = await API.get(
        `/catData.json?&time=${new Date().toString()}`
      );
      // await saveData("home-categories", response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchnewCategories = async () => {
    if (!user) {
      return [];
    }
    try {
      const cachedData = await getData("home-categories");
      if (cachedData && !refresh) {
        return cachedData;
      }
      const response: any = await API.get(
        // `getCategories?&user_id=${user.id}&time=${new Date().toString()}`
        `getCategories?&user_id=${50451}&time=${new Date().toString()}`
      );
      const updatedData = response;

      await saveData("home-json", updatedData);

      return updatedData;
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
        // `recentlyPlayedList/?&user_id=${user.id}&time=${new Date().toString()}`
        `recentlyPlayedList/?&user_id=${50451}&time=${new Date().toString()}`
      );
      await saveData("recently-played", response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getOrderByUser = async () => {
    if (!user) {
      return [];
    }
    try {
      const response: any = await API.get(
        `getOrderByUserID/?&userId=${50451}&time=${new Date().toString()}`
      );
      await putData("order-data", response);

      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // const { isLoading, data = [] } = useQuery<any>({
  //   queryKey: ["categories-data", user],
  //   queryFn:fetchCategoryData,

  // });

  const { isLoading, data = [] } = useQuery<any>({
    queryKey: ["categories-data", user],
    queryFn: async () => {
      const cachedData = await getData("home-categories");
      if (cachedData) {
        return cachedData;
      }
      return fetchCategoryData();
    },
  });

  const { isLoading: isRecentlyPlayed, data: recentlyPlayed = [] } = useQuery({
    queryKey: ["recently-played", user],
    queryFn: fetchRecentlPlayed,
  });

  const { isLoading: isOrder, data: orderData = [] } = useQuery({
    queryKey: ["order-data", user],
    queryFn: getOrderByUser,
  });

  const handleRefresh = async () => {
    fetchnewCategories();
    fetchCategoryData();
    fetchRecentlPlayed();
    // fetchAllCategories()
  };

  return (
    <div className="rightSideSet">
      <HomeSlider type="home" />

      <div className="w-full">
        <AlbumSection
          data={data}
          recentlyPlayed={recentlyPlayed}
          isRecentlyPlayed={isRecentlyPlayed}
          isLoading={isLoading}
        />
      </div>

      <RefreshButton
        onClick={handleRefresh}
        linkClassName="refreshBtn bg-white/80 rounded-md text-[#232a2c] p-2 px-3 text-[18px] inline-block m-auto"
        text="Hörbücher aktualisieren"
        className="w-full p-5 text-center pb-8"
      />

      <div className="w-full mb-10">
        <p className="flex items-center justify-center text-[14px] gap-1 text-white">
          Mit <img src="./assets/images/heart.svg" alt="favorite" /> gemacht in
          Zürich
        </p>
      </div>

      <PrivacyPolicyLink />
    </div>
  );
}
