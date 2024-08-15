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

export default function Search() {
  const { user }: any = useUser();
  const [searchQuery, setSearchQuery] = useState<any>('');

  const staticData = [
    { banner_image: '/assets/images/search-icon-neu.png', link: "/home/listing?id=106" },
    { banner_image: '/assets/images/search-icon-kostenlos.png', link: "/home/listing?id=43"},
    { banner_image: '/assets/images/search-icon-autor.png' , link:"/search/nav-author"},
    { banner_image: '/assets/images/search-icon-sprecher.png',link:"/search/nav-artist" }
  ];

  const fetchData = async () => {
    if (!user) {
      return [];
    }
    try {
      const cachedData = await getData('tags');
      if (cachedData) {
        return cachedData;
      }
      const response: any = await API.get(`getTagsearch?&time=${new Date().toString()}`);
      await saveData('tags', response.tags);
      return response.tags;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const {
    isLoading,
    data = [],
  } = useQuery({
    queryKey: ["search-data", user],
    queryFn: fetchData,
  });

  const getChannelData = async () => {
    if (!user) {
      return [];
    }
    try {
      const cachedData = await getData('channelData');
      if (cachedData) {
        return cachedData;
      }
      const response: any = await API.get(`getChannels?&user_id=${user.id}?&time=${new Date().toString()}`);
      await saveData('channelData', response);
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

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-3">
      <div className="w-full h-56 bg-gray-300 rounded-md"></div>
    </div>
  );
  const combinedChannelData = [...channelData, ...staticData];
console.log(searchQuery.tag,"--");
console.log(data,"-daat-");
  const handleTagClick = (item: string) => {
    setSearchQuery(item);
    // Trigger the search based on the tag
    // Call your API here with the new search query
    // fetchSearchResults(tag);
  };
  return (
    <div className="rightSideSet">
      <div className="w-full sticky top-0 left-0 p-4 bg-[#0b1521]">
       <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
      </div>
      {searchQuery.tag?"":<>
      <div className="w-full p-4">
        <h3 className="text-white">Entdecke Hörbücher unter:</h3>
      </div>
      </>
      }
      {searchQuery.tag? "":<>
      <div className="w-full">
        <section className="flex flex-wrap pr-4">
          {isChannelLoading ? (
            [...Array(4)].map((_, index) => (
              <div key={index} className="card flex md:w-2/4 sm:w-2/4 my-2 pl-4">
                <div className="w-full h-[300px] bg-gray-300 animate-pulse rounded-md"></div>
              </div>
            ))
          ) : combinedChannelData.length > 0 ? (
            combinedChannelData?.map((item: any, index: any) => (
              <div key={index} className="card flex md:w-2/4 sm:w-2/4 my-2 pl-4">
                <Link className="w-full" href={item.link || `/search/channel-details?id=${item.id}`}>
                  <Image
                    src={item.banner_image}
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
          {data && data?.map((item: any) => (
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
        <HomeSlider />
      </div>
      <div className="w-full p-5 pb-10 flex items-center justify-center">
        <Link
          className="text-[#232a2c] bg-white/80 hover:bg-white transition p-2 px-4 rounded-md"
          href=""
        >
          Hörbücher aktualisieren
        </Link>
      </div>
      
      </>}
    </div>
  );
}
