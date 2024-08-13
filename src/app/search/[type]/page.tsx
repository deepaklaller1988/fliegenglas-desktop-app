"use client"
import API from '@lib/API';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getData, saveData } from 'utils/indexDB';

export default function TypePage() {
  const { type } :any= useParams();

  const fetchData = async () => {
    try {
      const role = type === 'nav-author' ? 'Author' : 'Artist';
      const cacheKey = `author-artist-data-${role}`;
      
      const cachedData = await getData(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      const response: any = await API.get(`allUserByRole?&role=${role}&time=${new Date().toString()}`);
      await saveData(cacheKey, response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const {
    isLoading,
    data = [],
  } = useQuery({
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nach Autoren suchen</h1>
      {Object.keys(groupedData).map((letter: string) => (
        <div key={letter}>
          <h2 className="text-lg font-semibold bg-blue-900 text-white p-2">{letter[0]}</h2>
          <ul>
          <li className="p-2 border-b bg-red-500">
              {groupedData[letter].map((item: any, index: number) => (
                <span key={item.user_lastname + item.user_firstname}>
                  {item.user_lastname + " " + item.user_firstname}
                  {index < groupedData[letter].length - 1 && ', '}
                </span>
              ))}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}
