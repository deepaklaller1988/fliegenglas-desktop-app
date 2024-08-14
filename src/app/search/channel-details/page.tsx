"use client";
import { toasterSuccess } from "@components/core/Toaster";
import API from "@lib/API";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import "./channel-details.css";
import { getData, saveData } from "utils/indexDB";
import Image from "next/image";

export default function ChannelDetails() {
    const { user }: any = useUser();
    const searchParams = useSearchParams();
    const channelId = searchParams.get("id") || "";
    const [isLiked, setIsLiked] = useState(false);
    const [channelData, setChannelData] = useState<any>(null);


    useEffect(() => {
        const fetchChannelData = async () => {
            const cachedData = await getData("channelData");
            if (cachedData) {
                const matchSpecifydata = cachedData.find((item: any) => item.id == channelId);
                setChannelData(matchSpecifydata);
            }
        };
        fetchChannelData();
    }, [channelId]);

    const mutation: any = useMutation({
        mutationFn: async () => {
            const favStatus = isLiked ? 0 : 1;
            const response = await API.post(`addFav?&channel_id=${channelId}&user_id=${user?.id}&fav=${favStatus}&time=${new Date().toString()}`, {
                channel_id: Number(channelId),
                user_id: user.id.toString(),
                fav: favStatus,
            });
            return response;
        },
        onSuccess: () => {
            setIsLiked(!isLiked);
            toasterSuccess(isLiked ? "Als Lieblingskategorie entfernen" : "Als Lieblingskategorie hinzugefügt", 1000, "id");
        },
        onError: (error: any) => {
            console.error("Mutation error:", error);
        },
    });

    const getAllCategories = async (channelId: string) => {
        if (!user) {
            console.log("No user found, returning empty array.");
            return [];
        }

        try {
            const cacheKey = `categoriesmatched-${channelId}`;
            console.log(`Checking cache for key: ${cacheKey}`);

            const cachedData = await getData(cacheKey);
            if (cachedData) {
                console.log(`Matched categories for channel ${channelId} found in IndexedDB.`);
                return cachedData;
            }

            let cachedCategories: any = await getData('categories');
            if (!cachedCategories) {
                console.log("Categories not found in IndexedDB, fetching from API.");
                const response: any = await API.get(`getCategories?&time=${new Date().toString()}`);
                await saveData('categories', response);
                cachedCategories = response;
            }

            const matchedCategories = await getChannelData(channelId);
            console.log(`Saving matched categories for channel ${channelId} in IndexedDB.`);
            await saveData(cacheKey, matchedCategories);

            return matchedCategories;
        } catch (error) {
            console.log("Error fetching categories or matching data:", error);
            return [];
        }
    };



    const getChannelData = async (channelId: string) => {
        try {
            console.log("Fetching channel data and categories from IndexedDB.");
            const [cachedData, cachedCategories] = await Promise.all([
                getData("channelData"),
                getData("categories"),
            ]);

            if (cachedData && cachedCategories) {
                console.log("Retrieved cached data and categories.");

                const matchSpecifydata = cachedData.find(
                    (item: any) => item.id == channelId
                );

                if (matchSpecifydata) {
                    const matchedCategories = cachedCategories.filter((item: any) =>
                        matchSpecifydata.categories.includes(
                            item.category.categoryid.toString()
                        )
                    );

                    console.log(`Matched categories for channel ${channelId}:`, matchedCategories);
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


    const {
        isLoading: isLoadingAll,
        data: allCategory = [],
    } = useQuery<any>({
        queryKey: ["all-categories", user, channelId],
        queryFn: () => getAllCategories(channelId),
        enabled: !!channelId
    });

    const handleAddFav = () => {
        mutation.mutate();

    };

    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-3">
            <div className="w-full h-56 bg-gray-300 rounded-md"></div>
        </div>
    );

    console.log(channelData)

    return (
        <>
            {/* Top slideshow section */}
            <div className="rightSideSet">
                <div className="w-full relative">
                    <Link href="../search" className='absolute text-white left-4 top-4'>
                        <MdKeyboardBackspace className='w-6 h-6' />
                    </Link>
                    {channelData && channelData.banner_image && (
                        <Image
                            src={channelData.banner_image}
                            alt="Channel"
                            width={600}
                            height={400}
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
                                        >
                                            Alle anzeigen
                                        </Link>
                                    </div>

                                    {/* Horizontal scrollable album list */}
                                    <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
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
                <div className="w-full p-5 py-20 text-center">
                    <button className="mb-10 bg-white/10 rounded-md p-2 px-5 text-bold text-lg text-white border border-1 border-white/50" onClick={handleAddFav}>
                        {isLiked ? "Als Lieblingskategorie entfernen" : "Als Lieblingskategorie setzen"}

                    </button>
                    <p className="text-white text-sm">Diese Hörbuch-Kategories wird direkt auf der App-Startseite angezeigt.</p>
                </div>
                {/* Refresh button section */}
                <div className="w-full p-5 text-center pb-8">
                    <Link
                        href="#top"
                        className="refreshBtn bg-white/80 rounded-md text-[#232a2c] p-2 px-3 text-[18px] inline-block m-auto"
                    >
                        Hörbücher aktualisieren
                    </Link>
                </div>
            </div>
        </>
    );
}
