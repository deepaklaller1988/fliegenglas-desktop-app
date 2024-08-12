"use client";
import useFetchPageData from '@hooks/UseFetchData';
import React from 'react';
import FlieLoader from './FlieLoader';

interface PageContentProps {
  slug: string;
}

const PageContent: React.FC<PageContentProps> = ({ slug }) => {
  const { pageData, loading, error } = useFetchPageData(slug);

  if(loading){
    return (
      <FlieLoader/>
    )
  }
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white pt-10 px-2">
      <div dangerouslySetInnerHTML={{ __html: pageData && pageData[0]?.content?.rendered || "" }} />
    </div>
  );
};

export default PageContent;
