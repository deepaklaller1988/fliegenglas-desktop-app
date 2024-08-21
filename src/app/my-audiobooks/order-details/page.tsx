"use client"
import React, { useEffect, useState } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import Image from 'next/image';
import './order-detail.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { getData } from 'utils/indexDB';
import { getImagePath } from '@lib/getImagePath';

const OrderDetails = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "";
    const name = searchParams.get("name") || "";
    const [orderList, setOrderList] = useState<any[]>([]);


    useEffect(() => {
        const fetchOrdersFromDB = async () => {
            try {
                const orders: any[] = await getData('order-data');

                if (orders && orders.length > 0) {
                    const newSup: any = {};
                    orders.forEach((value: any) => {
                        console.log(value)
                        if (value.line_items && value.line_items[0].type !== 'subscription') {
                            value.line_items[0].CategoryName.forEach((cat: string) => {
                                if (!newSup[cat]) {
                                    newSup[cat] = [];
                                }
                                newSup[cat].push(value);
                            });
                        }
                    });
                    if (newSup[name]) {
                        setOrderList(newSup[name]);
                    }
                }
            } catch (error) {
                console.error('Error fetching orders from IndexedDB:', error);
            }
        };

        fetchOrdersFromDB();
    }, [id]);

    return (

        <div className='rightSideSet'>
            {name && (
                <div className="header">
                    <div onClick={() => router.back()}>
                        <div className="py-4 pr-4 text-white flex items-center">
                            <HiArrowLeft className="text-lg ml-4" />
                            <div className="flex-grow text-center">
                                <h4 className="flex gap-1 pt-0 pb-4 text-white justify-center mt-6">
                                    {name}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {orderList &&
                orderList.length > 0 &&
                orderList.map((item: any) => {
                    return (
                        <div key={item?.id}>
                            <div className="w-full spaceBorder px-4">
                                <section className="">
                                    <div
                                        className="w-full flex gap-4 text-white cursor-pointer rounded-md hover:bg-white/10 duration-300 py-6 px-2"

                                    >
                                        <span className="min-w-[80px] max-h-[80px] min-w-[80px] max-w-[80px] overflow-hidden">
                                            <Image
                                                src={getImagePath(item.line_items[0]?.local_image)}
                                                alt="Order Image"
                                                width={100}
                                                height={100}
                                                className="object-cover w-full h-full"
                                            />
                                        </span>
                                        <div className="flex flex-col justify-between">
                                            <p className="text-[#b5b7bb] text-sm">{item?.author}</p>
                                            <p>{item?.line_items[0]?.name}</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default OrderDetails;
