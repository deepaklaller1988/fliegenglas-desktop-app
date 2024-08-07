import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
export default function UpdateProfile() {
    return (<>
        <div id="login-page" className="px-4 w-full">
            <div className="loginInner">
                <div className="header">
                    <Link href="/album">
                        <div className="py-4 pr-4 text-white">
                            <HiArrowLeft className="text-lg" />
                        </div>
                    </Link>
                </div>
                <div className="w-full">
                    <div className="form-view">
                        <div className="w-full">
                            <h2 className="text-bold text-xl text-white block text-center mb-4">Deine E-Mail-Adresse</h2>
                            <b className="text-bold text-[18px] text-white block text-center mb-12 pt-4">sandeep@contriverz.com</b>
                            <div className="w-full">
                                <b className="text-white mt-2 font-bold block">Hast Du eine neue E-Mail Adresse? Gib sie hier ein:</b>
                                <input type="email" className="my-3 bg-white text-black rounded-md p-2 w-full" />
                                <input type="submit" value="Speichern" className="yellow button-google w-full border border-white rounded-lg p-2 text-white" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </>)
}