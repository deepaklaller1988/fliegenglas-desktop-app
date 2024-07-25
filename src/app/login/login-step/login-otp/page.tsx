import "./login-otp.css";
import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
export default function Loginstep() {
    return (<>
        <div id="login-page" className="px-4">
            <div className="loginInner">
                <div className="header">
                    <a href="/startpage">
                        <div className="py-4 pr-4 text-white">
                            <HiArrowLeft className="text-lg" />
                        </div>
                    </a>
                    <span className="text-white">E-Mail: sandeep@contriverz.com</span>
                </div>
                <div className="w-full">
                    <div className="form-view">
                        <div className="log-otp">
                            <label>Anmelde-Link versendet!</label>
                            <p>Ein Anmelde-Link wurde an Deine E-Mail-Adresse versendet. Bitte prüfe Dein E-Mail-Postfach und klicke auf den Anmelde-Link. Falls Du keine E-Mail bekommst, prüfe bitte Deinen Spam-Ordner oder schreibe uns an fliegen@fliegenglas.com.</p>
                        </div>
                        <div className="log-otp">
                            <p>Sollte der Anmelde-Link in Deiner E-Mail nicht funktionieren, melde Dich bitte mit dem mitgesendeten Einmal-Passwort an:</p>
                            <input className="rounded-sm p-2 w-full" type="number" placeholder="Einmal-Passwort" />
                            <input type="submit" value="Weiter" className="yellow button"></input>
                            <Link href="../../album" className="text-black">LoginOTP</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>)
}