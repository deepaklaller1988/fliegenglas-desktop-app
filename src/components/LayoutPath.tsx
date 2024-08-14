"use client";

import Sidebar from "./Sidebar";
import useRole from "@hooks/useRole";
import { usePathname, useRouter } from "next/navigation";
import FlieLoader from "./core/FlieLoader";

const LayoutPath = ({ children }: { children: React.ReactNode }) => {
  const [roleLoading, roleData] = useRole();
  const path = usePathname();
  const route = path.split("/");
  const router = useRouter();

  const isDashboard = () => {
    return !route.includes("auth") ? !route.includes("maintenance") ? true : false : false;
  }

  if (roleLoading) {
    return (
        <FlieLoader />
    );
  }

  if(roleLoading && !roleData.id){
    router.push('/auth/login'); 
    return null;
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
