"use client"
import { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import useTitle from "@hooks/useTitle";
import API from "@lib/API";
import { UserProvider, useUser } from "context/UserContext";

export default function Feedback() {
  useTitle("Feedback")
  const [feedback, sendFeedback] = useState<any>("")
  const { user }: any = useUser();
    const mutation = useMutation({
    mutationFn: async () => {
      return await API.get(`sendFeedback/?&email=${user.email}&feedback=${feedback}&time=${new Date().toString()}`);
    },
    onSuccess: () => {
      // route.push(`/auth/login-step/login-otp?email=${encodeURIComponent(email)}`);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const handleSubmit = () => {
    if (feedback) {
      mutation.mutate();
    } else {
      console.error("Feedback is required");
    }
  };

  return (
    <div id="login-page" className="px-4 w-full mt-10 flex items-center justify-center">
      <div className="loginInner bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="header mb-4">
          <a href="" className="text-white flex items-center">
            <HiArrowLeft className="text-lg" />
          </a>
        </div>
        <div className="container">
          <div className="form">
            <h1 className="text-white text-2xl mb-4">Dein Feedback</h1>
            <label htmlFor="email" className="text-white block mb-2">Deine E-Mail Adresse:</label>
            <input
              id="email"
              className="bg-white text-black rounded-sm p-3 w-full mb-4"
              placeholder="E-Mail"
              type="email"
              value={user.email}
              readOnly
            />
            <label htmlFor="feedback" className="text-white block mb-2">Deine Kommentare oder Fragen:</label>
            <textarea
              id="feedback"
              value={feedback}
              className="bg-white text-black rounded-sm p-3 w-full h-24 resize-none mb-4"
              placeholder="Deine Kommentare oder Fragen"
              onChange={(event: any) => sendFeedback(event?.target.value)}
            ></textarea>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>
              Absenden
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}
