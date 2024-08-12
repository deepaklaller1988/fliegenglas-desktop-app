"use client";
import Link from "next/link";
import { MdKeyboardBackspace } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import FlieLoader from "./FlieLoader";
import { VscHeartFilled } from "react-icons/vsc";
import { getImagePath } from "@lib/getImagePath";


export default function AuthorDetails() {
  const searchParams = useSearchParams();
  const authorId = searchParams.get("authorId") || "";
  const artistId = searchParams.get("artistId") || "";

  const role = authorId ? "author" : artistId ? "artist" : null;
  const id = authorId || artistId;

  const getData = async () => {
    try {
      const response = await API.get(`getUserData?role=${role}&id=${id}&time=${new Date().toISOString()}`);
      return response || {}
    } catch (error) {
      console.error('Error fetching data:', error);
      return {};
    }
  };
  const {
    isLoading,
    data,
    error,
  } = useQuery<any>({
    queryKey: ["authorDetails", role, id],
    queryFn: getData,
    refetchOnWindowFocus: false,

  });

  if (isLoading) {
    return (
      <div>
        <FlieLoader />;
      </div>
    )

  }

  return (

    <div className='rightSideSet'>
      <section className="bg-[#6c7279] p-4">
        <Link href="../home" className='flex items-center gap-1 pt-0 pb-4 text-white'>
          <MdKeyboardBackspace className='w-6 h-6' /> Zurück
        </Link>
        <div className="w-full flex items-center gap-4 text-white">
          <span className="min-w-[100px] max-h-[100px] min-w-[100px] max-w-[100px] overflow-hidden rounded-full">
            <img src={"/" + data?.image || ""} />
          </span>
          <div className="">
            <span className="text-[24px]">{data?.firstname + data.lastname}</span>
            <p>{data?.title}</p>
          </div>
        </div>
      </section>
      {data && data?.products?.map((item: any) => {
        return (
          <div className="w-full pt-4 spaceBorder px-4">
            <section className="py-6">
              <div className="w-full flex gap-4 text-white">
                <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px]">
                  <img src={getImagePath(item?.local_image)} alt="Image" />
                </span>
                <div className="flex flex-col justify-between">
                  <p className="text-[#b5b7bb] text-sm">{item?.CategoryName[0]}</p>
                  <p>{item?.name}</p>

                  <span className="flex gap-2 items-center"> <VscHeartFilled className="text-red-500" />
                    {item?.likes} gefällt das.</span>
                </div>
              </div>
            </section>

          </div>
        )

      })}
      <div className="w-full p-6 py-10 text-center">
        <Link className="rounded-md text-[#232a2c] bg-white/80 p-2 px-3" href="">Website des/r SprecherIn</Link>
      </div>
    </div>
  );
}
