import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useRole from "@hooks/useRole";
export default function Downloads() {

    const router = useRouter();
    const [roleLoading, roleData] = useRole();

  if(roleLoading && !roleData.id){
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
                            <h2 className="text-bold text-lg text-white block text-center mb-4">Meine Downloads</h2>
                            <p className="text-white mt-2">Derzeit hast Du keine Hörbücher lokal in der Fliegenglas App gespeichert.</p>
                        <p className="text-white mt-6">Um Hörbücher lokal herunterzuladen, besuche bitte den Audioplayer und klicke auf das Menü oben rechts über dem Hörbuch Cover.</p>
                        <img src="/assets/images/download-explanation.jpg" alt="downloads" className="w-[250px] block max-w-full m-auto my-6"/>
                        <p className="text-white">Wir empfehlen Downloads für den Fall, dass Du ohne Internetverbindung Hörbücher hören möchtest. Bitte beachte dabei, dass Downloads Speicherplatz auf Deinem Gerät benötigen.</p>
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>

    </>)
}