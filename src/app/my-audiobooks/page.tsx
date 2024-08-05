/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Data from "../../fliegenglas";
import Image from "next/image";
import { MdKeyboardBackspace } from "react-icons/md";
import "./order-list.css";

interface Item {
    id: string;
    image: string;
    title: string;
    type: string;
    price: number;
    description: string;
    quantity: number;
}

export default function OrderList() {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState<number>(8);

    const getApiData = async () => {
        try {
            setData(Data);
            console.log("Data-Album :", Data);
            setLoading(false);
        } catch (error) {
            console.log("Error :", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getApiData();
    }, []);

    const divOne = data?.filter((itemData: any) => itemData.type.toLowerCase() === "work");
    const divTwo = data?.filter((itemData: any) => itemData.type.toLowerCase() === "activewear");

    // Skeleton loader component for loading state
    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-3">
            <div className="w-full h-56 bg-gray-300 rounded-md"></div>
        </div>
    );

    return (
        <>
            {/* Top slideshow section */}
            <div className="rightSideSet">
                <div className="w-full p-3 pb-0">
                    <Link href="../home" className='flex items-center gap-1 py-2 pb-3 text-white'>
                        <MdKeyboardBackspace className='w-6 h-6' /> Zurück
                    </Link>
                </div>
                {/* Main content section */}
                <div className="w-full">
                    <div className="w-full playNail p-3 pr-0 py-6 text-white">
                        <div className="full flex gap-2 justify-between pr-3">
                            <b className="text-[22px] leading-tight">
                                Hauptwerke der Philosophie
                            </b>
                            <Link href="" className="text-[14px] whitespace-nowrap mt-1">
                                Alle anzeigen
                            </Link>
                        </div>

                        {/* Horizontal scrollable album list */}
                        <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
                            {loading ? (
                                Array.from({ length: show }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="loaderGradient w-[220px] h-[220px] min-w-[220px] min-h-[220px] inline-block rounded-md overflow-hidden mr-3"
                                    >
                                        {SkeletonLoader()}
                                    </div>
                                ))
                            ) : (
                                divOne.slice(0, show).map((item: any, index: any) => (
                                    <div
                                        key={index}
                                        className=" inline-block rounded-md overflow-hidden mr-3 w-[220px] h-[220px] min-w-[220px] min-h-[220px]"
                                    >
                                        <Link href={`/home/album-detail?id=${item.id}`}>
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full block rounded-md"
                                                width={220}
                                                height={220}
                                            />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* According to type */}
                    <div className="w-full playNail p-3 pr-0 py-6 text-white">
                        <div className="full flex gap-2 justify-between pr-3">
                            <b className="text-[22px] leading-tight">
                                Hauptwerke der Philosophie
                            </b>
                            <Link href="" className="text-[14px] whitespace-nowrap mt-1">
                                Alle anzeigen
                            </Link>
                        </div>
                        <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
                            {loading ? (
                                Array.from({ length: show }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="loaderGradient w-[220px] h-[220px] min-w-[220px] min-h-[220px] inline-block rounded-md overflow-hidden mr-3"
                                    >
                                        {SkeletonLoader()}
                                    </div>
                                ))
                            ) : (
                                divTwo.slice(0, show).map((item: any, index: any) => (
                                    <div
                                        key={index}
                                        className="w-[220px] h-[220px] min-w-[220px] min-h-[220px] inline-block rounded-md overflow-hidden mr-3"
                                    >
                                        <Link href={`/home/album-detail?id=${item.id}`}>
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={265}
                                                height={300}
                                                className="w-full block rounded-md"
                                            />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                {/* Refresh button section */}
                <div className="w-full p-5 text-center pb-8">
                    <Link
                        href="#top"
                        className="refreshBtn bg-white/80 rounded-md text-[#232a2c] p-2 px-3 text-[18px] inline-block m-auto"
                    >
                        Hörbücher aktualisieren
                    </Link>
                </div>
            </div>
        </>
    );
}
