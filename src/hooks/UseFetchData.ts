"use client";
import { useState, useEffect } from 'react';
import { getData, saveData } from 'utils/indexDB';


const useFetchPageData = (slug: string) => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (slug) {
          const cachedData = await getData(slug);
          if (cachedData) {
            setPageData(cachedData);
            setLoading(false);
            return;
          }
          const url = `${process.env.NEXT_PUBLIC_URL}pages/?slug=${slug}&time=`;
          const response = await fetch(url);
          const data = await response.json();

          await saveData(slug, data);

          setPageData(data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData()
  }, [slug]);

  return { pageData, loading, error };
};

export default useFetchPageData;
