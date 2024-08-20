import React, { useEffect, useState } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import Image from 'next/image';
import './order-detail.css';
import { useUser } from 'context/UserContext';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getData } from 'utils/indexDB'; // Import the getData function

const OrderDetails = () => {
    const { user }: any = useUser();
    const router = useRouter();
    const { id }: any = useParams();
    const [showLoader, setShowLoader] = useState(true);
    const [orderList, setOrderList] = useState<any[]>([]);

    useEffect(() => {
        const fetchOrdersFromDB = async () => {
            try {
                // Fetch data from IndexedDB
                const orders: any[] = await getData('order-data');
                console.log(orders,"op")
                
                if (orders && orders.length > 0) {
                    const newSup: any = {};
                    orders.forEach((value: any) => {
                        if (value.line_items && value.line_items[0].type !== 'subscription') {
                            value.line_items[0].CategoryName.forEach((cat: string) => {
                                if (!newSup[cat]) {
                                    newSup[cat] = [];
                                }
                                newSup[cat].push(value);
                            });
                        }
                    });
                    setOrderList(newSup[id] || []);
                }
            } catch (error) {
                console.error('Error fetching orders from IndexedDB:', error);
            } finally {
                setShowLoader(false);
            }
        };

        fetchOrdersFromDB();
    }, [id]);

    return (
        <div>
            {showLoader && (
                <div className="order-overlay">
                    <img src="assets/images/loader-animated-gif.gif" alt="Loading" />
                </div>
            )}
            <div className={`splash-intro ${showLoader ? 'blur-back' : ''}`}>
                <div className="header list-header header-padding">
                    <button onClick={() => router.back()} className="left-set-arrow">
                        <HiArrowLeft className="text-lg" />
                    </button>
                    <h5>{id}</h5>
                </div>
                <div className="container">
                    <div className="play-list">
                        <ul>
                            {orderList.map((order) => (
                                <li key={order.line_items[0]?.id}>
                                    <span
                                        className="cursor-pointer"
                                        onClick={() => {
                                            // Call your commonService canPlay function here
                                            // e.g., commonService.canPlay(order.line_items[0].id);
                                        }}
                                    >
                                        <Image
                                            src={order.line_items[0]?.local_image}
                                            alt="Order Image"
                                            width={100}
                                            height={100}
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="audio-play">
                                            <img src="assets/images/audio-play.svg" alt="Play" />
                                        </div>
                                    </span>
                                    <div className="lay-list donld-list">
                                        <h6
                                            className="cursor-pointer"
                                            onClick={() => {
                                                // Call your commonService canPlay function here
                                                // e.g., commonService.canPlay(order.line_items[0].id);
                                            }}
                                        >
                                            {order.line_items[0]?.name}
                                        </h6>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
