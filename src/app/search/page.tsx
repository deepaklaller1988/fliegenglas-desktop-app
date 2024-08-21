"use client";

import "./search.css";
import Link from "next/link";
import "react-slideshow-image/dist/styles.css";
import HomeSlider from "@components/HomeSlider";
import { useQuery } from "@tanstack/react-query";
import API from "@lib/API";
import { useUser } from "context/UserContext";
import { getData, saveData } from "utils/indexDB";
import Image from "next/image";
import SearchBar from "@components/SearchBar";
import { useState } from "react";
import RefreshButton from "@components/buttons/RefreshButton";
import { staticData } from "@lib/SearchBannerData";

export default function Search() {
  const { user }: any = useUser();
  const [searchQuery, setSearchQuery] = useState<any>("");

  const fetchTagData = async (refresh = false) => {
    if (!user) return [];
    
    if (!refresh) {
      const cachedData = await getData("tags");
      if (cachedData) return cachedData;
    }

    const response: any = await API.get(
      `getTagsearch?&time=${new Date().toString()}`
    );
    await saveData("tags", response.tags);
    return response.tags;
  };

  const fecthSearchSuggestions = async (refresh = false) => {
    if (!user) return [];
    
    if (!refresh) {
      const cachedData = await getData("search-suggestions");
      if (cachedData) return cachedData;
    }

    const response: any = await API.get(
      `/search.json?&time=${new Date().toString()}`
    );
    await saveData("search-suggestions", response);
    return response;
  };

  const getChannelData = async (refresh = false) => {
    if (!user) return [];
    
    if (!refresh) {
      const cachedData = await getData("channelData");
      if (cachedData) return cachedData;
    }

    const response: any = await API.get(
      `getChannels?&user_id=${user.id}?&time=${new Date().toString()}`
    );
    await saveData("channelData", response);
    return response;
  };

  const { isLoading, data = [] } = useQuery({
    queryKey: ["search-data", user],
    queryFn: () => fetchTagData(),
  });

  const { isLoading: isSearchedSuggestion, data: searchData = [] } = useQuery({
    queryKey: ["search-suggestions", user],
    queryFn: () => fecthSearchSuggestions(),
  });

  const { isLoading: isChannelLoading, data: channelData = [] } = useQuery({
    queryKey: ["channel-data", user],
    queryFn: () => getChannelData(),
  });

  const combinedChannelData = [...channelData, ...staticData];

  const handleTagClick = (item: string) => {
    setSearchQuery(item);
  };

  const handleRefresh = async () => {
     fetchTagData(true);
     fecthSearchSuggestions(true);
     getChannelData(true);
  };
  return (
    <div className="rightSideSet">
      <div className="w-full sticky top-0 left-0 p-4 bg-[#0b1521]">
        <SearchBar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          suggestions={searchData}
        />
      </div>
      {searchQuery.tag ? (
        ""
      ) : (
        <>
          {!searchQuery && (
            <div className="w-full p-4">
              <h3 className="text-white">Entdecke Hörbücher unter:</h3>
            </div>
          )}
        </>
      )}
      {searchQuery.tag ? (
        ""
      ) : (
        <>
          {!searchQuery && (
            <>
              <div className="w-full">
                <section className="flex flex-wrap pr-4">
                  {isChannelLoading ? (
                    [...Array(4)].map((_, index) => (
                      <div
                        key={index}
                        className="card flex md:w-2/4 sm:w-2/4 my-2 pl-4"
                      >
                        <div className="w-full h-[300px] bg-gray-300 animate-pulse rounded-md"></div>
                      </div>
                    ))
                  ) : combinedChannelData.length > 0 ? (
                    combinedChannelData?.map((item: any, index: any) => (
                      <div
                        key={index}
                        className="card flex md:w-2/4 sm:w-2/4 my-2 pl-4"
                      >
                        <Link
                          className="w-full"
                          href={
                            item.link || `/search/channel-details?id=${item.id}`
                          }
                        >
                          <Image
                            src={
                              item.banner_image
                                ? item.banner_image
                                : "image-placeholder.png"
                            }
                            alt="img"
                            width={265}
                            height={300}
                            className="w-full block rounded-md"
                          />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-white">Keine Daten verfügbar</p>
                  )}
                </section>
              </div>
              <div className="w-full p-4 mt-2">
                <h3 className="text-white">Häufigste Suchbegriffe:</h3>
                <section className="flex flex-wrap gap-3 mt-2">
                  {data &&
                    data?.map((item: any) => (
                      <Link
                        className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition"
                        href={``}
                        key={item.tag}
                        onClick={() => handleTagClick(item)}
                      >
                        {item.tag}
                      </Link>
                    ))}
                </section>
              </div>
              <div className="w-full mt-4">
                <HomeSlider type="search" />
              </div>

              <RefreshButton onClick={handleRefresh} text="Hörbücher aktualisieren"
                className="w-full p-5 pb-10 flex items-center justify-center" linkClassName="text-[#232a2c] bg-white/80 hover:bg-white transition p-2 px-4 rounded-md" />
            </>
          )}
        </>
      )}
    </div>
  );
}
