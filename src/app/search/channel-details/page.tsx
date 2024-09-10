"use client";
import { toasterSuccess } from "@components/core/Toaster";
import API from "@lib/API";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import "./channel-details.css";
import { getData, saveData } from "utils/indexDB";
import Image from "next/image";
import RefreshButton from "@components/buttons/RefreshButton";
import ScrollContainer from "react-indiana-drag-scroll";
import { SkeletonLoader } from "@components/core/SkeletonLoader";
import { useAudioPlayer } from "context/AudioPlayerContext";

export default function ChannelDetails() {
  const { user }: any = useUser();
  const searchParams = useSearchParams();
  const channelId = searchParams.get("id") || "";
  const [isLiked, setIsLiked] = useState(false);
  const [channelData, setChannelData] = useState<any>(null);
  const router = useRouter();
  const { showPlayer, handleCurrentAudio, isVisible } = useAudioPlayer();

  useEffect(() => {
    const fetchChannelData = async () => {
      const cachedData = await getData("channelData");
      if (cachedData) {
        const matchSpecifydata = cachedData.find(
          (item: any) => item.id == channelId
        );
        setChannelData(matchSpecifydata);
      }
    };
    fetchChannelData();
  }, [channelId]);

  const mutation: any = useMutation({
    mutationFn: async () => {
      const favStatus = isLiked ? 0 : 1;
      const response = await fetch(
        `addFav?&channel_id=${channelId}&user_id=${
          user?.id
        }&fav=${favStatus}&time=${new Date().toString()}`
      );

      return response;
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      toasterSuccess(
        isLiked
          ? "Als Lieblingskategorie entfernen"
          : "Als Lieblingskategorie hinzugefügt",
        1000,
        "id"
      );
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
    },
  });

  const openPlayerOrDetails = async (product: any) => {
    const orders: any[] = await getData("order-data");
    if (orders && orders?.length > 0) {
      const productId = Number(product?.id ?? product?.product_id);

      const index = orders.findIndex(
        ({ line_items }) =>
          line_items &&
          line_items[0]?.type !== "subscription" &&
          Number(line_items[0].id) === productId
      );

      if (index !== -1) {
        const lineItem = orders[index]?.line_items?.[0];

        if (lineItem) {
          const data: any = {
            categoryID: productId,
            categoryName: lineItem.name,
            imageUrl: lineItem.image,
            backgroundImageUrl: lineItem.player_background_image,
            artist: lineItem.artist,
            shareurl: lineItem.shareurl,
            list: lineItem.downloads,
            primaryCategory: lineItem.primaryCategory,
            paid: true,
          };

          if (!isVisible) {
            handleCurrentAudio(0);
          }

          showPlayer(data);
          return;
        }
      }
      const cachedData = await getData("channelData");
      let cc = await cachedData.filter((item: any) => {
        if (item?.name === product?.name.split("Hörbuch-Abo ")[1]) {
          return true;
        }
      });
      if (cc.length > 0) {
        router.push(`/home/album-detail/channel-purchase?id=${productId}`);
      } else {
        router.push(`/home/album-detail?id=${productId}`);
      }
    } else {
      const productId = product?.id ?? product?.product_id;
      if (productId) {
        router.push(`/home/album-detail?id=${productId}`);
      }
    }
  };

  const getAllCategories = async (
    channelId: string,
    isRefreshing: boolean = false
  ) => {
    try {
      const cacheKey = `categoriesmatched-${channelId}`;

      const cachedData = await getData(cacheKey);
      if (cachedData && !isRefreshing) {
        return cachedData;
      }

      let cachedCategories: any = await getData("categories");
      if (!cachedCategories) {
        console.log("Categories not found in IndexedDB, fetching from API.");
        const response: any = await API.get(
          `getCategories?&time=${new Date().toString()}`
        );
        await saveData("categories", response);
        cachedCategories = response;
      }

      const matchedCategories = await getChannelData(channelId);
      console.log(
        `Saving matched categories for channel ${channelId} in IndexedDB.`
      );
      await saveData(cacheKey, matchedCategories);

      return matchedCategories;
    } catch (error) {
      console.log("Error fetching categories or matching data:", error);
      return [];
    }
  };

  const getChannelData = async (channelId: string) => {
    try {
      const [cachedData, cachedCategories] = await Promise.all([
        getData("channelData"),
        getData("categories"),
      ]);

      if (cachedData && cachedCategories) {
        const matchSpecifydata = cachedData.find(
          (item: any) => item?.id == channelId
        );

        if (matchSpecifydata) {
          const matchedCategories = cachedCategories.filter((item: any) =>
            matchSpecifydata?.categories?.includes(
              item?.category?.categoryid?.toString()
            )
          );

          return matchedCategories;
        }
      }

      console.log("No matched categories found for channel ID:", channelId);
      return [];
    } catch (error) {
      console.error("Error retrieving channel data:", error);
      return [];
    }
  };

  const { isLoading: isLoadingAll, data: allCategory = [] } = useQuery<any>({
    queryKey: ["all-categories", user, channelId],
    queryFn: () => getAllCategories(channelId),
    enabled: !!channelId,
  });

  const handleAddFav = () => {
    mutation.mutate();
  };

  const handleRefresh = async () => {
    await getAllCategories(channelId, true);
  };

  return (
    <>
      {/* Top slideshow section */}
      <div className="rightSideSet">
        <div className="w-full relative">
          <Link href="../search" className="absolute text-white left-4 top-4"  prefetch={true}>
            <MdKeyboardBackspace className="w-6 h-6" />
          </Link>
          {!channelData && (
            <div className="loaderGradient w-full h-[80vh] inline-block rounded-md overflow-hidden mr-3">
              {SkeletonLoader()}
            </div>
          )}
          {channelData && channelData.banner_image && (
            <Image
              src={channelData.banner_image}
              alt="Channel"
              width={1000}
              height={1000}
              loading="lazy"
              className="w-full h-auto background"
            />
          )}
        </div>

        <div className="w-full playNail p-3 pr-0 py-6 text-white">
          <label className="text-[12px]">{"EMPFEHLUNG HEUTE"}</label>
          {isLoadingAll ? (
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
            allCategory &&
            allCategory?.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <div className="full flex gap-2 justify-between pr-3">
                    <b className="text-[22px] leading-tight">
                      {item?.category?.name}
                    </b>
                    <Link
                      href={`/home/listing?id=${item?.category?.categoryid}`}
                      className="text-[14px] whitespace-nowrap mt-1"
                      prefetch={true}
                    >
                      Alle anzeigen
                    </Link>
                  </div>

                  {/* Horizontal scrollable album list */}
                  <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
                    <ScrollContainer className="scroll-container">
                      {isLoadingAll
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
                                className="inline-block rounded-md overflow-hidden mr-3 h-[220px]"
                              >
                                <button className="h-full w-full"
                                  onClick={() => openPlayerOrDetails(product)}
                                >
                                  <img
                                    src={product?.image || ""}
                                    alt={product?.name || ""}
                                    loading="lazy"
                                    className="h-full block rounded-md"
                                  />
                                </button>
                              </div>
                            ))}
                    </ScrollContainer>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="w-full p-5 py-20 text-center">
          <button
            className="mb-10 bg-white/10 rounded-md p-2 px-5 text-bold text-lg text-white border border-1 border-white/50"
            onClick={handleAddFav}
          >
            {isLiked
              ? "Als Lieblingskategorie entfernen"
              : "Als Lieblingskategorie setzen"}
          </button>
          <p className="text-white text-sm">
            {isLiked
              ? "Diese Hörbuch-Kategories wird direkt auf der App-Startseite angezeigt."
              : "Setze diese Kategorie als Lieblingskategorie, um sie jeweils direkt auf der Startseite der App zu sehen."}
          </p>
        </div>

        <RefreshButton
          onClick={handleRefresh}
          linkClassName="refreshBtn bg-white/80 rounded-md text-[#232a2c] p-2 px-3 text-[18px] inline-block m-auto"
          text={"Hörbücher aktualisieren"}
          className="w-full p-5 text-center pb-8"
        />
      </div>
    </>
  );
}
