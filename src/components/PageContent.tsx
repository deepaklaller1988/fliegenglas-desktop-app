"use client";
import useFetchPageData from '@hooks/UseFetchData';
import React from 'react';

interface PageContentProps {
  slug: string;
}

const PageContent: React.FC<PageContentProps> = ({ slug }) => {
  const { pageData, loading, error } = useFetchPageData(slug);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white mt-10">
      <div dangerouslySetInnerHTML={{ __html: pageData && pageData[0]?.content?.rendered || "" }} />
    </div>
  );
};

export default PageContent;
