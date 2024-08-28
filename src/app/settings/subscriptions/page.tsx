"use client";

import { useRouter } from "next/navigation";
import HeaderLink from "@components/HiArrowleft";
import API from "@lib/API";
import { useUser } from "context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ErrorPopup from "@components/ErrorPopUp";

export default function Subscriptions() {
  const router = useRouter();
  const { user }: any = useUser();
  const [showModal, setShowModal] = useState(false);

  const getSubscriptionData = async () => {
    if (!user) {
      return [];
    }
    try {
      const response = await API.get(
        // `getSubscription?&user_id=${user.id}&time=${new Date().toString()}`
        `getSubscription?&user_id=${50451}&time=${new Date().toString()}`
      );
      //   await saveData("fav-categories", response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const {
    isLoading,
    data = [],
    error,
  } = useQuery({
    queryKey: ["subscription-data", user],
    queryFn: getSubscriptionData,
  });

  return (
    <>
      <div id="login-page" className="px-4 w-full">
        <div className="loginInner">
          <HeaderLink
            className="py-4 pr-4 text-white"
            onClick={() => router.push("/home")}
          />
          <div className="w-full">
            <div className="form-view">
              <div className="w-full">
                <h2 className="text-bold text-lg text-white block text-center mb-4">
                  Deine Abos bei Fliegenglas
                </h2>
                <p className="text-white mt-2">
                  Abos geben Dir günstigen Zugang zu den Hauptreihen der
                  Fliegenglas-Hörbücher. Abos kannst Du über die Fliegenglas
                  Website oder über die App eine Woche kostenlos testen und
                  jederzeit hier in der App auch wieder künden.
                </p>
                <p className="text-white mt-6">
                  Es wurde kein Abo für Deinen Benutzernamen gefunden.
                </p>
              </div>
            </div>
          </div>
        </div>

        {data &&
          data.map((item: any) => (
            <div className="max-w-md mx-auto bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg">
              <div className="p-4 flex">
                <img
                  src={item.image}
                  alt="Subscription"
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">{item?.name}</h2>
                  <p className="mt-2 text-sm">
                    {item?.subscription_period}: {item?.amount}€
                  </p>
                  <p className="text-sm">
                    Wird am{" "}
                    <span className="font-semibold">
                      {item?.subscription_till}
                    </span>{" "}
                    verlängert.
                  </p>
                  <p className="text-sm mt-2">Zahlungsart: {item?.method}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-center text-sm font-semibold rounded-b-lg"
              >
                Abo Kündigen
              </button>
            </div>
          ))}
        {showModal && (
          <ErrorPopup
            message={
              "Um dieses Abo zu künden, gehen Sie bitte in die Einstellungs-App Ihres Mobile-Telefons, klicken Sie auf Ihren Namen, dann unter Abonnemente und künden Sie das Fliegenglas Abo."
            }
            onClose={() => setShowModal(false)}
            type={"subscription"}
          />
        )}
      </div>
    </>
  );
}
