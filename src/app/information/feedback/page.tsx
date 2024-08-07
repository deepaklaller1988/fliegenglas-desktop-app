
"use client"
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useTitle from "@hooks/useTitle";
import API from "@lib/API";
import { useUser } from "context/UserContext";
import Form from "@components/Form";

export default function Feedback() {
  useTitle("Feedback");
  const [feedback, setFeedback] = useState("");
  const { user }: any = useUser();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await API.get(`sendFeedback/?email=${user.email}&feedback=${feedback}&time=${new Date().toString()}`);
      return response.data;
    },
    onSuccess: () => {
      alert("Feedback sent successfully");
      setFeedback("");
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
    <Form
      title="Dein Feedback"
      placeholder="Deine Kommentare oder Fragen"
      value={feedback}
      onChange={(e) => setFeedback(e.target.value)}
      onSubmit={handleSubmit}
      buttonText="Absenden"
      type="textarea"
      additionalContent={
        <div>
          <label htmlFor="email" className="text-white block mb-2">Deine E-Mail Adresse:</label>
          <input
            id="email"
            className="bg-white text-black rounded-sm p-3 w-full mb-4"
            placeholder="E-Mail"
            type="email"
            value={user?.email}
            readOnly
          />
        </div>
      }
    />
  );
}

