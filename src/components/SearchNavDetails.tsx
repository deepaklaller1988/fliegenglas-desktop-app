"use client";
import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getData, saveData } from "utils/indexDB";
import Link from "next/link";
import FlieLoader from "@components/core/FlieLoader";
import HeaderLink from "@components/HiArrowleft";

export default function TypePage({ type }: any) {
  const router = useRouter();

  const fetchData = async () => {
    try {
      const role = type === "nav-author" ? "Author" : "Artist";
      const cacheKey = `author-artist-data-${role}`;

      const cachedData = await getData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response: any = await API.get(
        `allUserByRole?&role=${role}&time=${new Date().toString()}`
      );
      await saveData(cacheKey, response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { isLoading, data = [] } = useQuery({
    queryKey: ["data", type],
    queryFn: fetchData,
  });

  const sortedData = data.sort((a: any, b: any) => {
    const nameA = (a.user_lastname + a.user_firstname).toUpperCase();
    const nameB = (b.user_lastname + b.user_firstname).toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  const groupedData = sortedData.reduce((acc: any, item: any) => {
    const firstLetter = item.user_lastname[0]?.toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(item);
    return acc;
  }, {});

  const itemsWithoutLastName = Object.keys(groupedData).reduce(
    (acc: any[], letter: string) => {
      const filteredItems = groupedData[letter].filter(
        (item: any) => !item.user_lastname
      );
      return [...acc, ...filteredItems];
    },
    []
  );

  if (isLoading) {
    return <FlieLoader />;
  }

  return (
    <div className="w-full py-4 listSerachCZ">
      <HeaderLink
        className="py-4 pr-4 ml-2 text-white flex items-center"
        onClick={() => router.push("/search")}
        title={data[0]?.catname}
      />

      <h1 className="text-[22px] mb-4 text-white px-4">Nach Autoren suchen</h1>

      {itemsWithoutLastName.length > 0 && (
        <div key="no-lastname" id="no-lastname">
          <h2 className="bg-white/10 p-[1px]"></h2>
          <ul>
            <li className="text-white flex flex-col px-4">
              {itemsWithoutLastName.map((item: any, index: number) => (
                <span
                  className="py-2 border-b border-white/10 cursor-pointer"
                  key={item.user_firstname}
                  onClick={() =>
                    router.push(
                      `/home/artist-details?${
                        type === "nav-author" ? "authorId" : "artistId"
                      }=${item?.ID}`
                    )
                  }
                >
                  <b>
                    {item.user_firstname}
                    {index < itemsWithoutLastName.length - 1 && ", "}
                  </b>
                </span>
              ))}
            </li>
          </ul>
        </div>
      )}

      {Object.keys(groupedData).map((letter: string) => (
        <div key={letter} id={letter}>
          <h2 className="bg-[#112a47] text-[14px] text-white p-4 py-1">
            {letter !== "undefined" ? letter[0] : ""}
          </h2>
          <ul>
            <li className="text-white flex flex-col px-4">
              {groupedData[letter]
                .filter((item: any) => item.user_lastname)
                .map((item: any, index: number) => (
                  <span
                    className="py-2 border-b border-white/10 cursor-pointer"
                    key={item.user_lastname + item.user_firstname}
                    onClick={() =>
                      router.push(
                        `/home/artist-details?${
                          type === "nav-author" ? "authorId" : "artistId"
                        }=${item?.ID}`
                      )
                    }
                  >
                    <b>
                      {item.user_lastname + " " + item.user_firstname}
                      {index < groupedData[letter].length - 1}
                    </b>
                  </span>
                ))}
            </li>
          </ul>
        </div>
      ))}

      <ul id="alphabets" className="display-alphabetic">
        {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(
          (letter) =>
            groupedData[letter] && groupedData[letter].length > 0 ? (
              <li key={letter} className="text-white opacity-50">
                <Link href={`#${letter}`} legacyBehavior prefetch={true}>
                  {letter}
                </Link>
              </li>
            ) : (
              <li key={letter} className="text-white opacity-50">
                <Link href={""} legacyBehavior prefetch={true}>
                  {letter}
                </Link>
              </li>
            )
        )}
      </ul>
    </div>
  );
}
