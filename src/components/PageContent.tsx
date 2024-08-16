"use client";
import useFetchPageData from "@hooks/UseFetchData";
import React from "react";
import { HiArrowLeft } from "react-icons/hi";
import FlieLoader from "./core/FlieLoader";

interface PageContentProps {
  slug: string;
}

const PageContent: React.FC<PageContentProps> = ({ slug }) => {
  const { pageData, loading, error } = useFetchPageData(slug);

  if (loading) {
    return <FlieLoader />;
  }

  return (
    <div className="bg-white px-2 paraPadcz">
      {slug !== "es-sind-hier-noch-keine-hoerbuecher-vorhanden" && (
        <div className="header">
          <a href="/home">
            <div className="py-4 pr-4 ">
              <HiArrowLeft className="text-lg" />
            </div>
          </a>
        </div>
      )}
      <div
        dangerouslySetInnerHTML={{
          __html: (pageData && pageData[0]?.content?.rendered) || "",
        }}
      />
    </div>
  );
};

export default PageContent;
