"use client";
import API from "@lib/API";
import { UserAuth } from "context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./login.css";
import { useUser } from "../../../context/UserContext";
import { setCookie } from "cookies-next";
import { getData, saveData } from "utils/indexDB";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useTitle from "@hooks/useTitle";

export default function Login() {
  useTitle("Login")
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { googleSignIn, appleSignIn } = UserAuth();
  const { setUser }: any = useUser();

  const getChannelData = async () => {
    try {
      const cachedData = await getData("channelData");
      if (cachedData) {
        return cachedData;
      }
      const response: any = await API.get(
        `getChannels?&user_id=${""}?&time=${new Date().toString()}`
      );
      await saveData("channelData", response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchData = async () => {
    try {
      const cachedData = await getData("tags");
      if (cachedData) {
        return cachedData;
      }
      const response: any = await API.get(
        `getTagsearch?&time=${new Date().toString()}`
      );
      await saveData("tags", response.tags);
      return response.tags;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { isLoading, data = [] } = useQuery({
    queryKey: ["search-data"],
    queryFn: fetchData,
  });

  const { isLoading: isChannelLoading, data: channelData = [] } = useQuery({
    queryKey: ["channel-data"],
    queryFn: getChannelData,
  });
  
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
        };
        setLoading(true);
        const response = await API.post(
          `social_login/?&email=${
            userData?.email
          }&time=${new Date().toString()}`,
          mainFormData
        );
        setUser(response);
        // sessionStorage.setItem("user", JSON.stringify(response));
        setCookie("user", response);
        router.push("/home");
      } else {
        setLoading(false);
        console.error("User or email is null");
      }
    } catch (error) {
      console.error("Error during social sign-in:", error);
    }
  };

  return (
    <>
      <div className="splash-intro">
        <div className="spashHub">
          <span className="logo-splash">
            <img src="/assets/logo_fliegenglas.svg" alt="logo" />
            <h6>
              WIR MACHEN<br></br> WISSEN HÖRBAR.
            </h6>
          </span>

          {loading ? (
            <div className="w-full">
              <img
                src="\assets\loader-animated-gif.gif"
                alt="llll"
                className="w-60 h-60 m-auto"
              />
            </div>
          ) : (
            <div className="button-splash new-home-buttons">
              <p>
                Bitte verwende bei Fliegenglas immer<br></br> die gleiche
                E-Mail-Adresse.
              </p>

              <Link
                href=""
                className="button log-set rounded-md"
                onClick={(e) => socialSignIn(e, "apple")}
              >
                <img src="/assets/apple-logo.svg" className="md hydrated" />
                Mit Apple anmelden
              </Link>
              <Link
                href=""
                className="button google-set rounded-md"
                onClick={(e) => socialSignIn(e, "google")}
              >
                <img src="/assets/google.svg" className="md hydrated" />
                Mit Google anmelden
              </Link>
              <Link className="button rounded-md" href="/auth/login-step">
                Mit Deiner E-Mail anmelden
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
