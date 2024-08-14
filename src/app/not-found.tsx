"use client"
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter()

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4  w-full">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-gray-600 mb-4">404</h1>
        <p className="text-3xl font-medium text-gray-700 mb-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button className="w-6/12 ml-20 float-left text-center text-white cursor-pointer border border-white font-sansbutton yellow w-6/12	rounded-md h-[50px]" onClick={handleGoBack}>


          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
