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
import { useAudioPlayer } from "context/AudioPlayerContext";
import PrivacyPolicyLink from "@components/PrivacyPolicyLink";
import AudioDetailCard from "@components/AudioDetailCard";
import InfoCard from "@components/InfoCard";
import { getData } from "utils/indexDB";

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

  const checkPurchase = async () => {
    const orders: any[] = await getData("order-data");

    if (orders && orders.length > 0) {
      let index: number = -1;
      orders.forEach((value: any, ind: number) => {
        if (value.line_items && value.line_items[0].type !== "subscription") {
          if (Number(value.line_items[0].id) === Number(productId)) {
            index = ind;
          }
        }
      });

      if (index !== -1) {
        return {
          imageUrl: orders[index].line_items[0].image,
          flag: 1,
        };
      } else {
        return {
          imageUrl: "/" + data?.local_image,
          flag: 0,
        };
      }
    }
  };

  const { isLoading: isLoadingCheckPurchase, data: checkPurchaseData = {} } =
    useQuery<any>({
      queryKey: ["check-purchase", productId],
      queryFn: checkPurchase,
    });

  const handleShowPlayer = () => {
    showPlayer({
      categoryID: data?.id,
      categoryName: data?.name,
      list: [
        { m3u8: data?.preview_url?.replace("mp3", "m3u8"), title: data?.name },
      ],
      imageUrl: data?.local_image,
      backgroundImageUrl: data?.player_background_image,
      artist: data?.artist,
      shareurl: data?.shareurl,
      paid: false,
    });
  };

  if (isLoading) {
    return <FlieLoader />;
  }

  return (
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
            src={
              checkPurchaseData?.imageUrl === "/undefined" ||
              checkPurchaseData?.imageUrl === undefined
                ? `/${data?.local_image}`
                : checkPurchaseData?.imageUrl
            }
            alt="Background Image"
            fill={true}
            className="blur-2xl opacity-65 object-cover"
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
              src={
                checkPurchaseData?.imageUrl === "/undefined" ||
                checkPurchaseData?.imageUrl === undefined
                  ? `/${data?.local_image}`
                  : checkPurchaseData?.imageUrl
              }
              alt="Album"
              width={500}
              height={500}
            />
          </div>
          {data?.type !== "subscription" && (
            <div className="w-full bg-white/80 rounded-md p-3 mt-3">
              {checkPurchaseData?.flag === 1 ? (
                <>
                  <p className="text-[#ff9900] border-b-[1px] py-4 border-b-black text-center">
                    Du hast dieses Abo schon gekauft. Die Hörbücher befinden
                    sich unter «Meine Hörbücher».
                  </p>
                  <p className="text-black text-center font-100 mt-5 text-[16px]">
                    Danach im Hörbuch-Abo <strong>{data?.preview_price}</strong>{" "}
                    € pro Monat
                  </p>
                  <p className="text-black text-center font-100 text-[16px]">
                    Jederzeit über die App kündbar.
                  </p>
                </>
              ) : (
                <button
                  className="w-full text-center bg-[#182e49] rounded-md text-white p-3 text-[18px] inline-block m-auto"
                  onClick={() => handleShowPlayer()}
                >
                  Hörprobe hören
                </button>
              )}
            </div>
          )}

          {data?.type === "subscription" ? (
            <div className="w-full bg-white/80 rounded-md p-3 mt-3">
              {isLoadingCheckPurchase ? (
                <FlieLoader />
              ) : checkPurchaseData?.flag === 1 ? (
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
                Danach im Hörbuch-Abo <strong>{data?.preview_price}</strong> €
                pro Monat
              </p>
              <p className="text-black text-center font-100 text-[16px]">
                Jederzeit über die App kündbar.
              </p>
            </div>
          ) : (
            checkPurchaseData?.flag !== 1 && (
              <div className="w-full bg-white/80 rounded-md p-3 mt-3">
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
              </div>
            )
          )}

          {data?.type !== "subscription" && (
            <>
              <InfoCard
                title={data.name}
                likes={data.likes}
                audiobookDuration={data.audiobookDuration}
                copyright={data.copyright}
              />
              <AudioDetailCard
                linkHref={`/home/artist-details?authorId=${data?.author_id}&role=author`}
                imageSrc={"/" + data.authoravatar}
                title={"Autor*ln"}
                name={data.author}
              />
              <AudioDetailCard
                linkHref={`/home/artist-details?artistId=${data?.artist_id}&role=artist`}
                imageSrc={"/" + data?.local_image}
                title={"Sprecher*ln"}
                name={data.artist}
              />
            </>
          )}

          <div className="w-full bg-white/80 rounded-md p-3 py-4 mt-3 flex flex-col">
            <h2 className="text-center text-[#232a2c]">
              {data?.type === "subscription"
                ? "Über dieses Hörbuch-Abo"
                : "Inhalt des Hörbuches"}
            </h2>
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
                {data?.subscription_products.map((item: any, index: number) => (
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
                ))}
              </div>
            </div>
          )}
        </div>
        <PrivacyPolicyLink />
      </div>
    </div>
  );
}
