"use client";
import React from "react";
import useRole from "@hooks/useRole";
import { useRouter } from "next/router";

const ProductDes: React.FC<any> = ({ data }: any) => {
  const router=useRouter()

  const [roleLoading, roleData] = useRole();

  if(roleLoading && !roleData.id){
    router.push('/auth/login'); 
    return null;
  }
  
  return (
    <div className="bg-white/40 rounded-lg p-2 text-black mt-2">
      <div
        dangerouslySetInnerHTML={{ __html: (data && data?.description) || "" }}
      />
    </div>
  );
};

export default ProductDes;
