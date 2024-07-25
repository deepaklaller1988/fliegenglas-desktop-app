/* eslint-disable @next/next/no-img-element */
"use client";
import "./album.css";
import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { FaPlayCircle } from "react-icons/fa";
import Link from "next/link";
export default function Album() {
    return (<>
    <div className="rightSideSet">
        <div className="w-full" id="top">
            <Slide>
                <div className="each-slide-effect w-full">
                <Link href="album/album-detail">
                    <img className="block w-full" src="./assets/images/slides/home-top-wittgenstein-pu.jpg" alt="Album" />
                    <p className="pt-3 pb-3 flex items-center justify-center text-white gap-1 bg-[#040e1b]">
                    <FaPlayCircle className="w-5 h-5" /> Jetzt hören</p></Link>
                </div>
            </Slide>
        </div>
        <div className="w-full">
            <div className="w-full playNail p-3 pr-0 py-6 text-white">
                <label className="text-[12px]">EMPFEHLUNG HEUTE</label>
                <div className="full flex gap-2 justify-between pr-3">
                    <b className="text-[22px] leading-tight">Hauptwerke der Philosophie</b>
                    <Link href="" className="text-[14px] whitespace-nowrap mt-1">Alle anzeigen</Link>
                </div>
                <div className="whitespace-nowrap overflow-auto mt-4 scrollSet">
                    <Link href="" className="min-w-[138px] h-[220px] inline-block rounded-md overflow-hidden mr-3">
                        <img className="block h-full" src="./assets/images/slides/home-top-wittgenstein-pu.jpg" alt="Album" />
                    </Link>
                    <Link href="" className="min-w-[138px] h-[220px] inline-block rounded-md overflow-hidden mr-3">
                        <img className="block h-full" src="./assets/images/slides/home-top-platon-politeia.jpg" alt="Album" />
                    </Link>
                    <Link href="" className="min-w-[138px] h-[220px] inline-block rounded-md overflow-hidden mr-3">
                        <img className="block h-full" src="./assets/images/slides/home-top-kant-grundlegung.jpg" alt="Album" />
                    </Link>
                    <Link href="" className="min-w-[138px] h-[220px] inline-block rounded-md overflow-hidden mr-3">
                        <img className="block h-full" src="./assets/images/slides/home-top-wittgenstein-pu.jpg" alt="Album" />
                    </Link>
                    <Link href="" className="min-w-[138px] h-[220px] inline-block rounded-md overflow-hidden mr-3">
                        <img className="block h-full" src="./assets/images/slides/home-top-kant-grundlegung.jpg" alt="Album" />
                    </Link>
                </div>
            </div>
            <div className="w-full playNail p-3 pr-0 py-6 text-white">
                <div className="full flex gap-2 justify-between pr-3">
                    <b className="text-[22px] leading-tight">Hauptwerke der Philosophie</b>
                    <Link href="" className="text-[14px] whitespace-nowrap mt-1">Alle anzeigen</Link>
                </div>
                <div className="whitespace-nowrap overflow-auto mt-4 scrollSet">
                    <Link href="" className="min-w-[138px] h-[220px] inline-block rounded-md overflow-hidden mr-3">
                        <img className="block h-full" src="./assets/images/slides/coversgeschichte2206.jpg" alt="Album" />
                    </Link>
                    <Link href="" className="min-w-[138px] h-[220px] inline-block rounded-md overflow-hidden mr-3">
                        <img className="block h-full" src="./assets/images/slides/home-top-platon-politeia.jpg" alt="Album" />
                    </Link>
                    <Link href="" className="min-w-[138px] h-[220px] inline-block rounded-md overflow-hidden mr-3">
                        <img className="block h-full" src="./assets/images/slides/coverspsychologie2404.jpg" alt="Album" />
                    </Link>
                    <Link href="" className="min-w-[138px] h-[220px] inline-block rounded-md overflow-hidden mr-3">
                        <img className="block h-full" src="./assets/images/slides/home-top-wittgenstein-pu.jpg" alt="Album" />
                    </Link>
                    <Link href="" className="min-w-[138px] h-[220px] inline-block rounded-md overflow-hidden mr-3">
                        <img className="block h-full" src="./assets/images/slides/home-top-kant-grundlegung.jpg" alt="Album" />
                    </Link>
                </div>
            </div>
        </div>
        <div className="w-full p-5 text-center pb-8">
            <Link href="#top" className="refreshBtn bg-white/80 rounded-md text-[#232a2c] p-2 px-3 text-[18px] inline-block m-auto">Hörbücher aktualisieren</Link>
        </div>
        <div className="w-full mb-10">
            <p className="flex items-center justify-center text-[14px] gap-1 text-white"> Mit <img src="./assets/images/heart.svg" alt="favorite" /> gemacht in Zürich </p>
        </div>
        <div className="w-full text-center mb-2">
            <Link href="" className="bg-white/0 rounded-md text-white p-2 px-3 text-[14px] inline-block m-auto underline">Datenschutzerklärung </Link>
        </div>
        </div>
    </>)
}