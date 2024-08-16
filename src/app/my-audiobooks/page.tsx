
"use client";
import React from 'react';
import "./order-list.css";
import useTitle from '@hooks/useTitle';
import PageContent from '@components/PageContent';
import { getData, saveData } from 'utils/indexDB';
import API from '@lib/API';
import { useQuery } from '@tanstack/react-query';
import { useUser } from 'context/UserContext';


const OrderList: React.FC = () => {
    useTitle("Meine Hörbücher");
    const { user }: any = useUser();

    const getOrderByUser = async () => {
        if (!user) {
            return [];
        }
        try {
            const response: any = await API.get(`getOrderByUserID/?&userId=${user.id}&time=${new Date().toString()}`);
            return response;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const {
        isLoading,
        data = [],
        refetch,
    } = useQuery({
        queryKey: ["order-data", user],
        queryFn: getOrderByUser,
        enabled: !!user
    });

    const handleRefresh = async () => {
        try {
            await refetch();
        } catch (err) {
            console.log('Error during refetch:', err);
        }
    };

    return (

        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg  text-center">
            <h2 className="text-xl font-semibold mb-4">Meine Hörbücher</h2>
            <p className="mb-6 text-sm">
                Unter der E-Mail-Adresse, mit der Sie sich in der App angemeldet haben, sind noch keine Hörbücher bestellt worden.
            </p>
            <div className='text-black'>
                <PageContent slug="es-sind-hier-noch-keine-hoerbuecher-vorhanden" />
            </div>
            <button onClick={handleRefresh} 
            className={`
           ${isLoading ? "flie-loader py-4" : ""} bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded mt-10`}>
                Hörbücher aktualisieren
            </button>
        </div>
    );
};

export default OrderList;