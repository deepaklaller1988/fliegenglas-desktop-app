import API from '@lib/API';
import { useQuery } from '@tanstack/react-query';
import { useUser } from 'context/UserContext';
import React from 'react'
import FlieLoader from './core/FlieLoader';
import { Slide } from "react-slideshow-image";
import Link from 'next/link';
import { FaPlayCircle } from "react-icons/fa";
import { getData, saveData } from 'utils/indexDB';
import { useRouter } from 'next/navigation';
import useRole from '@hooks/useRole';


export default function HomeSlider() {
    const { user }: any = useUser()
    const router = useRouter();
  
    const getFavourites = async () => {
        if (!user) {
            return [];
        }
        try {

            const cachedData = await getData('fav-categories');
            if (cachedData) {
              return cachedData;
            }
            const response = await API.get(`getFavChannelProducts?&user_id=${user.id}&time=${new Date().toString()}`);
            await saveData('fav-categories',response );
            return response;        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const {
        isLoading: isFavourite,
        data: sliderData = [],
        error,
    } = useQuery({
        queryKey: ["sliderData", user],
        queryFn: getFavourites,
    });

    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-3">
          <div className="w-full h-56 bg-gray-300 rounded-md"></div>
        </div>
      );

    if (isFavourite) {
        return (
            <FlieLoader />
        )
    }

    
    return (

        <div className="w-full squareSet" id="top">
            <Slide>
                {
                    sliderData?.map((item: any, index: any) => (
                        <div
                            key={index}
                            className="each-slide-effect w-full flex justify-center items-center"
                        >
                            <div className="slider-parent">
                                <div className="card h-full">
                                    <Link
                                        href={`/home/album-detail?id=${item.id}`}>
                                        <img className="w-full" src={item.product_header_graphic} alt="Album" />
                                        <p className="pt-3 pb-3 flex items-center justify-center text-white gap-1">
                                            <FaPlayCircle className="w-5 h-5" /> Jetzt hören
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </Slide>


            
        </div>
    )
}
