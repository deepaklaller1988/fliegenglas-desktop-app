"use client";
import useFetchPageData from "@hooks/UseFetchData";
import React from "react";
import FlieLoader from "./core/FlieLoader";
import {useRouter} from "next/navigation";
import useRole from "@hooks/useRole";

interface PageContentProps {
  slug: string;
}


const PageContent: React.FC<PageContentProps> = ({ slug }) => {
  const router=useRouter()
  const { pageData, loading, error } = useFetchPageData(slug);
  const [roleLoading, roleData] = useRole();

  if(roleLoading && !roleData.id){
    router.push('/auth/login'); 
    return null;
  }

  if (loading) {
    return <FlieLoader />;
  }

  return (
    <div className="bg-white pt-10 px-2">
      <div
        dangerouslySetInnerHTML={{
          __html: (pageData && pageData[0]?.content?.rendered) || "",
        }}
      />
    </div>
  );
};

export default PageContent;
