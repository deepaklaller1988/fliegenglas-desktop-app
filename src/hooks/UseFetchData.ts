"use client";
import { useState, useEffect } from 'react';

const useFetchPageData = (slug: string) => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const url = `${process.env.NEXT_PUBLIC_URL}pages/?slug=${slug}&time=`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setPageData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setError(error.message);
          setLoading(false);
        });
    }
  }, [slug]);

  return { pageData, loading, error };
};

export default useFetchPageData;
