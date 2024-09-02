"use client";
import Link from "next/link";
import { MdKeyboardBackspace } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { VscHeartFilled } from "react-icons/vsc";
import { getImagePath } from "@lib/getImagePath";
import FlieLoader from "./core/FlieLoader";
import { useAudioPlayer } from "context/AudioPlayerContext";
import { getData } from "utils/indexDB";

export default function AuthorDetails() {
  const { showPlayer, handleCurrentAudio, isVisible } = useAudioPlayer();
  const searchParams = useSearchParams();
  const router = useRouter();
  const authorId = searchParams.get("authorId") || "";
  const artistId = searchParams.get("artistId") || "";

  const role = authorId ? "author" : artistId ? "artist" : null;
  const id = authorId || artistId;

  const getUserData = async () => {
    try {
      const response = await API.get(
        `getUserData?role=${role}&id=${id}&time=${new Date().toISOString()}`
      );
      return response || {};
    } catch (error) {
      console.error("Error fetching data:", error);
      return {};
    }
  };
  const { isLoading, data, error } = useQuery<any>({
    queryKey: ["authorDetails", role, id],
    queryFn: getUserData,
    refetchOnWindowFocus: false,
  });

  const openPlayerOrDetails = async (product: any) => {
    const orders: any[] = await getData("order-data");
    if (orders && orders.length > 0) {
      let index: number = -1;
      orders.forEach((value: any, ind: number) => {
        if (value?.line_items && value?.line_items[0].type !== "subscription") {
          if (Number(value?.line_items[0]?.id) === Number(product?.id)) {
            index = ind;
          }
        }
      });

      if (index !== -1) {
        const data: any = {
          categoryID: Number(product?.id),
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
        router.push(`/home/album-detail?id=${product?.id}`);
      }
    } else {
      router.push(`/home/album-detail?id=${product?.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <FlieLoader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="bg-[#6c7279] p-4 ">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 mt-0 mb-4 text-white cursor-pointer"
        >
          <MdKeyboardBackspace className="w-6 h-6" /> Zurück
        </button>
        <div className="w-full flex items-center gap-4 text-white">
          <span className="min-w-[100px] max-h-[100px] min-w-[100px] max-w-[100px] overflow-hidden rounded-full">
            <img
              src={
                data?.image?.includes("assets")
                  ? "/" + data?.image
                  : data?.image || "/image-placeholder.png"
              }
            />
          </span>
          <div className="">
            <span className="text-[24px]">
              {data?.firstname + data.lastname}
            </span>
            <p>{data?.title}</p>
          </div>
        </div>
      </section>
      {data &&
        data?.products?.map((item: any, index: number) => {
          return (
            <div className="w-full spaceBorder px-4" key={index}>
              <section>
                <div
                  className="w-full flex gap-4 text-white py-6 px-2 rounded-lg hover:bg-white/10 duration-300 cursor-pointer"
                  onClick={() => openPlayerOrDetails(item)}
                >
                  <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px]">
                    <img
                      src={getImagePath(item?.local_image)}
                      alt="Image"
                      className="rounded-lg"
                    />
                  </span>
                  <div className="flex flex-col justify-between">
                    <p className="text-[#b5b7bb] text-sm">
                      {item?.CategoryName[0]}
                    </p>
                    <p>{item?.name}</p>

                    <span className="flex gap-2 items-center">
                      {" "}
                      <VscHeartFilled className="text-red-500" />
                      {item?.likes} gefällt das.
                    </span>
                  </div>
                </div>
              </section>
            </div>
          );
        })}
      <div className="w-full p-6 py-10 text-center">
        <Link
          prefetch={true}
          className="rounded-md text-[#232a2c] bg-white/80 p-2 px-3"
          href=""
        >
          Website des/r SprecherIn
        </Link>
      </div>
    </div>
  );
}
