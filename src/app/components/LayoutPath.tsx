"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";

const LayoutPath = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  // const noSidebarPaths = ["/", "/login", "/login/login-step", "/login/login-step/login-otp", "/login/timeout"];
  const isLoginPath = pathname.startsWith("/login");
  
  return (
    <div className="flex">
      {/* !noSidebarPaths.includes(pathname) && <Sidebar /> */}
      { !isLoginPath && <Sidebar />}
      {children}
    </div>
  );
};

export default LayoutPath;
