"use client";
import "./login-otp.css";
import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../../../../context/UserContext";
import { useMutation } from "@tanstack/react-query";
import useTitle from "@hooks/useTitle";
import API from "@lib/API";
import ErrorPopup from "@components/ErrorPopUp";
import { setCookie } from "cookies-next";

export default function Loginstep() {
  useTitle("Login Otp");
  const route = useRouter();
  const { setUser }: any = useUser();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      return await API.post(
        `user_login/?&email=${email}&password=${password}&time=${new Date().toString()}`,
        {
          email: email,
          password: password,
          time: new Date().toString(),
        }
      );
    },
    onSuccess: (response: any) => {
      if (response === "error") {
        setError(
          "Die Anmeldung hat nicht funktioniert. Bitte prüfe Deine E-Mail-Adresse oder Dein Passwort."
        );
      } else {
        setUser(response);
        sessionStorage.setItem("user", JSON.stringify(response));
        setCookie("user", JSON.stringify(response));
        route.push("/home");
      }
    },
    onError: (error: any) => {
      console.error("Error sending email:", error);
      setError(
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später noch einmal."
      );
    },
  });

  const handleSubmit = () => {
    if (password) {
      mutation.mutate();
    } else {
      console.error("Password is required");
    }
  };

  const handleClosePopup = () => {
    setError(null);
  };

  return (
    <>
      <div id="login-page" className="px-4 flex justify-center w-full">
        <div className="loginInner max-w-[400px]">
          <div className="header">
            <Link href="/auth/login">
              <div className="py-4 pr-4 text-white">
                <HiArrowLeft className="text-lg" />
              </div>
            </Link>
            <span className="text-white">E-Mail: {email}</span>
          </div>
          <div className="w-full">
            <div className="form-view">
              <div className="log-otp">
                <label>Anmelde-Link versendet!</label>
                <p>
                  Ein Anmelde-Link wurde an Deine E-Mail-Adresse versendet.
                  Bitte prüfe Dein E-Mail-Postfach und klicke auf den
                  Anmelde-Link. Falls Du keine E-Mail bekommst, prüfe bitte
                  Deinen Spam-Ordner oder schreibe uns an
                  fliegen@fliegenglas.com.
                </p>
              </div>
              <div className="log-otp">
                <p>
                  Sollte der Anmelde-Link in Deiner E-Mail nicht funktionieren,
                  melde Dich bitte mit dem mitgesendeten Einmal-Passwort an:
                </p>
                <input
                  className="rounded-md p-3 h-[50px] w-full text-black"
                  type="number"
                  name="password"
                  placeholder="Einmal-Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="submit"
                  value="Weiter"
                  onClick={handleSubmit}
                  className={`p-3 h-[50px] button rounded-md yellow ${
                    mutation.isPending ? " flie-loader" : ""
                  }`}
                  disabled={!password || mutation.isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <ErrorPopup
          message={error}
          onClose={handleClosePopup}
          heading={"Hinweis"}
          type="login"
        />
      )}
    </>
  );
}
