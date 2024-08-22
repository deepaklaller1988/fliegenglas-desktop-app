import React from "react";

export default function AutoSleepMode() {
  return (
    <div className="w-full bg-white/80 rounded-md p-3 mt-3 flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-center w-full text-black">Autosleep Modus</h1>
        <button className="p-5 py-1 text-sm bg-[#182f4a] rounded-md absolute right-14">
          Off
        </button>
      </div>
      <p className="text-center text-black text-[16px] font-extrathin">
        Wiedergabe des Hörbuchs stoppen nach:
      </p>
      <div className="flex flex-row gap-5">
        <button className="w-full bg-[#6c7279] hover:bg-[#555a61] text-white p-2 rounded-md text-sm text-center duration-300">
          15 min
        </button>
        <button className="w-full bg-[#6c7279] hover:bg-[#555a61] text-white p-2 rounded-md text-sm text-center duration-300">
          30 min
        </button>
        <button className="w-full bg-[#6c7279] hover:bg-[#555a61] text-white p-2 rounded-md text-sm text-center duration-300">
          Ende Kapitel
        </button>
      </div>
    </div>
  );
}
