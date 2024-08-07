"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { MdKeyboardBackspace } from "react-icons/md";
import Image from 'next/image';
import Data from "../../../fliegenglas";
import "./album-detail.css"
export default function AlbumDetail() {

    const [data, setData] = useState<any>(null);
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || '';
    console.log("Id ", id);

    const getApiData = async () => {
        try {
            const item = Data.find((item: any) => item.id === parseInt(id, 10));
            setData(item);
            console.log("item :", item);
            console.log("Detail-Data", Data);
        } catch (error) {
            console.log("Error ", error);
        }
    };

    useEffect(() => {
        getApiData();
    }, [id]);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className='rightSideSet'>
            <div className='loaderSet w-full h-full items-center justify-center hidden'>
                <Image className="block w-full max-w-[150px]" width={265} height={300} src="../assets/images/loader-animated-gif.gif" alt="Album" />
            </div>
            <div className='w-full h-full overflow-auto bgChangeAlbum bg-cover bg-center bg-fixed' style={{ backgroundImage: `url(${data.image})` }}>
                <div className='w-full p-3 relative z-10'>
                    <Link href="../home" className='flex items-center gap-1 py-2 pb-3 mb-2 text-white'>
                        <MdKeyboardBackspace className='w-6 h-6' /> Zurück
                    </Link>
                    {/* Display the image based on the URL */}
                    <div className='w-full'>
                        <Image className="block w-full shadow-xl" src={data.image} alt="Album" width={265} height={300} />
                    </div>

                    <div className='w-full bg-white/80 rounded-md p-3 mt-3'>
                        <Link href="" className="w-full text-center bg-[#182e49] rounded-md text-white p-3 text-[18px] inline-block m-auto">Hörprobe hören</Link>
                    </div>
                    <div className='w-full bg-white/80 rounded-md p-3 mt-3'>
                        <Link href="" className="w-full text-center bg-[#ff9900] rounded-md text-white p-3 text-[18px] inline-block m-auto">1 Woche kostenlos hören</Link>
                        <div className='w-full border-half-both relative my-2'>
                            <p className='block text-center'>oder</p>
                        </div>
                        <Link href="" className="w-full text-center bg-[#6c7279] rounded-md text-white p-3 text-[18px] inline-block m-auto">Hörbuch ohne Abo kaufen</Link>
                        <div className='w-full flex items-center justify-between gap-1 pt-3'>
                            <p className='text-[#232a2c] text-[16px]'>Preis inkl. MWST (7,7%) </p>
                            <b className='text-[#232a2c] text-[16px]'>€ 19,99</b>
                        </div>
                    </div>
                    <div className='w-full bg-white/80 rounded-md p-3 mt-3 flex flex-col gap-3'>
                        <div className='w-full flex items-center gap-1'>
                            <b className='text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]'>Titel:</b><p className='text-[#232a2c] text-[16px]'>{data.title}</p>
                        </div>
                        <div className='w-full flex items-center gap-1'>
                            <b className='text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]'>Bewertung:</b><p className='text-[#232a2c] text-[16px] flex gap-1 items-center'><Image className='w-[20px]' src="../assets/images/icon-like-new-filled.svg" alt="favorite" width={20} height={20} />{data.likes} gefällt das.</p>
                        </div>
                        <div className='w-full flex items-center gap-1'>
                            <b className='text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]'>Dauer:</b><p className='text-[#232a2c] text-[16px]'>{data.duration}</p>
                        </div>
                        <div className='w-full flex items-center gap-1'>
                            <b className='text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]'>Copyright:</b><p className='text-[#232a2c] text-[16px]'>{data.copyright}</p>
                        </div>
                    </div>
                    <div className='w-full bg-white/80 rounded-md p-3 mt-3 flex gap-3'>
                        <span className='min-w-[85px] max-w-[85px]'>
                            <Image className="block w-full" src={data.image} alt="Author" width={85} height={85} />
                        </span>
                        <span className='relative w-full'>
                            <b className='text-[#232a2c] text-[16px]'>Autor*ln:</b>
                            <p className='text-[#232a2c] text-[16px] opacity-60 leading-none'>{data.author}</p>
                            <Link className='absolute bottom-0 right-0 bg-[#6c7279] text-white w-[128px] p-[5px] px-2 rounded-md text-sm text-center' href="/artist-details">Alle Hörbücher</Link>
                        </span>
                    </div>
                    <div className='w-full bg-white/80 rounded-md p-3 mt-3 flex gap-3'>
                        <span className='min-w-[85px] max-w-[85px]'>
                            <Image className="block w-full" src={data.image} alt="Speaker" width={85} height={85} />
                        </span>
                        <span className='relative w-full'>
                            <b className='text-[#232a2c] text-[16px]'>Sprecher*ln:</b>
                            <p className='text-[#232a2c] text-[16px] opacity-60 leading-none'>{data.speaker}</p>
                            <Link className='absolute bottom-0 right-0 bg-[#6c7279] text-white w-[128px] p-[5px] px-2 rounded-md text-sm text-center' href="/artist-details">Alle Hörbücher</Link>
                        </span>
                    </div>
                    <div className='w-full bg-white/80 rounded-md p-3 py-8 mt-3 flex gap-4 flex-col'>
                        <h2 className='text-center text-[#232a2c]'>Inhalt des Hörbuches</h2>
                        <p className='text-[#232a2c] leading-6'>{data.description}</p>
                        <p className='text-[#232a2c] leading-6'>{data.description2}</p>
                        <p className='text-[#232a2c] leading-6'>{data.description3}</p>
                        <p className='text-[#232a2c] leading-6'>{data.description4}</p>
                        <p className='text-[#232a2c] leading-6'>{data.description5}</p>
                        <p className='text-[#232a2c] leading-6'>{data.description6}</p>
                        <p className='text-[#232a2c] leading-6'>{data.description7}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
