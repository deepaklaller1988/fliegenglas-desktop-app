"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AiFillExclamationCircle } from "react-icons/ai";
import { BiBarChart, BiGridAlt } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { GiFly } from "react-icons/gi";
import { GoHome } from "react-icons/go";
import { IoChatboxEllipsesOutline, IoLogOut, IoSearch, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { PiDotsThreeOutlineDuotone, PiDownloadSimpleBold } from "react-icons/pi";
import { TbBellRinging2Filled, TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { TiUserDelete } from "react-icons/ti";

export default function Sidebar() {
    const [isOn, setIsOn] = useState(false);
    const pathname = usePathname();

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
                <Link href="/album" className={getLinkClasses("/album")}><div>Startseite</div><GoHome className='w-5 h-5' /> Startseite</Link>
                <Link href="/search" className={getLinkClasses("/search")}><div>Suche</div><IoSearch className='w-5 h-5' /> Suche</Link>
                <Link href="/my-audiobooks" className={getLinkClasses("/my-audiobooks")}><div>Meine Hörbücher</div><BiBarChart className='w-5 h-5' /> Meine Hörbücher</Link>
                <Link href="/more" className={getLinkClasses("/more")}><div>Mehr</div><PiDotsThreeOutlineDuotone className='w-5 h-5' /> Mehr</Link>
                <div className='w-full'>
                    <section className='flex gap-3 flex-col'>
                        <section className='flex flex-col gap-4 bg-black/20 rounded-md p-4'>
                            <h2 className='text-lg text-white'>Einstellungen</h2>
                            <Link href="/settings" className={getLinkClasses("/settings")}><div>Einstellungen</div><IoSettingsOutline className='w-5 h-5' /> Einstellungen</Link>
                            <Link href="/downloads" className={getLinkClasses("/downloads")}><div>Downloads</div><PiDownloadSimpleBold className='w-5 h-5' /> Downloads</Link>
                            <Link href="/email" className={getLinkClasses("/email")}><div>E-Mail-Adresse</div><MdOutlineMail className='w-5 h-5' /> E-Mail-Adresse</Link>
                            <Link href="/username" className={getLinkClasses("/username")}><div>Dein Name</div><FaRegUser className='w-5 h-5' /> Dein Name</Link>
                            <Link href="/categories" className={getLinkClasses("/categories")}><div>Lieblingskategorien</div><BiGridAlt className='w-5 h-5' /> Lieblingskategorien</Link>
                            <Link href="/notifications" className={getLinkClasses("/notifications")}><div>Benachrichtigungen</div><TbBellRinging2Filled className='w-5 h-5' /> Benachrichtigungen</Link>
                            <Link href="/logout" className={getLinkClasses("/logout")}><div>Aus der App ausloggen</div><IoLogOut className='w-5 h-5' /> Aus der App ausloggen </Link>
                        </section>
                        <section className='flex flex-col gap-4 bg-black/20 rounded-md p-4'>
                            <h2 className='text-lg text-white'>Einstellungen</h2>
                            <Link href="/about" className={getLinkClasses("/about")}><div>Über uns</div><GiFly className='w-5 h-5' /> Über uns </Link>
                            <Link href="/faq" className={getLinkClasses("/faq")}><div>Häufig gestellte Fragen (FAQ)</div><AiFillExclamationCircle className='w-5 h-5' /> Häufig gestellte Fragen (FAQ)</Link>
                            <Link href="/feedback" className={getLinkClasses("/feedback")}><div>Dein Feedback</div><IoChatboxEllipsesOutline className='w-5 h-5' /> Dein Feedback</Link>
                            <Link href="/impressum" className={getLinkClasses("/impressum")}><div>Impressum</div><AiFillExclamationCircle className='w-5 h-5' /> Impressum</Link>
                            <Link href="/terms" className={getLinkClasses("/terms")}><div>Nutzungsbedingungen (AGB)</div><AiFillExclamationCircle className='w-5 h-5' /> Nutzungsbedingungen (AGB)</Link>
                            <Link href="/privacy" className={getLinkClasses("/privacy")}><div>Datenschutzerklärung</div><AiFillExclamationCircle className='w-5 h-5' /> Datenschutzerklärung</Link>
                            <Link href="/revocation" className={getLinkClasses("/revocation")}><div>Widerrufsrecht</div><AiFillExclamationCircle className='w-5 h-5' /> Widerrufsrecht</Link>
                            <Link href="/delete-account" className={getLinkClasses("/delete-account")}><div>Kundenkonto löschen</div><TiUserDelete className='w-5 h-5' /> Kundenkonto löschen</Link>
                        </section>
                    </section>
                </div>
            </section>
        </div>
    )
};
