"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./order-detail.css";
import { useRouter, useSearchParams } from "next/navigation";
import { getData } from "utils/indexDB";
import { getImagePath } from "@lib/getImagePath";
import HeaderLink from "@components/HiArrowleft";
import { useAudioPlayer } from "context/AudioPlayerContext";

const OrderDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const name = searchParams.get("name") || "";
  const [orderList, setOrderList] = useState<any[]>([]);
  const { showPlayer, handleCurrentAudio, isVisible } = useAudioPlayer();

  useEffect(() => {
    const fetchOrdersFromDB = async () => {
      try {
        const orders: any[] = await getData("order-data");

        if (orders && orders.length > 0) {
          const newSup: any = {};
          orders.forEach((value: any) => {
            if (
              value.line_items &&
              value.line_items[0].type !== "subscription"
            ) {
              value.line_items[0].CategoryName.forEach((cat: string) => {
                if (!newSup[cat]) {
                  newSup[cat] = [];
                }
                newSup[cat].push(value);
              });
            }
          });
          if (newSup[name]) {
            setOrderList(newSup[name]);
          }
        }
      } catch (error) {
        console.error("Error fetching orders from IndexedDB:", error);
      }
    };

    fetchOrdersFromDB();
  }, [id]);

  const openPlayerOrDetails = async (product: any) => {
    const orders: any[] = await getData("order-data");
    if (orders && orders.length > 0) {
      let index: number = -1;
      orders.forEach((value: any, ind: number) => {
        if (value.line_items && value.line_items[0].type !== "subscription") {
          if (
            Number(value.line_items[0]?.id) ===
            Number(product?.line_items[0]?.id)
          ) {
            index = ind;
          }
        }
      });

      if (index !== -1) {
        const data: any = {
          categoryID: Number(product?.line_items[0]?.id),
          categoryName: orders[index]?.line_items[0]?.name,
          audioUrl: "",
          imageUrl: orders[index]?.line_items[0]?.image,
          backgroundImageUrl:
            orders[index].line_items[0].player_background_image,
          artist: orders[index].line_items[0].artist,
          shareurl: orders[index].line_items[0].shareurl,
          list: orders[index].line_items[0].downloads,
          primaryCategory: orders[index].line_items[0].primaryCategory,
          paid: true,
        };
        if (!isVisible) {
          handleCurrentAudio(0);
        }

        showPlayer(data);
      } else {
        router.push(`/home/album-detail?id=${product?.line_items[0].id}`);
      }
    } else {
      router.push(`/home/album-detail?id=${product?.line_items[0].id}`);
    }
  };

  return (
    <div className="rightSideSet">
      {name && (
        <HeaderLink
          className="py-4 pr-4 ml-4 text-white flex items-center"
          onClick={() => router.back()}
          title={name}
        />
      )}

      {orderList &&
        orderList.length > 0 &&
        orderList.map((item: any) => {
          return (
            <div key={item?.id}>
              <div className="w-full spaceBorder px-4">
                <section className="">
                  <div
                    className="w-full flex gap-4 text-white cursor-pointer rounded-md hover:bg-white/10 duration-300 py-6 px-2"
                    onClick={() => openPlayerOrDetails(item)}
                  >
                    <div className="h-20 overflow-hidden relative">
                      <Image
                        src={
                          (item.line_items[0]?.image?.includes("assets")
                            ? "/" + item.line_items[0]?.image
                            : item.line_items[0]?.image) ||
                          "/image-placeholder.png"
                        }
                        alt="ord img"
                        width={100}
                        height={100}
                        loading="lazy"
                        className="object-cover rounded-md h-20"
                      />
                    </div>
                    <div className="absolute h-20 flex items-center">
                      <Image
                        src="/assets/images/audio-play.svg"
                        alt="playButton"
                        width={100}
                        height={100}
                        loading="lazy"
                        className="h-10"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[#b5b7bb] text-sm">{item?.author}</p>
                      <p>{item?.line_items[0]?.name}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default OrderDetails;
