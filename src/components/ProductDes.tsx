"use client";
import React from "react";

const ProductDes: React.FC<any> = ({ data }: any) => {

  return (
    <div className="bg-white/40 rounded-lg p-2 text-black mt-2 paraPadcz">
      <div
        dangerouslySetInnerHTML={{ __html: (data && data?.description) || "" }}
      />
    </div>
  );
};

export default ProductDes;
