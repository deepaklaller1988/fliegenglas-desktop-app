"use client";
import Menu from "@lib/SidebarData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TbBellRinging2Filled, TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { TiUserDelete } from "react-icons/ti";

export default function Sidebar() {
    const pathname = usePathname();
    const [isOn, setIsOn] = useState(false);
    const [isMoreOptions, setIsMoreOptions] = useState<boolean>(false);

    const handleClick = () => {
        setIsOn(!isOn);
    }

    const getLinkClasses = (path: string) => (
        `flex items-center gap-3 hover:text-white ${pathname === path ? 'text-white font-bold' : ''}`
    );

    return (
        <div className={`min-w-[300px] max-w-[300px] bg-white/10 flex flex-col transition-[1s] menuTrans ${isOn ? "collapseMenu" : ""}`}>
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
                        <Link href="" className={getLinkClasses(item.path)} onClick={()=> setIsMoreOptions(!isMoreOptions)}><div>{item.item}</div><item.icon className='w-5 h-5' /> {item.item}</Link>
                    )}
                
                </div>
            ))}
                {/* <Link href="/home" className={getLinkClasses("/home")}><div>Startseite</div><GoHome className='w-5 h-5' /> Startseite</Link>
                <Link href="/search" className={getLinkClasses("/search")}><div>Suche</div><IoSearch className='w-5 h-5' /> Suche</Link>
                <Link href="/order-list" className={getLinkClasses("/order-list")}><div>Meine Hörbücher</div><BiBarChart className='w-5 h-5' /> Meine Hörbücher</Link> */}
                {/* <Link href="/more" className={getLinkClasses("/more")}><div>Mehr</div><PiDotsThreeOutlineDuotone className='w-5 h-5' /> Mehr</Link> */}
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
                                {/* <Link href="/settings" className={getLinkClasses("/settings")}><div>Einstellungen</div><IoSettingsOutline className='w-5 h-5' /> Einstellungen</Link>
                                <Link href="/downloads" className={getLinkClasses("/downloads")}><div>Downloads</div><PiDownloadSimpleBold className='w-5 h-5' /> Downloads</Link>
                                <Link href="/email" className={getLinkClasses("/email")}><div>E-Mail-Adresse</div><MdOutlineMail className='w-5 h-5' /> E-Mail-Adresse</Link>
                                <Link href="/username" className={getLinkClasses("/username")}><div>Dein Name</div><FaRegUser className='w-5 h-5' /> Dein Name</Link>
                                <Link href="/categories" className={getLinkClasses("/categories")}><div>Lieblingskategorien</div><BiGridAlt className='w-5 h-5' /> Lieblingskategorien</Link>
                                <Link href="/notifications" className={getLinkClasses("/notifications")}><div>Benachrichtigungen</div><TbBellRinging2Filled className='w-5 h-5' /> Benachrichtigungen</Link>
                                <Link href="/logout" className={getLinkClasses("/logout")}><div>Aus der App ausloggen</div><IoLogOut className='w-5 h-5' /> Aus der App ausloggen </Link> */}
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
    )
};
