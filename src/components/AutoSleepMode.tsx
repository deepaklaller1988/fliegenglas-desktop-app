import React, { useState, useEffect } from "react";

export default function AutoSleepMode() {
  const [selectedButton, setSelectedButton] = useState("0");

  useEffect(() => {
    const storedSleepTime = sessionStorage.getItem("autosleeptime");
    if (storedSleepTime) {
      setSelectedButton(storedSleepTime);
    }
  }, []);

  const autoSleepTime = (buttonId: any) => {
    setSelectedButton(buttonId);

    {
      buttonId === "0"
        ? sessionStorage.removeItem("autosleeptime")
        : sessionStorage.setItem("autosleeptime", buttonId);
    }
  };

  return (
    <div className="w-full bg-white/80 rounded-md p-3 mt-3 flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-center w-full text-black">Autosleep Modus</h1>
        <button
          className={`${
            selectedButton === "0" ? "bg-[#182e49]" : "bg-[#6c7279]"
          } p-5 py-1 text-white text-sm block rounded-md absolute right-14`}
          onClick={() => autoSleepTime("0")}
        >
          Off
        </button>
      </div>
      <p className="text-center text-black text-[16px] font-extrathin">
        Wiedergabe des Hörbuchs stoppen nach:
      </p>
      <div className="flex flex-row gap-5">
        <button
          className={`${
            selectedButton === "180000"
              ? "bg-[#182e49] hover:bg-[#182e49]"
              : "bg-[#6c7279]"
          } w-full hover:bg-[#555a61] text-white p-2 rounded-md text-sm text-center duration-300`}
          onClick={() => autoSleepTime("180000")}
        >
          15 min
        </button>
        <button
          className={`${
            selectedButton === "1800000"
              ? "bg-[#182e49] hover:bg-[#182e49]"
              : "bg-[#6c7279]"
          } w-full hover:bg-[#555a61] text-white p-2 rounded-md text-sm text-center duration-300`}
          onClick={() => autoSleepTime("1800000")}
        >
          30 min
        </button>
        <button
          className={`${
            selectedButton === "-1"
              ? "bg-[#182e49] hover:bg-[#182e49]"
              : "bg-[#6c7279]"
          } w-full hover:bg-[#555a61] text-white p-2 rounded-md text-sm text-center duration-300`}
          onClick={() => autoSleepTime("-1")}
        >
          Ende Kapitel
        </button>
      </div>
    </div>
  );
}
