/* eslint-disable @next/next/no-img-element */
import React from 'react'
import "./album-detail.css";
import Link from "next/link";
import { MdKeyboardBackspace } from "react-icons/md";
export default function AlbumDetail() {
    return (
        <>
        <div className='loaderSet w-full fixed top-0 left-0 h-full z-50 flex items-center justify-center hidden'>
        <img className="block w-full max-w-[150px]" src="../assets/images/loader-animated-gif.gif" alt="Album" />
        </div>
            <div className='w-full fixed top-0 left-0 h-full right-0 overflow-auto bgChangeAlbum bg-cover bg-center' style={{ backgroundImage: 'url("../assets/images/slides/home-top-wittgenstein-pu.jpg")' }}>
                <div className='w-full p-3'>
                    <Link href="../album" className='flex items-center gap-1 py-2 pb-3 mb-2 text-white'><MdKeyboardBackspace className='w-6 h-6' /> Zurück</Link>
                    <div className='w-full'>
                        <img className="block w-full shadow-xl" src="../assets/images/slides/home-top-wittgenstein-pu.jpg" alt="Album" />
                    </div>
                    <div className='w-full bg-white/80 rounded-md p-3 mt-3'>
                        <Link href="" className="w-full text-center bg-[#182e49] rounded-md text-white p-3 text-[18px] inline-block m-auto">Hörprobe hören</Link>
                    </div>
                    <div className='w-full bg-white/80 rounded-md p-3 mt-3'>
                        <Link href="" className="w-full text-center bg-[#ff9900] rounded-md text-white p-3 text-[18px] inline-block m-auto">1 Woche kostenlos hören</Link>
                        <div className='w-full border-half-both relative my-2'>
                            <p className='block text-center'>oder</p>
                        </div>
                        <Link href="" className="w-full text-center bg-[#6c7279] rounded-md text-white p-3 text-[18px] inline-block m-auto">Hörbuch ohne Abo kaufen</Link>
                        <div className='w-full flex items-center justify-between gap-1 pt-3'>
                            <p className='text-[#232a2c] text-[16px]'>Preis inkl. MWST (7,7%) </p><b className='text-[#232a2c] text-[16px]'>€ 19,99</b>
                        </div>
                    </div>
                    <div className='w-full bg-white/80 rounded-md p-3 mt-3 flex flex-col gap-3'>
                        <div className='w-full flex items-center gap-1'>
                            <b className='text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]'>Titel:</b><p className='text-[#232a2c] text-[16px]'>Aristoteles: Metaphysik</p>
                        </div>
                        <div className='w-full flex items-center gap-1'>
                            <b className='text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]'>Bewertung:</b><p className='text-[#232a2c] text-[16px] flex gap-1 items-center'><img className='w-[20px]' src="../assets/images/icon-like-new-filled.svg" alt="favorite" />20 gefällt das.</p>
                        </div>
                        <div className='w-full flex items-center gap-1'>
                            <b className='text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]'>Dauer:</b><p className='text-[#232a2c] text-[16px]'>13 Stunden 9 Minuten</p>
                        </div>
                        <div className='w-full flex items-center gap-1'>
                            <b className='text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]'>Copyright:</b><p className='text-[#232a2c] text-[16px]'>Fliegenglas Verlag GmbH</p>
                        </div>
                    </div>
                    <div className='w-full bg-white/80 rounded-md p-3 mt-3 flex gap-3'>
                        <span className='min-w-[85px] max-w-[85px]'>
                            <img className="block w-full" src="../assets/images/author/autorwittgenstein.jpg" alt="Author" />
                        </span>
                        <span className='relative w-full'>
                            <b className='text-[#232a2c] text-[16px]'>Autor*ln:</b>
                            <p className='text-[#232a2c] text-[16px] opacity-60 leading-none'>Ludwig Wittgenstein</p>
                            <Link className='absolute bottom-0 right-0 bg-[#6c7279] text-white w-[128px] p-[5px] px-2 rounded-md text-sm text-center' href="">Alle Hörbücher</Link>
                        </span>
                    </div>
                    <div className='w-full bg-white/80 rounded-md p-3 mt-3 flex gap-3'>
                        <span className='min-w-[85px] max-w-[85px]'>
                            <img className="block w-full" src="../assets/images/author/artistjuergengergov.jpg" alt="Author" />
                        </span>
                        <span className='relative w-full'>
                            <b className='text-[#232a2c] text-[16px]'>Sprecher*ln:</b>
                            <p className='text-[#232a2c] text-[16px] opacity-60 leading-none'>Jürgen Gergov</p>
                            <Link className='absolute bottom-0 right-0 bg-[#6c7279] text-white w-[128px] p-[5px] px-2 rounded-md text-sm text-center' href="">Alle Hörbücher</Link>
                        </span>
                    </div>
                    <div className='w-full bg-white/80 rounded-md p-3 py-8 mt-3 flex gap-4 flex-col'>
                    <h2 className='text-center text-[#232a2c]'>Inhalt des Hörbuches</h2>
                        <p className='text-[#232a2c] leading-6'>Die «Philosophischen Untersuchungen» von Ludwig Wittgensteins sind das wahrscheinlich einflussreichste und bedeutendste philosophische Werk der letzten 100 Jahre und jetzt erstmals in der Fliegenglas App als Hörbuch veröffentlicht!</p>
                        <p className='text-[#232a2c] leading-6'>Wittgensteins zentrale These, die er an unzähligen Beispielen plausibilisiert: Die Bedeutung der Sprache und der Worte besteht fast nie in einer Beschreibung oder Bezeichnung von Dingen, sondern drückt bestimmte Zwecke aus und macht nur in bestimmten Kontexten, «Sprachspielen» Sinn.</p>
                        <p className='text-[#232a2c] leading-6'>Diese Zwecke und Sprachspiele insgesamt sind nur innerhalb einer bestimmten «Lebensform» wie der menschlichen Lebensform, verständlich und sinnvoll.</p>
                        <p className='text-[#232a2c] leading-6'>«Wenn der Löwe sprechen könnte, wir könnten ihn nicht verstehen.»</p>
                        <p className='text-[#232a2c] leading-6'>Ein unerhörter Gedanke!</p>
                        <p className='text-[#232a2c] leading-6'>Denn wir sprechen in unzähligen Kontexten so, als ob wir die Wirklichkeit beschreiben, als ob die Sprache ein BIld der Wirklichkeit wiedergibt; selbst und vor allem beim Philosophieren. –</p>
                        <p className='text-[#232a2c] leading-6'>Dabei beschreiben wir meist nichts, sondern folgen bestimmten Regeln oder Interessen, die uns dazu verleiten, einen «Nimbus» um unsere Worte, ein sinnloses Gewicht dem Gesagten zu verleihen, der in anderen, beispielsweise alltäglichen Kontexten überhaupt keine Bedeutung haben.</p>
                        <p className='text-[#232a2c] leading-6'>«43. Man kann für eine große Klasse von Fällen der Benützung des Wortes "Bedeutung" - wenn auch nicht für alle Fälle seiner Benützung - dieses Wort so erklären: Die Bedeutung eines Wortes ist sein Gebrauch in der Sprache. Und die Bedeutung eines Namens erklärt man manchmal dadurch, dass man auf seinen Träger zeigt.»</p>
                        <p className='text-[#232a2c] leading-6'>Betroffen sind Worte wie «Seele», «Wissen», «Wahrheit», «Gefühle» und unzählige weitere.</p>
                        <p className='text-[#232a2c] leading-6'>Wer sich mit diesem Werk eingehend beschäftigt, sieht sein Leben nie mehr so wie davor.</p>
                        <p className='text-[#232a2c] leading-6'>&nbsp;</p>
                        <p className='text-[#232a2c] leading-6'>Ludwig Wittgenstein: Philosophische Untersuchungen</p>
                        <p className='text-[#232a2c] leading-6'>Auf der Grundlage der kritisch-genetischen Edition neu herausgegeben von Joachim Schulte.</p>
                        <p className='text-[#232a2c] leading-6'>Mit einem Nachwort des Herausgebers</p>
                        <p className='text-[#232a2c] leading-6'>© Suhrkamp Verlag Frankfurt am Main 2003 – Alle Rechte bei und vorbehalten durch Suhrkamp Verlag Berlin</p>
                    </div>
                    <div className="w-full text-center mb-2">
            <Link href="" className="bg-white/0 rounded-md text-white p-2 px-3 text-[14px] inline-block m-auto underline">Datenschutzerklärung </Link>
        </div>
                </div>
            </div>
        </>
    )
}
