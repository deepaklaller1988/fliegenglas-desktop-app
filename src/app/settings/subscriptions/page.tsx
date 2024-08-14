import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import useRole from "@hooks/useRole";
import { useRouter } from "next/navigation";
export default function Subscriptions() {

    const router = useRouter();
    const [roleLoading, roleData] = useRole();

    if (roleLoading && !roleData.id) {
        router.push('/auth/login');
        return null;
    }
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
                            <h2 className="text-bold text-lg text-white block text-center mb-4">Deine Abos bei Fliegenglas</h2>
                            <p className="text-white mt-2">Abos geben Dir günstigen Zugang zu den Hauptreihen der Fliegenglas-Hörbücher. Abos kannst Du über die Fliegenglas Website oder über die App eine Woche kostenlos testen und jederzeit hier in der App auch wieder künden.</p>
                            <p className="text-white mt-6">Es wurde kein Abo für Deinen Benutzernamen gefunden.</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </>)
}