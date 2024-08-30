"use client";

import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAll } from "utils/audioPlayerIndexedDB";
import useOnlineStatus from "@hooks/UseOnlineStatus";

const LayoutPath = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  const route = path.split("/");

//   const { isOnline }:any = useOnlineStatus();

//   const router = useRouter();

// console.log(isOnline,"=")
//   useEffect(() => {
//     const handleRedirect = async () => {
//       try {
//         if (!isOnline) {
//           const data:any = await getAll();
//           if (data && data.length > 0) {
//             router.push("/settings/downloads");
//           } else {
//             router.push("/internetStatus");
//           }
//         } 
//       } catch (err) {
//        console.log("object")
//       }
//     };
//     console.log(isOnline,"isOnline")

//     handleRedirect();
//   }, [isOnline, router]);


  const isDashboard = () => {
    return !route.includes("auth") && !route.includes("internetStatus")
      ? !route.includes("maintenance")
        ? true
        : false
      : false;
  };

  return (
    <div className="flex w-full">
      {isDashboard() ? (
        <>
          <Sidebar />
          {children}
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default LayoutPath;
