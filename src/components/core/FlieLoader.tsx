import Image from 'next/image';
import React, { useState } from 'react';
const FlieLoader = () => {

  return (
    <div className="flex items-center justify-center h-screen w-full">
        <Image
          src="/loader-animated-gif.gif"
          alt="Loading..."
          width={46}
          height={46}
          className="absolute w-24 h-24"
        />
    </div>
  );
};

export default FlieLoader;
