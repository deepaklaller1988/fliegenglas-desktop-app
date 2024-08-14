"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import useRole from "@hooks/useRole";
import { useRouter } from "next/navigation";

const AlbumSection = ({ data, isLoading }: any) => {
  const router = useRouter();
  const [roleLoading, roleData] = useRole();

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-3">
      <div className="w-full h-56 bg-gray-300 rounded-md"></div>
    </div>
  );

  if(roleLoading && !roleData.id){
    router.push('/auth/login'); 
    return null;
  }
  return (
    <>
      <div className="w-full playNail p-3 pr-0 py-6 text-white">
        <label className="text-[12px]">{"EMPFEHLUNG HEUTE"}</label>
        {isLoading ? (
          <>
            <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="loaderGradient w-[220px] h-[220px] min-w-[220px] min-h-[220px] inline-block rounded-md overflow-hidden mr-3"
                >
                  {SkeletonLoader()}
                </div>
              ))}
            </div>
          </>
        ) : (
          data &&
          data?.map((item: any, index: number) => {
            return (
              <div key={index}>
                <div className="full flex gap-2 justify-between pr-3">
                  <b className="text-[22px] leading-tight">
                    {item?.category?.name}
                  </b>
                  <Link
                    href={`/home/listing?id=${item?.category?.categoryid}`}
                    className="text-[14px] whitespace-nowrap mt-1"
                  >
                    Alle anzeigen
                  </Link>
                </div>

                {/* Horizontal scrollable album list */}
                <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <div
                          key={index}
                          className="loaderGradient w-[220px] h-[220px] min-w-[220px] min-h-[220px] inline-block rounded-md overflow-hidden mr-3"
                        >
                          {SkeletonLoader()}
                        </div>
                      ))
                    : item?.products
                        ?.slice(0, 8)
                        .map((product: any, index: any) => (
                          <div
                            key={index}
                            className="inline-block rounded-md overflow-hidden mr-3 w-[220px] h-[220px] min-w-[220px] min-h-[220px]"
                          >
                            <Link href={`/home/album-detail?id=${product?.id}`}>
                              <Image
                                src={product?.image || ""}
                                alt={product?.name || ""}
                                width={150}
                                height={150}
                                className="w-full block rounded-md"
                              />
                            </Link>
                          </div>
                        ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default AlbumSection;
