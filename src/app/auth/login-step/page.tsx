"use client"
import { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import "./login-step.css";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import useTitle from "@hooks/useTitle";
import API from "@lib/API";

export default function Loginstep() {
  useTitle("Login Step")
  const route = useRouter();
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");

  const mutation:any = useMutation({
    mutationFn: async () => {
      return await API.post(`autoLogin/?&email=${email}&time=${new Date().toString()}`, {
        email: email,
        time: new Date().toString(),
      });
    },
    onSuccess: () => {
      route.push(`/auth/login-step/login-otp?email=${encodeURIComponent(email)}`);
      
    },
    onError: (error:any) => {
      console.error("Mutation error:", error);
    },
  });

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = () => {
    if (!email) {
      setError("Bitte geben Sie zuerst eine E-Mail-Adresse ein.");
    } else if (!validateEmail(email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    } else if (!isChecked) {
      setError("Bitte markieren Sie das Kontrollkästchen.");
    } else {
      setError("");
     mutation.mutate();
    }
  };

  return (
    <div id="login-page" className="px-4 w-full flex items-center justify-center">
      <div className="loginInner">
        <div className="header">
          <a href="/auth/login">
            <div className="py-4 pr-4 text-white">
              <HiArrowLeft className="text-lg" />
            </div>
          </a>
        </div>
        <div className="container">
          <div className="form">
            <label>Deine E-Mail-Addresse:</label>
            <div className="form-view">
              <input
                className="bg-white text-black rounded-md p-3 h-[50px]"
                placeholder="E-Mail"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <p>An Deine E-Mail Adresse senden wir einen Anmelde-Link, um Dich in der App anzumelden. Prüfe bitte, ob Deine E-Mail korrekt eingegeben wurde.</p>
            </div>
          </div>
          <div id="login" className="small-text">
            <div className="form-view">
              <div className="privacy">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <span className="text-white">
                  Ich erkläre mich mit den <a href="">AGB</a> und der <a href="">Datenschutzerklärung</a> von Fliegenglas einverstanden.
                </span>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-2 ">{error}</p>}
            <button
              onClick={handleSubmit}
              className={`button ${isChecked && email ? "yellow":""} rounded-md h-[50px] ${mutation.isPending  ? 'flie-loader yellow' : ''}`}
              disabled={!email || !isChecked || mutation.isPending }
            >
              Anmelde-Link senden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
