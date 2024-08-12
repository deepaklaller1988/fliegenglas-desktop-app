"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const LayoutPath = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  const route = path.split("/");

  const isDashboard = () => {
    return !route.includes("auth") ? !route.includes("maintenance") ? true : false : false;
  }


  return (
    <div className="flex w-full">
      {
      isDashboard() ? (
        <>
        <Sidebar />
        {children}
        </>
      ) : (
        <>
        {children}
        </>
      )
    }
    </div>
  );
};

export default LayoutPath;
