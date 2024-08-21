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


export default function Homelisting({ list }: any) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const router = useRouter();
  const { user }: any = useUser();

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
        `recentlyPlayedList/?&user_id=${user?.id}&time=${new Date().toString()}`
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

  const displayData = (list == "recently-viewed" && recentlyData.length > 0) ? recentlyData : data;


  return (
    <>
      {displayData && displayData.length > 0 && (
          <HeaderLink className="py-4 pr-4 ml-2 text-white flex items-center" onClick={() => router.back()} 
          title={displayData[0]?.catname}/>
      )}

      {displayData &&
        displayData.length > 0 &&
        displayData.map((item: any) => {
          const productId = list == "recently-viewed" ? item?.product_id : item?.id;
          return (
            <div key={item?.id}>
              <div className="w-full spaceBorder px-4">
                <section className="">
                  <div
                    className="w-full flex gap-4 text-white cursor-pointer rounded-md hover:bg-white/10 duration-300 py-6 px-2"
                    onClick={() => {
                      router.push(`/home/album-detail?id=${productId}`);
                      sessionStorage?.setItem("page-image", item?.image);
                    }}
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
