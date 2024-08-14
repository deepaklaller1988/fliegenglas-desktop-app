import API from '@lib/API';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

interface SearchBarProps {
    searchQuery: { tag:any,id: number};
    onSearch: (query: string) => void;
  }

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearch }) => {
  const [inputValue, setInputValue] = useState(searchQuery.tag);

  useEffect(() => {
    setInputValue(searchQuery?.tag);
  }, [searchQuery.tag]);

  const fetchData = async () => {
    try {
      const response = API.get(
        `searchProducts?&search=${searchQuery?.id}&type=tags&time=${new Date().toString()}`);
      
      return response || [];
    } catch (error) {
      console.log(error);
      return []
    }
  };

  const { isLoading, data = {} } = useQuery<any>({
    queryKey: ["search-data", searchQuery],
    queryFn: fetchData,
    enabled: !!searchQuery
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };
console.log(data,"data");
  return (
    <div>
      <section className="relative">
        <button
          type="button"
          className="absolute left-4 top-[10px]"
          onClick={handleSearch}
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
        <button
          type="button"
          className="absolute right-3 top-[10px]"
          onClick={handleClear}
        >
          <IoClose className="text-white w-5 h-5" />
        </button>
      </section>


      <div className="mt-4">
        {data.length === 0 && !isLoading  && <p>No results found</p>}
        <ul>
          {data && data.length > 0 &&data?.map((item: any, index: number) => (
            <li key={index} className="py-2 px-4 border-b border-gray-300">
              {item.name || 'No name'} 
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
