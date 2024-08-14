
"use client"
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useTitle from "@hooks/useTitle";
import API from "@lib/API";
import { useUser } from "context/UserContext";
import Form from "@components/Form";
import { toasterSuccess } from "@components/core/Toaster";
import { useRouter } from "next/navigation";
import useRole from "@hooks/useRole";

export default function UpdateEmail() {
  useTitle("Update Email");
  const { user }: any = useUser();
  const router = useRouter();
  const [roleLoading, roleData] = useRole();
  const [email, setEmail] = useState<string>("");

  const mutation :any= useMutation({
    mutationFn: async () => {
      const response = await API.post(`changeEmail/?userID=${user.id}&email=${email}&time=${new Date().toString()}`, {
        email: email,
        userID: user.id,
        time: new Date().toString()
      });
      return response.data;
    },
    onSuccess: () => {
      toasterSuccess("Update Email SucessFully !",1000,"id")
      setEmail("");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const handleSubmit = () => {
    if (email) {
      mutation.mutate();
    } else {
      console.error("Email is required");
    }
  };


  if(roleLoading && !roleData.id){
    router.push('/auth/login'); 
    return null;
  }
  return (
    <Form
      title="Deine E-Mail-Adresse"
      label="Hast Du eine neue E-Mail Adresse? Gib sie hier ein:"
      placeholder="Enter new Email"
      value={email}
      isPending={mutation.isPending}
      onChange={(e) => setEmail(e.target.value)}
      onSubmit={handleSubmit}
      buttonText="Speichern"
      type="email"
      additionalContent={
        <div>
          <h1 className="text-white mb-4">{user?.email}</h1>
        </div>
      }
    />
  );
}
