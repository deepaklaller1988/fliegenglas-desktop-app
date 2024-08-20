"use client";
import React from "react";

const ProductDes: React.FC<any> = ({ data }: any) => {
  return (
    <div className="text-black paraPadcz">
      <div
        dangerouslySetInnerHTML={{ __html: (data && data?.description) || "" }}
      />
    </div>
  );
};

export default ProductDes;
