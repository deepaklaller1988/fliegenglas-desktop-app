"use client"
import FlieLoader from "@components/core/FlieLoader";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <FlieLoader/>
    </div>
  );
};

export default Loading;
