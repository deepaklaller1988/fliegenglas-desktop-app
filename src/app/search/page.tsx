/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { Slide } from "react-slideshow-image";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import "./search.css";
import Link from "next/link";
import "react-slideshow-image/dist/styles.css";
import Data from "fliegenglas";
import Image from "next/image";

interface Item {
  id: string;
  image: string;
}

export default function Search() {
  const [data, setData] = useState<any>([]);
  const [show, setShow] = useState<number>(4);
  const [loading, setLoading] = useState(true);

  const getApiData = async () => {
    try {
      setData(Data);
      console.log(Data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    getApiData();
  }, []);

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-3">
      <div className="w-full h-56 bg-gray-300 rounded-md"></div>
    </div>
  );

  return (
    <div className="rightSideSet">
      <div className="w-full sticky top-0 left-0 p-4 bg-[#0b1521]">
        <section className="relative">
          <button className="absolute left-4 top-[10px]">
            <FiSearch className="text-white w-5 h-5" />
          </button>
          <input
            className="text-white bg-[#545b64] py-2 px-10 w-full rounded-md"
            type="text"
            placeholder="Suchen"
          />
          <button className="absolute right-3 top-[10px]">
            <IoClose className="text-white w-5 h-5" />
          </button>
        </section>
      </div>
      <div className="w-full p-4">
        <h3 className="text-white">Entdecke Hörbücher unter:</h3>
      </div>
      <div className="w-full">
        <section className="flex flex-wrap pr-4">
          {loading ? (
            [...Array(show)].map((_, index) => (
              <div
                key={index}
                className="card flex md:w-2/4 sm:w-2/4 my-2 pl-4"
              >
                <div className="w-full h-[300px] bg-gray-300 animate-pulse rounded-md"></div>
              </div>
            ))
          ) : data.length > 0 ? (
            data.slice(0, show).map((item: any, index: any) => (
              <div
                key={index}
                className="card flex md:w-2/4 sm:w-2/4 my-2 pl-4"
              >
                <Link
                  href="/channel-details">
                  <Image
                    src={item.image}
                    alt="img"
                    width={265}
                    height={300}
                    className="w-full block rounded-md"
                  />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-white">Keine Daten verfügbar</p>
          )}
        </section>
      </div>
      <div className="w-full p-4 mt-2">
        <h3 className="text-white">Häufigste Suchbegriffe:</h3>
        <section className="flex flex-wrap gap-3 mt-2">
          <Link
            className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition"
            href=""
          >
            Platon
          </Link>
          <Link
            className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition"
            href=""
          >
            Zeit
          </Link>
          <Link
            className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition"
            href=""
          >
            Platon
          </Link>
          <Link
            className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition"
            href=""
          >
            Platon
          </Link>
          <Link
            className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition"
            href=""
          >
            Zeit
          </Link>
          <Link
            className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition"
            href=""
          >
            Zeit
          </Link>
          <Link
            className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition"
            href=""
          >
            Nora
          </Link>
          <Link
            className="p-1 text-[#232a2c] px-2 rounded-md bg-white/80 hover:bg-white/90 transition"
            href=""
          >
            Kant
          </Link>
        </section>
      </div>
      <div className="w-full mt-4">
        <Slide>
          {loading ? (
            Array.from({ length: show }).map((_, index) => (
              <div
                key={index}
                className="min-w-[138px] h-[220px] inline-block rounded-md overflow-hidden mr-3"
              >
                {SkeletonLoader()}
              </div>
            ))
          ) : (
            data.map((item: any, index: any) => (
              <div
                key={index}
                className="each-slide-effect w-full flex justify-center items-center"
              >
                <div className="slider-parent">
                  <div className="card h-full">
                    <Link
                      href={`/home/album-detail?image=${encodeURIComponent(
                        item.image
                      )}`}
                    >
                      <img className="w-full" src={item.image} alt="Album" />

                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </Slide>
      </div>
      <div className="w-full p-5 pb-10 flex items-center justify-center">
        <Link
          className="text-[#232a2c] bg-white/80 hover:bg-white transition p-2 px-4 rounded-md"
          href=""
        >
          Hörbücher aktualisieren
        </Link>
      </div>
    </div>
  );
}
