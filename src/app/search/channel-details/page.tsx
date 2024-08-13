"use client";
import { toasterSuccess } from "@components/core/Toaster";
import API from "@lib/API";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "context/UserContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import "./channel-details.css";
import Image from "next/image";
import { getData, saveData } from "utils/indexDB";

export default function ChannelDetails() {
    const { user }: any = useUser();
    const searchParams = useSearchParams();
    const channelId = searchParams.get("id") || "";
    const [isLiked, setIsLiked] = useState(false);

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


    const getAllCategories = async () => {
        if (!user) {
          return [];
        }
        try {
          const cachedData = await getData('categories');
          if (cachedData) {
            return cachedData;
          }
   

          const channeldata = await getData('channels');
          if (channeldata) {
            return cachedData.categories;

          }     
          
          console.log(channeldata,"channel")

          const response: any = await API.get(`getCategories?&time=${new Date().toString()}`);
          await saveData('categories', response);
          return response;
        } catch (error) {
          console.log(error);
          return [];
        }
      };

    
      const {
        isLoading:isLoadingAll,
        data :allCategory= [],
      } = useQuery({
        queryKey: ["all-categories", user],
        queryFn: getAllCategories,
      });
    
    const handleAddFav = () => {
        mutation.mutate();

    };

const  fetchProductsByCategories=async()=> {
    try {
        // Step 1: Fetch channel data from IndexedDB
        const channelsDatas= await getData('channelData');
        if (!channelsDatas) {
            console.error("No channel data found in IndexedDB");
            return [];
        }

        // Step 2: Fetch categories data from IndexedDB
        const categoriesData = await getData('categories');
        if (!categoriesData) {
            console.error("No categories data found in IndexedDB");
            return [];
        }

        let matchedProducts :any= [];

        for (let channel of channelsDatas) {
            console.log(channelsDatas,"ch====");
            // Assuming channel.id is the ID to match
            for (let categoryId of channel) {
                console.log(categoryId,"categoryid")
                const category = categoriesData.find(cat => cat.id === categoryId);

                if (category) {
                    // Step 5: If the category exists, match the products inside it
                    const matchedCategoryProducts = category.products.filter(product => 
                        channel.categories.includes(product.id)
                    );

                    if (matchedCategoryProducts.length > 0) {
                        matchedProducts = [...matchedProducts, ...matchedCategoryProducts];
                    }
                }
            }
        }

        console.log(matchedProducts, "Matched Products");

        // Step 6: Return or use the matched products
        return matchedProducts;

    } catch (error) {
        console.error("Error fetching or matching data:", error);
        return [];
    }
}

// Example usage
fetchProductsByCategories().then(matchedProducts => {
    // Do something with the matched products
    console.log("Matched Products: ", matchedProducts);
});


    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-3">
            <div className="w-full h-56 bg-gray-300 rounded-md"></div>
        </div>
    );

    return (
        <>
            {/* Top slideshow section */}
            <div className="rightSideSet">
                <div className="w-full relative">
                    <Link href="../search" className='absolute text-white left-4 top-4'>
                        <MdKeyboardBackspace className='w-6 h-6' />
                    </Link>
                    <img src="/assets/channel-header-images/7387.jpg" />
                </div>
                {/* Main content section */}
                {/* <div className="w-full">
                    <div className="w-full playNail p-3 pr-0 py-6 text-white">
                        <div className="full flex gap-2 justify-between pr-3">
                            <b className="text-[22px] leading-tight">
                                Hauptwerke der Philosophie
                            </b>
                            <Link href="" className="text-[14px] whitespace-nowrap mt-1">
                                Alle anzeigen
                            </Link>
                        </div>

                        Horizontal scrollable album list
                        <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
                            {loading ? (
                                Array.from({ length: show }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="loaderGradient w-[220px] h-[220px] min-w-[220px] min-h-[220px] inline-block rounded-md overflow-hidden mr-3"
                                    >
                                        {SkeletonLoader()}
                                    </div>
                                ))
                            ) : (
                                divOne.slice(0, show).map((item: any, index: any) => (
                                    <div
                                        key={index}
                                        className=" inline-block rounded-md overflow-hidden mr-3 w-[220px] h-[220px] min-w-[220px] min-h-[220px]"
                                    >
                                        <Link href={`/home/album-detail?id=${item.id}`}>
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full block rounded-md"
                                                width={220}
                                                height={220}
                                            />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    According to type
                    <div className="w-full playNail p-3 pr-0 py-6 text-white">
                        <div className="full flex gap-2 justify-between pr-3">
                            <b className="text-[22px] leading-tight">
                                Hauptwerke der Philosophie
                            </b>
                            <Link href="" className="text-[14px] whitespace-nowrap mt-1">
                                Alle anzeigen
                            </Link>
                        </div>
                        <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
                            {loading ? (
                                Array.from({ length: show }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="loaderGradient w-[220px] h-[220px] min-w-[220px] min-h-[220px] inline-block rounded-md overflow-hidden mr-3"
                                    >
                                        {SkeletonLoader()}
                                    </div>
                                ))
                            ) : (
                                divTwo.slice(0, show).map((item: any, index: any) => (
                                    <div
                                        key={index}
                                        className="w-[220px] h-[220px] min-w-[220px] min-h-[220px] inline-block rounded-md overflow-hidden mr-3"
                                    >
                                        <Link href={`/home/album-detail?id=${item.id}`}>
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={265}
                                                height={300}
                                                className="w-full block rounded-md"
                                            />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div> */}

<>
      <div className="w-full playNail p-3 pr-0 py-6 text-white">
        <label className="text-[12px]">{"EMPFEHLUNG HEUTE"}</label>
        {"isLoading" ? (
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
        //   "data" &&
        //   "data"?.map((item: any, index: number) => {
        //     return (
        //       <div key={index}>
        //         <div className="full flex gap-2 justify-between pr-3">
        //           <b className="text-[22px] leading-tight">
        //             {item?.category?.name}
        //           </b>
        //           <Link
        //             href={`/home/listing?id=${item?.category?.categoryid}`}
        //             className="text-[14px] whitespace-nowrap mt-1"
        //           >
        //             Alle anzeigen
        //           </Link>
        //         </div>

        //         {/* Horizontal scrollable album list */}
        //         <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
        //           {"isLoading"
        //             ? Array.from({ length: 8 }).map((_, index) => (
        //                 <div
        //                   key={index}
        //                   className="loaderGradient w-[220px] h-[220px] min-w-[220px] min-h-[220px] inline-block rounded-md overflow-hidden mr-3"
        //                 >
        //                   {SkeletonLoader()}
        //                 </div>
        //               ))
        //             : item?.products
        //                 ?.slice(0, 8)
        //                 .map((product: any, index: any) => (
        //                   <div
        //                     key={index}
        //                     className="inline-block rounded-md overflow-hidden mr-3 w-[220px] h-[220px] min-w-[220px] min-h-[220px]"
        //                   >
        //                     <Link href={`/home/album-detail?id=${product?.id}`}>
        //                       <Image
        //                         src={product?.image || ""}
        //                         alt={product?.name || ""}
        //                         width={150}
        //                         height={150}
        //                         className="w-full block rounded-md"
        //                       />
        //                     </Link>
        //                   </div>
        //                 ))}
        //         </div>
        //       </div>
        //     );
        //   })
        <></>
        )}
      </div>
    </>
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
