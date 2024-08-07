/* eslint-disable @next/next/no-img-element */
"use client";
// import "./album.css";
import React, { useEffect, useState } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { FaPlayCircle } from "react-icons/fa";
import Link from "next/link";
import Data from "../../fliegenglas";
import Image from "next/image";
import ScrollContainer from 'react-indiana-drag-scroll'

interface Item {
  id: string;
  image: string;
  title: string;
  type: string;
  price: number;
  description: string;
  quantity: number;
}

export default function Album() {
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
        <div className="w-full squareSet" id="top">
          <Slide>
            {
              data.map((item: any, index: any) => (
                <div
                  key={index}
                  className="each-slide-effect w-full flex justify-center items-center"
                >
                  <div className="slider-parent">
                    <div className="card h-full">
                      <Link
                        href={`/album/album-detail?id=${item.id}`}>

                        <img className="w-full" src={item.image} alt="Album" />
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

        {/* Main content section */}
        <div className="w-full">
          <div className="w-full playNail p-3 pr-0 py-6 text-white">
            <label className="text-[12px]">EMPFEHLUNG HEUTE</label>
            <div className="full flex gap-2 justify-between pr-3">
              <b className="text-[22px] leading-tight">
                Work
              </b>
              <Link href="" className="text-[14px] whitespace-nowrap mt-1">
                Alle anzeigen
              </Link>
            </div>

            {/* Horizontal scrollable album list */}
            <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
              <ScrollContainer className="scroll-container">
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
                      <Link href={`/album/album-detail?id=${item.id}`}>
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
              </ScrollContainer>
            </div>
          </div>

          {/* According to type */}
          <div className="w-full playNail p-3 pr-0 py-6 text-white">
            <div className="full flex gap-2 justify-between pr-3">
              <b className="text-[22px] leading-tight">
                Activewear
              </b>
              <Link href="" className="text-[14px] whitespace-nowrap mt-1">
                Alle anzeigen
              </Link>
            </div>
            <div className="whitespace-nowrap overflow-auto mt-4 scrollSet flex">
            <ScrollContainer className="scroll-container">
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
                    <Link href={`/album/album-detail?id=${item.id}`}>
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
              </ScrollContainer>
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

        {/* Footer section */}
        <div className="w-full mb-10">
          <p className="flex items-center justify-center text-[14px] gap-1 text-white">
            Mit <img src="./assets/images/heart.svg" alt="favorite" /> gemacht in
            Zürich
          </p>
        </div>

        {/* Privacy policy link */}
        <div className="w-full text-center mb-2">
          <Link
            href=""
            className="bg-white/0 rounded-md text-white p-2 px-3 text-[14px] inline-block m-auto underline"
          >
            Datenschutzerklärung
          </Link>
        </div>
      </div>
    </>
  );
}
