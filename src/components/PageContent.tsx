"use client";
import useFetchPageData from "@hooks/UseFetchData";
import { useRouter } from "next/navigation";
import React from "react";
import FlieLoader from "./core/FlieLoader";
import HeaderLink from "./HiArrowleft";

interface PageContentProps {
  slug: string;
}

const PageContent: React.FC<PageContentProps> = ({ slug }) => {
  const { pageData, loading, error } = useFetchPageData(slug);
  const router = useRouter()
  
  if (loading) {
    return <FlieLoader />;
  }

  return (
    <div className="bg-white px-2 paraPadcz">
      {slug !== "es-sind-hier-noch-keine-hoerbuecher-vorhanden" && (
        <HeaderLink className="text-lg mb-2 mt-1" onClick={() => router.push("/home")} />
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
