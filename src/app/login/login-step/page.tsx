"use client"
import { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import "./login-step.css";

export default function Loginstep() {
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email) {
      setError("Bitte geben Sie zuerst eine E-Mail-Adresse ein.");
    } else if (!isChecked) {
      setError("Bitte markieren Sie das Kontrollkästchen.");
    } else {
      setError("");
      // Logic to send the email
      console.log("Email sent to:", email);
    }
  };

  return (
    <div id="login-page" className="px-4 w-full flex items-center justify-center">
      <div className="loginInner">
        <div className="header">
          <a href="/login">
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
                className="bg-white text-black rounded-lg p-3"
                placeholder="E-Mail"
                type="email"
                value={email}
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
            {error && <p className="text-red-500">{error}</p>}
            <button
              onClick={handleSubmit}
              className="button yellow flie-loader rounded-lg"
              disabled={!email || !isChecked}
            >
              Anmelde-Link senden
            </button>
            <Link href="login-step/login-otp" className="text-white">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
