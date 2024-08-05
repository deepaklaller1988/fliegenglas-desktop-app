"use client";
import Link from "next/link";
import Image from 'next/image';
import { MdKeyboardBackspace } from "react-icons/md";
export default function ArtistDetails() {
    return (
        <div className='rightSideSet'>
            <section className="bg-[#6c7279] p-4">
                <Link href="../home" className='flex items-center gap-1 pt-0 pb-4 text-white'>
                    <MdKeyboardBackspace className='w-6 h-6' /> Zurück
                </Link>
                <div className="w-full flex items-center gap-4 text-white">
                    <span className="min-w-[100px] max-h-[100px] min-w-[100px] max-w-[100px] overflow-hidden rounded-full">
                        <img src="assets/artist_images/artistaandreaslange.jpg" />
                    </span>
                    <div className="">
                        <span className="text-[24px]">Nadine Schaub</span>
                        <p>Schauspielerin und Sprecherin</p>
                    </div>
                </div>
            </section>
            <div className="w-full pt-4 spaceBorder px-4">
                <section className="py-6">
                    <div className="w-full flex gap-4 text-white">
                        <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px]">
                            <img src="assets/artist_images/artistaandreaslange.jpg" />
                        </span>
                        <div className="flex flex-col justify-between">
                            <p className="text-[#b5b7bb] text-sm">Schauspielerin und Sprecherin</p>
                            <p>Nadine Schaub</p>
                            <span className="flex gap-2 items-center"><img className="w-[20px]" src="/assets/icon-like-new-filled.svg" /> 6 gefällt das.</span>
                        </div>
                    </div>
                </section>
                <section className="py-6">
                    <div className="w-full flex gap-4 text-white">
                        <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px]">
                            <img src="assets/artist_images/artistaandreaslange.jpg" />
                        </span>
                        <div className="flex flex-col justify-between">
                            <p className="text-[#b5b7bb] text-sm">Schauspielerin und Sprecherin</p>
                            <p>Nadine Schaub</p>
                            <span className="flex gap-2 items-center"><img className="w-[20px]" src="/assets/icon-like-new-filled.svg" /> 6 gefällt das.</span>
                        </div>
                    </div>
                </section>
                <section className="py-6">
                    <div className="w-full flex gap-4 text-white">
                        <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px]">
                            <img src="assets/artist_images/artistaandreaslange.jpg" />
                        </span>
                        <div className="flex flex-col justify-between">
                            <p className="text-[#b5b7bb] text-sm">Schauspielerin und Sprecherin</p>
                            <p>Nadine Schaub</p>
                            <span className="flex gap-2 items-center"><img className="w-[20px]" src="/assets/icon-like-new-filled.svg" /> 6 gefällt das.</span>
                        </div>
                    </div>
                </section>
                <section className="py-6">
                    <div className="w-full flex gap-4 text-white">
                        <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px]">
                            <img src="assets/artist_images/artistaandreaslange.jpg" />
                        </span>
                        <div className="flex flex-col justify-between">
                            <p className="text-[#b5b7bb] text-sm">Schauspielerin und Sprecherin</p>
                            <p>Nadine Schaub</p>
                            <span className="flex gap-2 items-center"><img className="w-[20px]" src="/assets/icon-like-new-filled.svg" /> 6 gefällt das.</span>
                        </div>
                    </div>
                </section>
                <section className="py-6">
                    <div className="w-full flex gap-4 text-white">
                        <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px]">
                            <img src="assets/artist_images/artistaandreaslange.jpg" />
                        </span>
                        <div className="flex flex-col justify-between">
                            <p className="text-[#b5b7bb] text-sm">Schauspielerin und Sprecherin</p>
                            <p>Nadine Schaub</p>
                            <span className="flex gap-2 items-center"><img className="w-[20px]" src="/assets/icon-like-new-filled.svg" /> 6 gefällt das.</span>
                        </div>
                    </div>
                </section>
                <section className="py-6">
                    <div className="w-full flex gap-4 text-white">
                        <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px]">
                            <img src="assets/artist_images/artistaandreaslange.jpg" />
                        </span>
                        <div className="flex flex-col justify-between">
                            <p className="text-[#b5b7bb] text-sm">Schauspielerin und Sprecherin</p>
                            <p>Nadine Schaub</p>
                            <span className="flex gap-2 items-center"><img className="w-[20px]" src="/assets/icon-like-new-filled.svg" /> 6 gefällt das.</span>
                        </div>
                    </div>
                </section>
            </div>
            <div className="w-full p-6 py-10 text-center">
                <Link className="rounded-md text-[#232a2c] bg-white/80 p-2 px-3" href="">Website des/r SprecherIn</Link>
            </div>
        </div>
    );
}
