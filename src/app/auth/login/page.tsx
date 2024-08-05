"use client"
import API from "@lib/API";
import { UserAuth } from "context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./login.css";

export default function Login() {
   const router=useRouter()
   const { googleSignIn, facebookSignIn, appleSignIn } = UserAuth();

   const socialSignIn = async (e: any, platform: string) => {
      e.preventDefault();
      try {
         let userData;
         if (platform === "google") {
            userData = await googleSignIn();        
         } else if (platform === "apple") {
            userData = await appleSignIn();
         }

         if (userData && userData.email) {
            const mainFormData = {
               firstname: userData?.displayName,
               email: userData?.email,
               mobilenumber: userData?.phoneNumber,
               platform: platform,
            };
            const url = "api/v1/loginRegister";
            const mainResponse = await API.post("social_login/", mainFormData);
            if (mainResponse.success === true) {
               const searchText = localStorage.getItem("search");
               if (searchText == "" || searchText == null) {
                  router.push("/home");

               } else {
                  router.push("/review")
               }
               // toasterSuccess(
               //    translations?.common?.loginSuccessMsg,
               //    1000, mainResponse?.result?.id
               // );
            } else {
               // toasterError(mainResponse?.error, 3000, "id");
               // setIsSubmitting(false);
            }
         } else {
            console.error("User or email is null");
         }
      } catch (error) {
         console.error("Error during social sign-in:", error);
         // setIsSubmitting(false);
      }
   };

   return (<>
      <div className="splash-intro">
         <div className="spashHub">
            <span className="logo-splash">
               <img src="/assets/logo_fliegenglas.svg" alt="logo" />
               <h6>WIR MACHEN<br></br> WISSEN HÖRBAR.</h6>
            </span>
            <div className="button-splash new-home-buttons">
               <p>Bitte verwende bei Fliegenglas immer<br></br> die gleiche E-Mail-Adresse.</p>
               <Link href="" className="button log-set" onClick={(e) => socialSignIn(e, "apple")}>
                  <img src="/assets/apple-logo.svg" className="md hydrated" />
                  Mit Apple anmelden
               </Link>
               <Link href="" className="button google-set" onClick={(e) => socialSignIn(e, "google")}>
                  <img src="/assets/google.svg" className="md hydrated" />
                  Mit Google anmelden
               </Link>
               <Link className="yellow button-google" href="/auth/login-step" >Mit Deiner E-Mail anmelden</Link>
            </div>
         </div>
      </div>
   </>)
}