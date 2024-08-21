import API from '@lib/API';
import { useQuery } from '@tanstack/react-query';
import { useUser } from 'context/UserContext';
import React from 'react'
import AudioDetailCard from './AudioDetailCard'
import ProductDes from './ProductDes'

export default function AudioPlayerOptions({ audioDetail }: any) {
  const { user }: any = useUser();

  const fetchData = async () => {
    try {
      const response = API.get(
        // `getProductByID?product_id=${productId}&customerID=${user?.id}`
        `getProductByID?product_id=${audioDetail.categoryID}&customerID=50451`
      );
      return response || {};
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const { isLoading, data = {} } = useQuery<any>({
    queryKey: ["album-detail", audioDetail.categoryID, user?.id],
    queryFn: fetchData,
  });


  return (
    <div className="w-full h-full z-50 overflow-auto bgChangeAlbum bg-cover bg-center bg-fixed">
      <div className="w-full p-3 relative z-10">

        <AudioDetailCard linkHref={`/home/artist-details?authorId=${data?.author_id}&role=author`} imageSrc={"/" + data.authoravatar} title={"Autor*ln"} name={data.author} />
        <AudioDetailCard linkHref={`/home/artist-details?artistId=${data?.artist_id}&role=artist`} imageSrc={"/" + data?.local_image} title={"Sprecher*ln"} name={data.artist} />
        <div className="w-full bg-white/80 rounded-md p-3 py-4 mt-3 flex flex-col">
          <h2 className="text-center text-[#232a2c]">
            {data?.type === "subscription"
              ? "Über dieses Hörbuch-Abo"
              : "Inhalt des Hörbuches"}
          </h2>
          <ProductDes data={data} />
        </div>

      </div>
    </div>
  )
}
