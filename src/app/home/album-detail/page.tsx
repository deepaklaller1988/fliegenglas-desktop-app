"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MdKeyboardBackspace } from "react-icons/md";
import Image from "next/image";
import "./album-detail.css";
import { useUser } from "context/UserContext";
import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import ProductDes from "@components/ProductDes";
import FlieLoader from "@components/core/FlieLoader";
import { getImagePath } from "@lib/getImagePath";
import { useAudioPlayer } from "context/AudioPlayerContext";
import PrivacyPolicyLink from "@components/PrivacyPolicyLink";

const fetchImageUrlFromSessionStorage = async () => {
  if (typeof window !== "undefined") {
    const pageImage = sessionStorage?.getItem("page-image");
    return pageImage || "";
  }
  return "";
};

export default function AlbumDetail() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id") || "";
  const { user }: any = useUser();
  const { showPlayer } = useAudioPlayer();

  const fetchData = async () => {
    try {
      const response = API.get(
        // `getProductByID?product_id=${productId}&customerID=${user?.id}`
        `getProductByID?product_id=${productId}&customerID=50451`
      );
      return response || {};
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const { isLoading, data = {} } = useQuery<any>({
    queryKey: ["album-detail", productId, user?.id],
    queryFn: fetchData,
  });

  const { isLoading: isImagLoading, data: imageUrl } = useQuery<any>({
    queryKey: ["image"],
    queryFn: fetchImageUrlFromSessionStorage,
    staleTime: 0,
    enabled: true,
    refetchInterval: 10,
  });

  const handleShowPlayer = () => {
    showPlayer({
      categoryID: data?.id,
      categoryName: data?.name,
      audioUrl: data?.preview_url,
      imageUrl: data?.local_image,
      backgroundImageUrl: data?.player_background_image,
      artist: data?.artist,
      shareurl: data?.shareurl,
    });
  };

  if (isLoading) {
    return <FlieLoader />;
  }

  return (
    <>
      <div className="rightSideSet">
        <div className="loaderSet w-full h-full items-center justify-center hidden">
          <Image
            className="block w-full max-w-[150px]"
            width={265}
            height={300}
            src={""}
            alt="Album"
          />
        </div>
        <div className="w-full h-full overflow-auto bgChangeAlbum bg-cover bg-center bg-fixed">
          <div className="absolute inset-0 h-full z-[-1] bg-black">
            <Image
              src={imageUrl || "/" + data?.local_image}
              alt="Background Image"
              layout="fill"
              objectFit="cover"
              className="blur-2xl opacity-65"
            />
          </div>
          <div className="w-full p-3 relative z-10">
            <Link
              href="../home"
              className="flex items-center gap-1 py-2 pb-3 mb-2 text-white"
            >
              <MdKeyboardBackspace className="w-6 h-6" /> Zurück
            </Link>
            <div className="w-full">
              <Image
                className="block w-full shadow-xl"
                src={imageUrl || "/" + data.local_image}
                alt="Album"
                width={500}
                height={500}
              />
            </div>
            {data?.user_info && data?.type !== "subscription" && (
              <div className="w-full bg-white/80 rounded-md p-3 mt-3">
                <button
                  className="w-full text-center bg-[#182e49] rounded-md text-white p-3 text-[18px] inline-block m-auto"
                  onClick={() => {
                    handleShowPlayer();
                    sessionStorage?.setItem("player-image", imageUrl);
                  }}
                >
                  Hörprobe hören
                </button>
              </div>
            )}
            <div className="w-full bg-white/80 rounded-md p-3 mt-3">
              {data?.type === "subscription" ? (
                <>
                  {data?.flag === 1 ? (
                    <>
                      <p className="text-[#ff9900] border-b-[1px] py-4 border-b-black text-center">
                        Du hast dieses Abo schon gekauft. Die Hörbücher befinden
                        sich unter «Meine Hörbücher».
                      </p>
                    </>
                  ) : (
                    <Link
                      href={``}
                      className="w-full text-center bg-[#ff9900] rounded-md text-white p-3 text-[18px] inline-block m-auto"
                    >
                      1 Woche kostenlos hören
                    </Link>
                  )}
                  <p className="text-black text-center font-100 mt-5 text-[16px]">
                    Danach im Hörbuch-Abo <strong>{data?.preview_price}</strong>{" "}
                    € pro Monat
                  </p>
                  <p className="text-black text-center font-100 text-[16px]">
                    Jederzeit über die App kündbar.
                  </p>
                </>
              ) : (
                <>
                  <Link
                    href={`/home/album-detail?id=${data?.subscriptionProductID}`}
                    className="w-full text-center bg-[#ff9900] rounded-md text-white p-3 text-[18px] inline-block m-auto"
                  >
                    1 Woche kostenlos hören
                  </Link>
                  <div className="w-full border-half-both relative my-2">
                    <p className="block text-center">oder</p>
                  </div>
                  <Link
                    href=""
                    className="w-full text-center bg-[#6c7279] rounded-md text-white p-3 text-[18px] inline-block m-auto"
                  >
                    Hörbuch ohne Abo kaufen
                  </Link>
                  <div className="w-full flex items-center justify-between gap-1 pt-3">
                    <p className="text-[#232a2c] text-[16px]">
                      Preis inkl. MWST (7,7%){" "}
                    </p>
                    <b className="text-[#232a2c] text-[16px]">
                      € {data.preview_price}
                    </b>
                  </div>
                </>
              )}
            </div>

            {data?.type !== "subscription" && (
              <>
                <div className="w-full bg-white/80 rounded-md p-3 mt-3 flex flex-col gap-3">
                  <div className="w-full flex items-center gap-1">
                    <b className="text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]">
                      Titel:
                    </b>
                    <p className="text-[#232a2c] text-[16px]">{data.name}</p>
                  </div>
                  <div className="w-full flex items-center gap-1">
                    <b className="text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]">
                      Bewertung:
                    </b>
                    <p className="text-[#232a2c] text-[16px] flex gap-1 items-center">
                      <Image
                        className="w-[20px]"
                        src="../assets/images/icon-like-new-filled.svg"
                        alt="favorite"
                        width={20}
                        height={20}
                      />
                      {data.likes} gefällt das.
                    </p>
                  </div>
                  <div className="w-full flex items-center gap-1">
                    <b className="text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]">
                      Dauer:
                    </b>
                    <p className="text-[#232a2c] text-[16px]">
                      {data.audiobookDuration}
                    </p>
                  </div>
                  <div className="w-full flex items-center gap-1">
                    <b className="text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]">
                      Copyright:
                    </b>
                    <p className="text-[#232a2c] text-[16px]">
                      {data.copyright}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-white/80 rounded-md p-3 mt-3 flex gap-3">
                  <span className="min-w-[85px] max-w-[85px]">
                    <Image
                      className="block w-full rounded-lg"
                      src={"/" + data.authoravatar}
                      alt="Author"
                      width={85}
                      height={85}
                    />
                  </span>
                  <span className="relative w-full">
                    <b className="text-[#232a2c] text-[16px]">Autor*ln:</b>
                    <p className="text-[#232a2c] text-[16px] opacity-60 leading-none">
                      {data.author}
                    </p>
                    <Link
                      className="absolute bottom-0 right-0 bg-[#6c7279] text-white w-[128px] p-[5px] px-2 rounded-md text-sm text-center"
                      href={`/home/artist-details?authorId=${data?.author_id}&role=author`}
                    >
                      Alle Hörbücher
                    </Link>
                  </span>
                </div>
                <div className="w-full bg-white/80 rounded-md p-3 mt-3 flex gap-3">
                  <span className="min-w-[85px] max-w-[85px]">
                    <Image
                      className="block w-full rounded-lg"
                      src={imageUrl || "/" + data?.local_image}
                      alt="Speaker"
                      width={85}
                      height={85}
                    />
                  </span>
                  <span className="relative w-full">
                    <b className="text-[#232a2c] text-[16px]">Sprecher*ln:</b>
                    <p className="text-[#232a2c] text-[16px] opacity-60 leading-none">
                      {data?.artist}
                    </p>
                    <Link
                      className="absolute bottom-0 right-0 bg-[#6c7279] text-white w-[128px] p-[5px] px-2 rounded-md text-sm text-center"
                      href={`/home/artist-details?artistId=${data?.artist_id}&role=artist`}
                    >
                      Alle Hörbücher
                    </Link>
                  </span>
                </div>
              </>
            )}

            <div className="w-full bg-white/80 rounded-md p-3 py-4 mt-3 flex flex-col">
              <h2 className="text-center text-[#232a2c]">
                {data?.type === "subscription"
                  ? "Über dieses Hörbuch-Abo"
                  : "Inhalt des Hörbuches"}
              </h2>
              {/* <p className="text-[#232a2c] leading-6"> </p> */}
              <ProductDes data={data} />
            </div>

            {data?.type === "subscription" && (
              <div className="w-full bg-white/80 rounded-md p-3 py-5 mt-3 flex flex-col text-black text-center">
                <p>
                  <strong>Alle Fliegenglas Abos</strong>
                </p>
                <p className="text-[16px] mb-4">
                  Fliegenglas bietet folgende Abos an:
                </p>
                <div className="grid grid-rows-2 grid-cols-2 gap-3">
                  {data?.subscription_products.map(
                    (item: any, index: number) => (
                      <Link href={`/home/album-detail?id=${item?.product_id}`}>
                        <Image
                          src={item?.image}
                          alt={`category image ${index}`}
                          height={500}
                          width={500}
                          key={index}
                          className="w-full h-full cursor-pointer"
                        />
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <PrivacyPolicyLink />
        </div>
      </div>
    </>
  );
}
