"use client";

import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";

const LayoutPath = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  const route = path.split("/");
  const router = useRouter();

  const isDashboard = () => {
    return !route.includes("auth") ? !route.includes("maintenance") ? true : false : false;
  }


  return (
    <div className="flex w-full">
      {
      isDashboard() ? (
        <>
       { <Sidebar />}
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
