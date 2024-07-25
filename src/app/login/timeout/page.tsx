import Link from "next/link";
import "./timeout.css";
export default function Login() {
    return (<>
    <div className="time_out">
        <div className="wifi-section">
        <span><img src="/assets/images/wifi.svg" alt="wifi-disabled"/></span>
        <p>Du bist offline oder die Netzwerkverbindung ist schwach.</p>
        <button className="buy-btn"> Jetzt neu verbinden </button>
        </div>
    </div>
    </>)
    }