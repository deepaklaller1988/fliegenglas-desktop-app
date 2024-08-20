import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ScrollContainer from "react-indiana-drag-scroll";

const AlbumSection = ({
  data,
  isLoading,
  recentlyPlayed,
  isRecentlyPlayed,
}: any) => {
  const router = useRouter();

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-3">
      <div className="w-full h-56 bg-gray-300 rounded-md"></div>
    </div>
  );

  const renderAlbumItems = (item: any) => (
    <div
      className="w-full playNail p-3 pr-0 py-6 text-white"
      key={item?.category?.categoryid}
    >
      <div className="full flex gap-2 justify-between pr-3">
        <b className="text-[22px] leading-tight">{item?.category?.name}</b>
        <Link
          href={`/home/listing?id=${item?.category?.categoryid}`}
          className="text-[14px] whitespace-nowrap mt-1"
        >
          Alle anzeigen
        </Link>
      </div>
      {/* Horizontal scrollable album list */}
      <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
        <ScrollContainer className="scroll-container">
          {item?.products?.slice(0, 8)?.map((product: any, index: any) => (
            <div
              key={index}
              className="inline-block rounded-md overflow-hidden mr-3 w-[220px] h-[220px] min-w-[220px] min-h-[220px]"
            >
              <button
                onClick={() => {
                  router.push(`/home/album-detail?id=${product?.id}`);
                  sessionStorage?.setItem("page-image", product?.image);
                }}
              >
                <Image
                  src={product?.image || ""}
                  alt={product?.name || ""}
                  width={150}
                  height={150}
                  className="w-full block rounded-md"
                />
              </button>
            </div>
          ))}
        </ScrollContainer>
      </div>
    </div>
  );

  return (
    <>
      <div className="">
        {recentlyPlayed && recentlyPlayed?.length > 0 && (
          <div className="w-full playNail p-3 pr-0 py-6 text-white">
            <div>
              <div className="text-[12px]">{"MEINE HÖRBÜCHER"}</div>
              <div className="flex justify-between items-center">
                <div className="text-[22px]">{"Zuletzt gehört"}</div>
                <Link
                  href="/home/recently-viewed"
                  className="text-[14px] whitespace-nowrap mt-1 mr-2"
                >
                  Alle anzeigen
                </Link>
              </div>
            </div>

            <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
              <ScrollContainer className="scroll-container">
                {recentlyPlayed?.slice(0, 8).map((item: any, index: any) => (
                  <div
                    key={index}
                    className="inline-block rounded-md overflow-hidden mr-3 w-[220px] h-[220px] min-w-[220px] min-h-[220px]"
                  >
                    <button
                      onClick={() => {
                        router.push(`/home/album-detail?id=${item?.id}`);
                        sessionStorage?.setItem("page-image", item?.image);
                      }}
                    >
                      <Image
                        src={item?.image || ""}
                        alt={item?.name || ""}
                        width={150}
                        height={150}
                        className="w-full block rounded-md"
                      />
                    </button>
                  </div>
                ))}
              </ScrollContainer>
            </div>
          </div>
        )}

        {isLoading ? (
          <ScrollContainer className="scroll-container">
            <div className="whitespace-nowrap overflow-none mt-4 scrollSet flex">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="loaderGradient w-[220px] h-[220px] min-w-[220px] min-h-[220px] inline-block rounded-md overflow-hidden mr-3"
                >
                  {SkeletonLoader()}
                </div>
              ))}
            </div>
          </ScrollContainer>
        ) : (
          data &&
          data.length > 0 &&
          data
            ?.filter(
              (item: any) =>
                item?.category?.name?.toLowerCase() !== "uncategorized"
            )
            .map((item: any) => renderAlbumItems(item))
        )}
      </div>
    </>
  );
};

export default AlbumSection;
