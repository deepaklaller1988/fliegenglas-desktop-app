import Link from "next/link";
import "./login.css";
export default function Login() {
   return (<>
      <div className="splash-intro">
         <div className="spashHub">
            <span className="logo-splash">
               <img src="/assets/logo_fliegenglas.svg" alt="logo" />
               <h6>WIR MACHEN<br></br> WISSEN HÖRBAR.</h6>
            </span>
            <div className="button-splash new-home-buttons">
               <p>Bitte verwende bei Fliegenglas immer<br></br> die gleiche E-Mail-Adresse.</p>
               <Link href="" className="button log-set">
                  <img src="assets/apple-logo.svg" className="md hydrated" />
                  Mit Apple anmelden
               </Link>
               <Link href="" className="button google-set">
                  <img src="assets/google.svg" className="md hydrated" />
                  Mit Google anmelden
               </Link>
               <Link className="yellow button-google" href="/login/login-step">Mit Deiner E-Mail anmelden</Link>
            </div>
         </div>
      </div>
   </>)
}