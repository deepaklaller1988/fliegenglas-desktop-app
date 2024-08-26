"use client";
import React, { useEffect, useState } from "react";
import useTitle from "@hooks/useTitle";
import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import { getData, putData } from "utils/indexDB";
import PageContent from "@components/PageContent";
import ScrollContainer from "react-indiana-drag-scroll";
import Link from "next/link";
import Image from "next/image";
import { getImagePath } from "@lib/getImagePath";
import { SkeletonLoader } from "@components/core/SkeletonLoader";
import { useAudioPlayer } from "context/AudioPlayerContext";

const OrderList: React.FC = () => {
  useTitle("Meine Hörbücher");
  const { user }: any = useUser();
  const [filteredList, setFilteredList] = useState<any>({});
  const { showPlayer, handleCurrentAudio, isVisible } = useAudioPlayer();

  const getOrderByUser = async () => {
    if (!user) {
      return [];
    }
    try {
      const response: any = await API.get(
        `getOrderByUserID/?&userId=${50451}&time=${new Date().toString()}`
        // `getOrderByUserID/?&userId=${user.id}&time=${new Date().toString()}`
      );
      await putData("order-data", response);

      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const {
    isLoading,
    data: orderList = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["order-data", user],
    queryFn: getOrderByUser,
    enabled: !!user,
    staleTime: 0,
  });

  const filterOrders = async () => {
    let newSup: any = {};
    const categoriesData = await getData("categories");
    if (categoriesData) {
      categoriesData.forEach((cat: any) => {
        newSup[cat] = [];
      });
    }

    orderList.forEach((value: any) => {
      if (value.line_items && value.line_items[0].type !== "subscription") {
        let cat = value.line_items[0].primaryCategory;
        if (typeof cat === "string") {
          if (!newSup[cat]) {
            newSup[cat] = [];
          }
          newSup[cat].push(value);
        }
      }
    });
    setFilteredList(newSup);
  };

  useEffect(() => {
    if (orderList.length > 0) {
      filterOrders();
    }
  }, [orderList]);

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (err) {
      console.log("Error during refetch:", err);
    }
  };

  const openPlayerOrDetails = async (product: any) => {
    const data: any = {
      categoryID: Number(product?.line_items[0].id),
      categoryName: product?.line_items[0].name,
      audioUrl: "",
      imageUrl: product?.line_items[0].image,
      backgroundImageUrl: product?.line_items[0].player_background_image,
      artist: product?.line_items[0].artist,
      shareurl: product?.line_items[0].shareurl,
      list: product?.line_items[0].downloads,
      primaryCategory: product?.line_items[0].primaryCategory,
      paid: true,
    };
    if (!isVisible) {
      handleCurrentAudio(0);
    }

    showPlayer(data);
  };

  const renderAlbumItems = (item: any, index: any) => (
    console.log(item, "item"),
    <div
      className="w-full playNail p-3 pr-0 py-6 text-white"
      key={item?.category?.categoryid || `item-${index}`}
    >
      {/* {index == 0 && (
        <div className="text-white p-8 shadow-lg text-center w-full">
          <h2 className="text-xl font-semibold mb-4">Meine Hörbücher</h2>
        </div>
      )} */}
      <div className="full flex gap-2 justify-between pr-3">
        <b className="text-[22px] leading-tight">{item?.category?.name}</b>
        <Link
          href={`/my-audiobooks/order-details?name=${encodeURIComponent(item?.category?.name)}&id=${item?.category?.categoryid}`}
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
              <button onClick={() => openPlayerOrDetails(product)}>
                <Image
                  src={getImagePath(product.line_items[0]?.image) || ""}
                  alt={product.line_items[0]?.name || ""}
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
    <div className="rightSideSet">
      {isLoading ? (
        <div className="text-white p-8 shadow-lg text-center w-full">
          <h2 className="text-xl font-semibold mb-4">Meine Hörbücher</h2>
          <p className="mb-6 text-sm">Daten werden geladen, bitte warten...</p>
        </div>
      ) : orderList.length === 0 ? (
        <div className="text-white p-8 shadow-lg text-center w-full">
          <h2 className="text-xl font-semibold mb-4">Meine Hörbücher</h2>
          <p className="mb-6 text-sm">
            Unter der E-Mail-Adresse, mit der Sie sich in der App angemeldet
            haben, sind noch keine Hörbücher bestellt worden.
          </p>
          <div className="text-black w-96 m-auto">
            <PageContent slug="es-sind-hier-noch-keine-hoerbuecher-vorhanden" />
          </div>
          <button
            onClick={handleRefresh}
            className={`  
              bg-gray-600 hover:bg-gray-500 text-white py-2 px-10 rounded mt-10`}
          >
            Hörbücher aktualisieren
          </button>
        </div>
      ) : (
        <div>
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
            <div>
              <div className="text-white p-8 shadow-lg text-center w-full">
                <h2 className="text-xl font-semibold mb-4">Meine Hörbücher</h2>
              </div>
              {Object.keys(filteredList).map(
                (category, index: any) =>
                  filteredList[category].length > 0 &&
                  renderAlbumItems(
                    {
                      category: { categoryid: category, name: category },
                      products: filteredList[category],
                    },
                    index
                  )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderList;
