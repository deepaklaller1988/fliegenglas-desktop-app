"use client";
import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { HiArrowLeft } from "react-icons/hi";
import FlieLoader from "./core/FlieLoader";
import Image from "next/image";
import useRole from "@hooks/useRole";

export default function Homelisting() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const router = useRouter();

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




  if (isLoading) {
    return <FlieLoader />;
  }

  return (
    <>
      {data && data.length > 0 && (
        <div className="header">
          <a href="/home">
            <div className="py-4 pr-4 text-white flex items-center">
              <HiArrowLeft className="text-lg ml-4" />
              <div className="flex-grow text-center">
                <h4 className="flex gap-1 pt-0 pb-4 text-white justify-center mt-6">
                  {data[0]?.catname}
                </h4>
              </div>
            </div>
          </a>
        </div>
      )}

      {data &&
        data.length > 0 &&
        data.map((item: any) => {
          return (
            <div key={item?.id}>
              <div className="w-full spaceBorder px-4">
                <section className="">
                  <div
                    className="w-full flex gap-4 text-white cursor-pointer rounded-md hover:bg-white/10 duration-300 py-6 px-2"
                    onClick={() =>
                      router.push(`/home/album-detail?id=${item?.id}`)
                    }
                  >
                    <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px] overflow-hidden">
                      <Image
                        src={"/" + item?.local_image}
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
