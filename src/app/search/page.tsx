/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { Slide } from 'react-slideshow-image';
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import "./search.css";
import Link from "next/link";
import 'react-slideshow-image/dist/styles.css';
export default function Search() {
   
    return (
        
            <div className="rightSideSet">
                <div className="w-full sticky top-0 left-0 p-4 bg-[#0b1521]">
                    <section className="relative">
                        <button className="absolute left-4 top-[10px]"><FiSearch className="text-white w-5 h-5" /></button>
                        <input className="text-white bg-[#545b64] py-2 px-10 w-full rounded-md" type="text" placeholder="Suchen" />
                        <button className="absolute right-3 top-[10px]"><IoClose className="text-white w-5 h-5" /></button>
                    </section>
                </div>
                <div className="w-full p-4">
                    <h3 className="text-white">Entdecke Hörbücher unter:</h3>
                </div>
                <div className="w-full">
                    <section className="flex flex-wrap px-[9px]">
                        <Link className="w-1/2 p-[5px]" href="">
                            <img className="w-full block" src="./assets/images/search/search-icon-7387.png" alt="Search" />
                        </Link>
                        <Link className="w-1/2 p-[5px]" href="">
                            <img className="w-full block" src="./assets/images/search/search-icon-7387.png" alt="Search" />
                        </Link>
                        <Link className="w-1/2 p-[5px]" href="">
                            <img className="w-full block" src="./assets/images/search/search-icon-7387.png" alt="Search" />
                        </Link>
                        <Link className="w-1/2 p-[5px]" href="">
                            <img className="w-full block" src="./assets/images/search/search-icon-7387.png" alt="Search" />
                        </Link>
                        <Link className="w-1/2 p-[5px]" href="">
                            <img className="w-full block" src="./assets/images/search/search-icon-7387.png" alt="Search" />
                        </Link>
                        <Link className="w-1/2 p-[5px]" href="">
                            <img className="w-full block" src="./assets/images/search/search-icon-7387.png" alt="Search" />
                        </Link>
                        <Link className="w-1/2 p-[5px]" href="">
                            <img className="w-full block" src="./assets/images/search/search-icon-7387.png" alt="Search" />
                        </Link>
                        <Link className="w-1/2 p-[5px]" href="">
                            <img className="w-full block" src="./assets/images/search/search-icon-7387.png" alt="Search" />
                        </Link>
                    </section>
                </div>
                <div className="w-full p-4 mt-2">
                    <h3 className="text-white">Häufigste Suchbegriffe:</h3>
                    <section className="flex flex-wrap gap-3 mt-2">
                        <Link className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition" href="">Platon</Link>
                        <Link className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition" href="">Zeit</Link>
                        <Link className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition" href="">Platon</Link>
                        <Link className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition" href="">Platon</Link>
                        <Link className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition" href="">Zeit</Link>
                        <Link className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition" href="">Zeit</Link>
                        <Link className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition" href="">Nora</Link>
                        <Link className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition" href="">Kant</Link>
                    </section>
                </div>
                <div className="w-full mt-4">
                    <h3 className="text-white px-4 pb-3">Beliebteste Hörbücher:</h3>
                    <Slide>
                        <div className='py-8 px-3 flex items-center justify-center bg-cover' style={{ backgroundImage: 'url("../assets/images/background-spezial-20-sprache.jpg")' }}>
                            <img className='shadow-xl max-w-[265px] max-h-[300px]' src="./assets/images/slides/home-top-wittgenstein-pu.jpg" alt="Album" />
                        </div>
                    </Slide>
                </div>
                <div className='w-full p-5 pb-10 flex items-center justify-center'>
                    <Link className='text-[#232a2c] bg-white/80 hover:bg-white transition p-2 px-4 rounded-md' href="">Hörbücher aktualisieren </Link>
                </div>
            </div>
    )
}