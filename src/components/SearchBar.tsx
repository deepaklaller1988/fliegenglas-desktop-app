import API from "@lib/API";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { getImagePath } from "@lib/getImagePath";
import { VscHeartFilled } from "react-icons/vsc";
import FlieLoaderCustom from "./core/FlieLoaderCustom";

interface SearchBarProps {
  searchQuery: { tag: any; id: number };
  onSearch: (query: string) => void;
  suggestions: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearch,
  suggestions,
}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(searchQuery.tag || "");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    setInputValue(searchQuery?.tag || "");
  }, [searchQuery.tag]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue) {
        const filtered = suggestions.filter((suggestion: any) =>
          suggestion?.search_string
            ?.toLowerCase()
            .includes(inputValue.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, suggestions]);

  const fetchData = async () => {
    try {
      const response = API.get(
        `searchProducts?&search=${
          searchQuery?.id
        }&type=tags&time=${new Date().toString()}`
      );

      return response || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const { isLoading, data = {} } = useQuery<any>({
    queryKey: ["search-data", searchQuery],
    queryFn: fetchData,
    enabled: !!searchQuery,
  });

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
    setFilteredSuggestions([]);
  };

  const redirectFromSearch = (type:any, id:any) => {
    switch (type) {
      case 'author':
        router.push(`/home/artist-details?authorId=${id}&role=author`);
        break;
      case 'artist':
        router.push(`/home/artist-details?artistId=${id}&role=artist`);
        break;
      case 'category':
        router.push(`/home/listing?id=${id}`);
        break;
      case 'product':
        console.log(`Invoke commonService.canPlay(${id})`);
        break;
      case 'channel':
        router.push(`/search/channel-details?id=${id}`);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <section className="relative">
        <button
          type="button"
          className="absolute left-4 top-[10px]"
          onClick={() => onSearch(inputValue)}
        >
          <FiSearch className="text-white w-5 h-5" />
        </button>
        <input
          className="text-white bg-[#545b64] py-2 px-10 w-full rounded-md"
          type="text"
          placeholder="Suchen"
          value={inputValue}
          onChange={handleInputChange}
        />
        {isLoading ? (
          <div className="h-10 w-10 absolute right-0 top-0">
            <FlieLoaderCustom />
          </div>
        ) : (
          inputValue && (
            <button
              type="button"
              className="absolute right-3 top-[10px]"
              onClick={handleClear}
            >
              <IoClose className="text-white w-5 h-5" />
            </button>
          )
        )}
      </section>

      <div className="mt-4">
        {filteredSuggestions.length === 0 && inputValue && (
          <p>Kein Suchresultat gefunden.</p>
        )}
        <ul>
          {data && data.length > 0 ? (
            data?.map((item: any) => {
              return (
                <div key={item.id} className="w-full spaceBorder px-4">
                  <section>
                    <div
                      className="w-full flex gap-4 text-white py-6 px-2 rounded-lg hover:bg-white/10 duration-300 cursor-pointer"
                      onClick={() =>
                        router.push(`/home/album-detail?id=${item.id}`)
                      }
                    >
                      <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px]">
                        <img
                          src={
                            item?.local_image
                              ? getImagePath(item?.local_image)
                              : "image-placeholder.png"
                          }
                          alt="Image"
                          className="rounded-lg"
                        />
                      </span>
                      <div className="flex flex-col justify-between">
                        <p className="text-[#b5b7bb] text-sm">{item?.name}</p>

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
            })
          ) : (
            <>
              {!searchQuery.tag &&
                filteredSuggestions.length > 0 &&
                filteredSuggestions.map((item: any, index: number) => (
                  console.log(item,"item"),
                  <div className="w-full spaceBorder px-4" key={index}>
                    <section>
                      <div
                        className="w-full flex gap-4 py-4 my-1 px-2 rounded-lg duration-300 cursor-pointer bg-[#ffffffcc] hover:bg-white text-black"
                          onClick={() => redirectFromSearch(item.type, item.id)}
                      >
                        <span
                          className={`${
                            item?.local_image
                              ? "min-h-[80px] max-h-[80px] min-w-[80px] max-w-[80px]"
                              : ""
                          } `}
                        >
                          {item?.local_image ? (
                            <>
                              <img
                                src={
                                  item?.local_image
                                    ? item?.local_image
                                    : "image-placeholder.png"
                                }
                                alt="Image"
                                className="rounded-lg h-20 w-20 object-cover"
                              />
                            </>
                          ) : (
                            <div className="flex flex-col justify-between">
                              <p className="font-bold">{item?.typeLabel}</p>
                            </div>
                          )}
                        </span>
                        <div className="flex flex-col justify-between">
                          <p className="font-thin">{item?.title}</p>
                        </div>
                      </div>
                    </section>
                  </div>
                ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
