"use client";
import React from 'react';

const ProductDes: React.FC<any> = ({ data }:any) => {

  return (
    <div className="bg-white mt-10">
      <div dangerouslySetInnerHTML={{ __html: data && data?.description|| "" }} />
    </div>
  );
};

export default ProductDes;
