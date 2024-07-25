import "./login-step.css";
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
                </div>
                <div className="container">
                    <div className="form">
                        <label>Deine E-Mail-Addresse:</label>
                        <div className="form-view">
                            <input className="bg-white rounded-sm p-3" placeholder="E-Mail" type="email" />
                            <p>An Deine E-Mail Adresse senden wir einen Anmelde-Link, um Dich in der App anzumelden. Prüfe bitte, ob Deine E-Mail korrekt eingegeben wurde.</p>
                        </div>
                    </div>
                    <div id="login" className="small-text">
                        <div className="form-view">
                            <div className="privacy">
                                <input type="checkbox" />
                                <span className="text-white">Ich erkläre mich mit den <a href="">AGB</a> und der <a href="">Datenschutzerklärung</a> von Fliegenglas einverstanden.</span>
                            </div>
                        </div>
                        <input type="submit" value="Anmelde-Link senden" className="button yellow flie-loader" />
                        <Link href="login-step/login-otp" className="text-white">Login</Link>
                    </div>
                </div>
            </div>
        </div>
        
    </>)
}