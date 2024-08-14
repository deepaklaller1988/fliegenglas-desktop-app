"use client";
import React from "react";
import { useRouter } from "next/navigation";

const ProductDes: React.FC<any> = ({ data }: any) => {
  const router = useRouter();

  return (
    <div className="bg-white/40 rounded-lg p-2 text-black mt-2">
      <div
        dangerouslySetInnerHTML={{ __html: (data && data?.description) || "" }}
      />
    </div>
  );
};

export default ProductDes;
