"use client";
import Menu from "@lib/SidebarData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {  TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";

export default function Sidebar() {
    const pathname = usePathname();
    const [isOn, setIsOn] = useState(false);
    const [isMoreOptions, setIsMoreOptions] = useState<boolean>(true);

    const handleClick = () => {
        setIsOn(!isOn);
    }

    const getLinkClasses = (path: string) => (

        `flex items-center gap-3 hover:text-[#ff9900] transition ${pathname === path ? 'text-[#ff9900] activeSidebarLink ' : ''}`
    );

    return (
        <div className={`min-w-[300px] max-w-[300px] bg-white/10 flex flex-col transition-[1s] menuTrans ${isOn ? "collapseMenu" : ""}`}>
            <div className="sticky top-0 z-10">
            <div className='w-full sticky top-0 z-10 bg-[#242e39] openClose'>
                <section className='text-white/60 flex flex-col gap-4 p-4'>
                    <span onClick={handleClick} className='bg-black/20 rounded-md p-3 cursor-pointer flex items-center justify-between gap-3 text-white'>
                        Collapse {isOn ? (<TbLayoutSidebarRightCollapseFilled className='w-5 h-5' />) : (<TbLayoutSidebarLeftCollapseFilled className='w-5 h-5' />)}
                    </span>
                </section>
            </div>
            <section className='text-white/60 flex flex-col gap-4 p-4 pt-0 h-full collapseMenuMain'>
            {Menu.list && Menu.list.map((item: any) => (
                <div key={item.id}>
                    {item.type === 'link' ? (
                        <>
                        <Link href={item?.path} className={getLinkClasses(item.path)}><div>{item.item}</div><item.icon className='w-5 h-5' /> {item.item}</Link>
                        </>
                    ) : (
                        <Link href="" className={getLinkClasses(item.path)} onClick={()=> setIsMoreOptions(isMoreOptions)}><div>{item.item}</div><item.icon className='w-5 h-5' /> {item.item}</Link>
                    )}
                
                </div>
            ))}
               
                {
                    isMoreOptions && (
                     <div className='w-full'>
                        <section className='flex gap-3 flex-col'>
                            <section className='flex flex-col gap-4 bg-black/20 rounded-md p-4'>
                                <h2 className='text-lg text-white'>Einstellungen</h2>
                                {Menu.sublist && Menu.sublist.map((item: any) => (
                                    <div key={item.id}>
                                        {item.type === 'link' ? (
                                            <>
                                            <Link href={item?.path} className={getLinkClasses(item.path)}><div>{item.item}</div><item.icon className='w-5 h-5' /> {item.item}</Link>
                                            </>
                                        ) : (
                                            <Link href="" className={getLinkClasses(item.path)}><div>{item.item}</div><item.icon className='w-5 h-5' /> {item.item}</Link>
                                        )}
                                    
                                    </div>
                                ))}
                                
                            </section>
                            <section className='flex flex-col gap-4 bg-black/20 rounded-md p-4'>
                                <h2 className='text-lg text-white'>Informationen</h2>
                                {Menu.subInfoList && Menu.subInfoList.map((item: any) => (
                                    <div key={item.id}>
                                        {item.type === 'link' ? (
                                            <>
                                            <Link href={item?.path} className={getLinkClasses(item.path)}><div>{item.item}</div><item.icon className='w-5 h-5' /> {item.item}</Link>
                                            </>
                                        ) : (
                                            <Link href="" className={getLinkClasses(item.path)}><div>{item.item}</div><item.icon className='w-5 h-5' /> {item.item}</Link>
                                        )}
                                    
                                    </div>
                                ))}
                            </section>
                        </section>
                    </div>
                    )
                }
                
            </section>
            </div>
        </div>
    )
};








