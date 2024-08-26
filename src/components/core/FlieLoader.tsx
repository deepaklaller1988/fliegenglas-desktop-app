import Image from 'next/image';
import React, { useState } from 'react';

const dynamicImage = '/loader-animated-gif.gif';

const FlieLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Image
        src={dynamicImage}
        alt="Dynamic Content"
        width={46}
        height={46}
        className={`w-24 h-24 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoadingComplete={() => setIsLoading(false)}
      />
      {isLoading && (
        <Image
          src="/loader-animated-gif.gif"
          alt="Loading..."
          width={46}
          height={46}
          className="absolute w-24 h-24"
        />
      )}
    </div>
  );
};

export default FlieLoader;
