"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Notification() {
  const router = useRouter();

  return <div className="w-full text-center mt-5">Notifications</div>;
}
