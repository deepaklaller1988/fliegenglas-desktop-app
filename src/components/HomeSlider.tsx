import API from '@lib/API';
import { useQuery } from '@tanstack/react-query';
import { useUser } from 'context/UserContext';
import React from 'react'
import FlieLoader from './core/FlieLoader';
import { Slide } from "react-slideshow-image";
import Link from 'next/link';
import { FaPlayCircle } from "react-icons/fa";


export default function HomeSlider() {
    const { user }: any = useUser()

    const getFavourites = async () => {
        if (!user) {
            return [];
        }
        try {
            const response = await API.get(`getFavChannelProducts?&user_id=${user.id}&time=${new Date().toString()}`);
            return response || [];
        } catch (error) {
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
                                        <p className="pt-3 pb-3 flex items-center justify-center text-white gap-1 bg-[#040e1b]">
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
